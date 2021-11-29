<template>
  <action-panel />
  <div class="editors">
    <message-editor />
    <div v-if="configEditorOpen" class="divider"></div>
    <config-editor />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, provide, watch } from 'vue'
import { tabStoreSymbol, createTabStore } from '../stores/tab.store'
import MessageEditor from '../components/message-editor.vue'
import ConfigEditor from '../components/config-editor.vue'
import ActionPanel from '../components/action-panel.vue'
import type { Config } from '../types'
import type { CommitEditorStore, } from '../stores/commit-editor.store'
import { commitEditorStoreSymbol, } from '../stores/commit-editor.store'

export default defineComponent({
  name: 'EditorTab',
  components: {
    MessageEditor,
    ConfigEditor,
    ActionPanel,
  },
  setup: () => {
    const defaultConfig: Config = {
      extends: ['@commitlint/config-conventional'],
      rules: {
        'type-empty': [2, 'never'],
        'type-enum': [
          2,
          'always',
          [
            'build',
            'chore',
            'ci',
            'docs',
            'feat',
            'fix',
            'perf',
            'refactor',
            'revert',
            'style',
            'test',
          ],
        ],
      },
    }
    const commitEditorStore = inject<CommitEditorStore>(commitEditorStoreSymbol)

    const initialMessage: string = commitEditorStore?.state.initialMessage ?? ''
    const initialConfig = (commitEditorStore?.state.initialConfig ?? defaultConfig) as Config

    const tabStore = createTabStore({ config: initialConfig, initialMessage })
    provide(
      tabStoreSymbol,
      tabStore,
    )

    const configEditorOpen = computed(
      () => commitEditorStore?.state.configEditorOpen
    )

    // check if this tab is the open one
    watch(() => tabStore.state.configMarkerMessages, (configMarkerMessages) => {
      commitEditorStore?.setConfigMarkerMessages([...configMarkerMessages])
    })
    watch(() => tabStore.state.parseErrorMessages, (parseErrorMessages) => {
      commitEditorStore?.setParseErrorMessages([...parseErrorMessages])
    })


    return {
      configEditorOpen,
    }
  },
})
</script>

<style scoped>
.editors {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.divider {
  height: 6px;
  background-color: #353535;
  width: 100%;
  z-index: 1;
  transition: background-color 0.2s ease-in-out;
}
.divider:hover {
  background-color: #57818e;
  cursor: row-resize;
  transition: background-color 0.3s 0.2s ease-in-out;
}
</style>
