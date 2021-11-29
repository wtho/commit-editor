<template>
  <div class="status-bar">
    <button class="status-button" @click="toggleConfigEditor">
      <icon icon="config" />
      <span>commitlint config</span>
      <icon icon="chevron-up" :flipped-vertically="configEditorOpen" />
    </button>
    <monaco-style-tooltip
      v-if="configErrorTexts.length > 0"
      position="top"
      width="12rem"
    >
      <button class="status-button" @click="showConfigError">
        <icon
          icon="crossmark-circled"
          :width="20"
          :height="20"
          color="#F48771"
        />
      </button>
      <template #tooltip-content>
        <template v-for="text in configErrorTexts" :key="text">
          <span>{{ text }}</span>
        </template>
      </template>
    </monaco-style-tooltip>
    <div class="space"></div>
    <monaco-style-tooltip position="top" width="12rem">
      <a
        href="https://www.conventionalcommits.org/"
        target="_blank"
        rel="noreferrer"
        aria-label="Open conventional commits spec in new tab"
        class="status-button"
      >
        <div class="conventional-commits-logo"></div>
        <span>spec</span>
        <icon icon="external-link" :width="14" :height="20" />
      </a>

      <template #tooltip-content>
        This link takes you to the <b>Conventional Commits specification</b>
      </template>
    </monaco-style-tooltip>
    <monaco-style-tooltip position="top" width="12rem">
      <a
        href="https://semantic-release.gitbook.io/semantic-release/"
        target="_blank"
        rel="noreferrer"
        aria-label="Open semantic release spec in new tab"
        class="status-button"
      >
        <icon icon="semantic-release" />
        <span>docs</span>
        <icon icon="external-link" :width="14" :height="20" />
      </a>
      <template #tooltip-content>
        This link takes you to the <b>Semantic Release specification</b>
      </template>
    </monaco-style-tooltip>
    <monaco-style-tooltip position="top" width="12rem" align="inline-end">
      <a
        href="https://github.com/wtho/commit-editor"
        target="_blank"
        rel="noreferrer"
        aria-label="Open GitHub Repository of this App"
        class="status-button"
      >
        <icon icon="github" />
        <span>repo</span>
        <icon icon="external-link" :width="14" :height="20" />
      </a>
      <template #tooltip-content>
        This link takes you to the <b>GitHub Repository</b> of this project
      </template>
    </monaco-style-tooltip>
    <!-- <monaco-style-tooltip position="top" width="12rem" align="inline-end">
      <a
        href="https://www.buymeacoffee.com/wtho"
        target="_blank"
        rel="noreferrer"
        aria-label="Support me by buying me a coffee"
        class="status-button"
      >
        <icon icon="heart" />
        <span>buy me a coffee</span>
        <icon icon="external-link" :width="14" :height="20" />
      </a>
      <template v-slot:tooltip-content>
        Support me if you like this app and feel like it!
      </template>
    </monaco-style-tooltip> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import type { CommitEditorStore, } from '../stores/commit-editor.store'
import { commitEditorStoreSymbol, } from '../stores/commit-editor.store'
import MonacoStyleTooltip from './monaco-style-tooltip.vue'
import Icon from './icon.vue'

export default defineComponent({
  name: 'StatusBar',
  components: {
    MonacoStyleTooltip,
    Icon,
  },
  setup() {
    const commitEditorStore = inject<CommitEditorStore>(commitEditorStoreSymbol)
    const toggleConfigEditor = () => commitEditorStore?.toggleConfigEditor()

    const configEditorOpen = computed(
      () => commitEditorStore?.state.configEditorOpen
    )
    const configErrorTexts = computed(() => {
      const parseErrors = commitEditorStore?.state.parseErrorMessages ?? []
      const markers = commitEditorStore?.state.configMarkerMessages ?? []

      return [
        ...parseErrors,
        `${
          markers.length > 0
            ? `${markers.length} ${
                markers.length === 1 ? 'Problem' : 'Problems'
              } (click to reveal)`
            : ''
        }`,
      ].filter((msg) => !!msg)
    })

    const showConfigError = () =>
      commitEditorStore?.configEditorNextMarkerActionTriggered()

    return {
      toggleConfigEditor,
      configEditorOpen,
      configErrorTexts,
      showConfigError,
    }
  },
})
</script>

<style scoped>
.status-bar {
  flex-direction: row;
  display: flex;
  height: 2rem;
  background-color: #232323;
  font-size: 0.9rem;
  border-top: 1px solid #3a3a3a;
}
.status-button {
  cursor: pointer;
  font: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.1rem 0.5rem;
}
.status-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.status-button:active {
  background-color: rgba(255, 255, 255, 0.3);
}
.status-button > svg + span,
.status-button > div + span,
.status-button > span + svg {
  margin-left: 0.3rem;
}

.space {
  flex-grow: 1;
}

.conventional-commits-logo {
  width: 12px;
  height: 12px;
  background-color: transparent;
  border: 1px solid currentColor;
  border-radius: 50%;
}
</style>
