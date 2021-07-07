<template>
  <div ref="editorDiv" class="config-editor" :class="{ open }" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  shallowRef,
} from 'vue'
import { monaco } from '../lib/monaco'
import type { Monaco } from '../lib/monaco'
import type { ParserOptions } from '@commitlint/types'
import { parse as parseJson } from 'jsonc-parser'
import {
  CommitEditorStore,
  commitEditorStoreSymbol,
} from '../stores/commit-editor.store'
import { TabStore, tabStoreSymbol } from '../stores/tab.store'
import type { Config } from '../types'
import { extendableCommitlintConfigs } from '../lib/extendable-commitlint-configs'
import { availableParserPresets } from '../lib/available-parser-presets'
import { initConfigSchema } from '../lib/config-json-schema'
import { debounce } from '../lib/debounce'

export default defineComponent({
  name: 'config-editor',
  setup: () => {
    const configEditor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(
      null
    )
    ;(window as any).configEditor = configEditor
    const configModel = shallowRef<monaco.editor.ITextModel | null>(null)
    const editorDiv = ref<HTMLDivElement | null>(null)

    const tabStore = inject<TabStore>(tabStoreSymbol)
    const commitEditorStore = inject<CommitEditorStore>(commitEditorStoreSymbol)

    commitEditorStore?.resizeTriggerObservable.subscribe(async () => {
      await new Promise<void>((rs) =>
        requestAnimationFrame(() => requestAnimationFrame(() => rs()))
      )
      configEditor.value?.layout()
    })

    const open = computed(() => commitEditorStore?.state.configEditorOpen)

    const handleConfigUpdate = async (monaco: Monaco, configStr: string) => {
      const nextConfig = parseJson(configStr) as Config
      // const configMarkers = monaco.editor
      //   .getModelMarkers({})
      //   .filter(
      //     (marker) =>
      //       marker.resource.toString() === 'internal://server/config.json'
      //   )
      // if (configMarkers.length > 0) {
      //   tabStore?.setConfigMarkerMessages(
      //     configMarkers.map((marker) => marker.message)
      //   )
      //   return
      // }
      if (typeof nextConfig !== 'object' || Array.isArray(nextConfig)) {
        tabStore?.setParseErrorMessages(['Config is not an JSON object'])
        return
      }
      const { extends: extendingConfNames, rules, defaultIgnores } = nextConfig
      const extendedConfig: Config = [
        ...(extendingConfNames ?? []).map(
          (confName: string) => extendableCommitlintConfigs[confName] ?? {}
        ),
        { rules, defaultIgnores },
      ].reduce((aggregatedConf: Config, conf: Config) => {
        const mergedConf = {
          ...aggregatedConf,
        }
        Object.entries(conf).forEach(([confRawKey, confVal]) => {
          const confKey = confRawKey as keyof Config
          if (typeof confVal === 'object') {
            mergedConf[confKey] = {
              ...(mergedConf[confKey] ?? ({} as any)),
              ...confVal,
            }
          } else {
            mergedConf[confKey] = confVal as any
          }
        })
        return mergedConf
      })
      if (
        typeof extendedConfig?.parserPreset === 'string' &&
        extendedConfig.parserPreset in availableParserPresets
      ) {
        extendedConfig.parserPreset =
          availableParserPresets[extendedConfig.parserPreset]
      }
      let parserOpts = extendedConfig?.parserPreset?.parserOpts as
        | ParserOptions
        | undefined
      if (typeof parserOpts === 'function') {
        parserOpts = await new Promise((rs) =>
          (parserOpts as Function)(
            (_: unknown, opts: { parserOpts?: ParserOptions }) =>
              rs(opts.parserOpts)
          )
        )
      }
      if (parserOpts && typeof parserOpts.commentChar !== 'string') {
        parserOpts.commentChar = '#'
      }
      if (parserOpts) {
        if (extendedConfig.parserPreset) {
          extendedConfig.parserPreset.parserOpts = parserOpts
        }
        extendedConfig.parserOpts = parserOpts
      }

      tabStore?.setConfig(extendedConfig)
    }

    onMounted(() => {
      initConfigSchema(monaco)
      if (configModel.value === null) {
        const uri = monaco.Uri.parse('internal://server/config.json')
        const configStr = `${JSON.stringify(
          tabStore?.state.config ?? {},
          null,
          2
        )}\n\n`
        configModel.value =
          monaco.editor.getModel(uri) ??
          monaco.editor.createModel(configStr, 'json', uri)
      }
      configEditor.value = monaco.editor.create(editorDiv.value!, {
        scrollBeyondLastLine: false,
        model: configModel.value,
      })

      handleConfigUpdate(monaco, configModel.value.getValue())
      const debouncedDispatch = debounce(
        () => handleConfigUpdate(monaco, configModel.value?.getValue()!),
        300
      )
      configEditor.value.onDidChangeModelContent((event) => debouncedDispatch())

      monaco.editor.onDidChangeMarkers((changedEditorUris) => {
        const configModelUri = changedEditorUris.find(
          (uri) => uri.path === '/config.json'
        )
        if (!configModelUri) {
          return
        }
        const markerModels = monaco.editor.getModelMarkers({
          resource: configModelUri,
        })
        tabStore?.setConfigMarkerMessages(
          markerModels.map((marker) => marker.message)
        )
      })

      commitEditorStore?.configEditorNextMarkerActionObservable.subscribe(() => {
        configEditor.value?.getAction('editor.action.marker.next')?.run()
      })
    })

    return {
      open,
      editorDiv,
      commitEditorStore,
    }
  },
})
</script>

<style scoped>
.config-editor {
  width: 100vw;
  height: 0%;
}
.config-editor.open {
  height: calc(50% - 0px);
}
</style>
