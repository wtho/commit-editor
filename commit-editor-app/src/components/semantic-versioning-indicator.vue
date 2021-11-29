<template>
  <monaco-style-tooltip width="200%">
    <div class="semantic-version-indicator mono" :class="{ update: hasUpdate }">
      <template v-if="major">
        <icon icon="flash" :width="10" :height="16" color="#fe5196" alt="A flash icon indicating a version update" />.0.0
      </template>
      <template v-else-if="minor">
        1.<icon icon="flash" :width="10" :height="16" color="#fe5196" alt="A flash icon indicating a version update" />.0
      </template>
      <template v-else-if="patch">
        1.2.<icon icon="flash" :width="10" :height="16" color="#fe5196" alt="A flash icon indicating a version update" />
      </template>
      <template v-else> 1.2.4 </template>
    </div>

    <template #tooltip-content>
      <template v-if="major">
        This commit introduces <b>a new major version</b> according to
        conventional commits, semantic release and semantic versioning.
      </template>
      <template v-else-if="minor">
        This commit introduces <b>a new minor version</b> according to
        conventional commits, semantic release and semantic versioning.
      </template>
      <template v-else-if="patch">
        This commit introduces <b>a new patch version</b> according to
        conventional commits, semantic release and semantic versioning.
      </template>
      <template v-else>
        This commit introduces no new version according to conventional commits
        and semantic versioning.
      </template>
    </template>
  </monaco-style-tooltip>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import type { TabStore } from '../stores/tab.store'
import { tabStoreSymbol } from '../stores/tab.store'
import MonacoStyleTooltip from './monaco-style-tooltip.vue'
import Icon from './icon.vue'

export default defineComponent({
  name: 'SemanticVersioningIndicator',
  components: {
    MonacoStyleTooltip,
    Icon,
  },
  setup() {
    const tabStore = inject<TabStore>(tabStoreSymbol)

    const major = computed(
      () => tabStore?.state.messageSemVerUpdateState.major ?? false
    )
    const minor = computed(
      () => tabStore?.state.messageSemVerUpdateState.minor ?? false
    )
    const patch = computed(
      () => tabStore?.state.messageSemVerUpdateState.patch ?? false
    )
    const hasUpdate = computed(() => major.value || minor.value || patch.value)

    return {
      hasUpdate,
      major,
      minor,
      patch,
    }
  },
})
</script>

<style scoped>
.semantic-version-indicator {
  line-height: 0.9;
  font-weight: 700;
  color: grey;
  padding: 0.2rem 2rem;
}
.semantic-version-indicator.update {
  color: white;
}
.semantic-version-indicator > * {
  vertical-align: bottom;
}

.monaco-editor .monaco-hover {
  max-height: 0px;
  width: 200%;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;

  max-height: 0px;
  border: none;
}
.tooltip-container:hover .monaco-hover {
  max-height: unset;
  border: 1px solid #454545;
}
</style>
