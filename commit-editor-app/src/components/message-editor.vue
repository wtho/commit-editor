<template>
  <div
    ref="editorDiv"
    class="message-editor"
    :class="{ 'editor--full-height': !configEditorOpen }"
  ></div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  shallowRef,
  onMounted,
  inject,
  watch,
  computed,
} from 'vue'
import { validate } from '../lib/commitlint'
import { monaco } from '../lib/monaco'
import { initMonacoLanguageConventionalCommits } from '../lib/conventional-commits-lang/monaco-language'
import {
  CommitEditorStore,
  commitEditorStoreSymbol,
} from '../stores/commit-editor.store'
import { TabStore, tabStoreSymbol } from '../stores/tab.store'
import type { Config } from '../types'

export default defineComponent({
  name: 'message-editor',
  setup: () => {
    const messageEditor =
      shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)
    const messageModel = shallowRef<monaco.editor.ITextModel | null>(null)
    const editorDiv = ref<HTMLDivElement | null>(null)

    const tabStore = inject<TabStore>(tabStoreSymbol)
    const commitEditorStore = inject<CommitEditorStore>(commitEditorStoreSymbol)

    commitEditorStore?.resizeTriggerObservable.subscribe(async () => {
      await new Promise<void>((rs) =>
        requestAnimationFrame(() => requestAnimationFrame(() => rs()))
      )
      messageEditor.value?.layout()
    })

    const configEditorOpen = computed(
      () => commitEditorStore?.state.configEditorOpen
    )

    const evaluate = async () => {
      if (!messageModel) {
        tabStore?.setCommitMessage('')
        return
      }
      const commitMessage = messageModel.value?.getValue()
      tabStore?.setCommitMessage(commitMessage ?? '')
      if (typeof commitMessage === 'string') {
        commitEditorStore?.sendViaWebSocket(commitMessage)
      }
      const { rules, ...options } = (tabStore?.state.config ?? {}) as Config
      const { markers, semVerUpdate, configErrors } = await validate({
        commitMessage,
        rules,
        options,
      })
      tabStore?.setMessageEditorMarkers(markers)
      tabStore?.setMessageEditorMarkerSemVerUpdateStates(semVerUpdate)
      tabStore?.setParseErrorMessages(configErrors)
    }

    watch(
      () => tabStore?.state.config,
      (conf, _prevConf) => evaluate()
    )

    tabStore?.messageEditorNextMarkerActionObservable.subscribe(() => {
      messageEditor.value?.getAction('editor.action.marker.next')?.run()
    })

    onMounted(() => {
      initMonacoLanguageConventionalCommits(
        monaco,
        messageEditor,
        tabStore as TabStore,
        (outcome: 'success' | 'failure') =>
          commitEditorStore?.copyMessageProcessed(outcome)
      )

      messageModel.value = monaco.editor.createModel(
        tabStore?.state.initialMessage ?? '',
        'conventional-commits'
      )
      messageEditor.value = monaco.editor.create(editorDiv.value!, {
        scrollBeyondLastLine: false,
        theme: 'conventional-commits-theme',
        model: messageModel.value,
      })

      messageEditor.value?.onDidChangeModelContent((_event) => evaluate())

      commitEditorStore?.copyMessageActionObservable.subscribe(() => {
        // TODO: only active tab
        messageEditor.value?.getAction('editor.content.clipboard')?.run()
      })
      commitEditorStore?.globalCopyHotkeyObservable.subscribe(() => {
        // TODO: only active tab
        messageEditor.value?.getAction('editor.content.clipboard')?.run()
      })

      watch(
        () => tabStore?.state.messageEditorMarkers,
        (readOnlyMarkers, _prevValues) => {
          const markers = readOnlyMarkers as monaco.editor.IMarkerData[]
          const model = messageModel.value
          if (model && markers) {
            monaco.editor.setModelMarkers(model, 'linter', markers)
          }
        }
      )

      if (!messageModel.value?.getValue()) {
        messageEditor.value?.getAction('editor.action.triggerSuggest')?.run()
      }
    })

    return {
      editorDiv,
      messageEditor,
      configEditorOpen,
    }
  },
})
</script>

<style scoped>
.message-editor {
  width: 100vw;
  height: calc(50% - 6px);
}
.message-editor.editor--full-height {
  height: 100%;
}
</style>
