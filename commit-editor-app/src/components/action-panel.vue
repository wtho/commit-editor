<template>
  <div class="action-panel">
    <div class="action-panel__start">
      <validity-indicator />
    </div>
    <div class="action-panel__end">
      <semantic-versioning-indicator />
      <monaco-style-tooltip v-if="webSocketOpen" >
        <span class="sync-on">
          Close tab to commit
        </span>
        <template #tooltip-content>
          Your commit message is in sync with git
        </template>
      </monaco-style-tooltip>
      <copy-button />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import {
  CommitEditorStore,
  commitEditorStoreSymbol,
} from '../stores/commit-editor.store'
import ValidityIndicator from '../components/validity-indicator.vue'
import SemanticVersioningIndicator from '../components/semantic-versioning-indicator.vue'
import CopyButton from '../components/copy-button.vue'
import MonacoStyleTooltip from '../components/monaco-style-tooltip.vue'

export default defineComponent({
  name: 'ActionPanel',
  components: {
    ValidityIndicator,
    SemanticVersioningIndicator,
    CopyButton,
    MonacoStyleTooltip,
  },
  setup: () => {
    const commitEditorStore = inject<CommitEditorStore>(commitEditorStoreSymbol)

    const webSocketOpen = computed(
      () => commitEditorStore?.state.webSocketOpen
    )

    return {
      webSocketOpen,
    }
  },
})
</script>

<style scoped>
.action-panel {
  padding: 0.5rem;
  margin-inline-start: 1rem;
  margin-inline-end: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.action-panel__start,
.action-panel__end {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sync-on {
  margin-inline-end: 1rem;
  color: #fffb;
  font-size: 0.8rem;
  text-align: center;
}
</style>
