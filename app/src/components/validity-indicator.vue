<template>
  <div class="validity-indicator">
    <!-- <svg
      v-if="loading"
      width="24"
      height="24"
      viewBox="0 0 16 16"
      fill="none"
      class="loading"
    >
      <path
        d="M8 0.75C8.17188 0.75 8.33333 0.783854 8.48438 0.851562C8.63542 0.914062 8.76823 1.0026 8.88281 1.11719C8.9974 1.23177 9.08594 1.36458 9.14844 1.51562C9.21615 1.66667 9.25 1.82812 9.25 2C9.25 2.17188 9.21615 2.33333 9.14844 2.48438C9.08594 2.63542 8.9974 2.76823 8.88281 2.88281C8.76823 2.9974 8.63542 3.08854 8.48438 3.15625C8.33333 3.21875 8.17188 3.25 8 3.25C7.82812 3.25 7.66667 3.21875 7.51562 3.15625C7.36458 3.08854 7.23177 2.9974 7.11719 2.88281C7.0026 2.76823 6.91146 2.63542 6.84375 2.48438C6.78125 2.33333 6.75 2.17188 6.75 2C6.75 1.82812 6.78125 1.66667 6.84375 1.51562C6.91146 1.36458 7.0026 1.23177 7.11719 1.11719C7.23177 1.0026 7.36458 0.914062 7.51562 0.851562C7.66667 0.783854 7.82812 0.75 8 0.75ZM2.63281 3.75781C2.63281 3.60156 2.66146 3.45573 2.71875 3.32031C2.77604 3.1849 2.85417 3.06771 2.95312 2.96875C3.05729 2.86458 3.17708 2.78385 3.3125 2.72656C3.45312 2.66406 3.60156 2.63281 3.75781 2.63281C3.91406 2.63281 4.0599 2.66406 4.19531 2.72656C4.33073 2.78385 4.44792 2.86458 4.54688 2.96875C4.65104 3.06771 4.73177 3.1849 4.78906 3.32031C4.85156 3.45573 4.88281 3.60156 4.88281 3.75781C4.88281 3.91406 4.85156 4.0625 4.78906 4.20312C4.73177 4.33854 4.65104 4.45833 4.54688 4.5625C4.44792 4.66146 4.33073 4.73958 4.19531 4.79688C4.0599 4.85417 3.91406 4.88281 3.75781 4.88281C3.60156 4.88281 3.45312 4.85417 3.3125 4.79688C3.17708 4.73958 3.05729 4.66146 2.95312 4.5625C2.85417 4.45833 2.77604 4.33854 2.71875 4.20312C2.66146 4.0625 2.63281 3.91406 2.63281 3.75781ZM2 7C2.14062 7 2.27083 7.02604 2.39062 7.07812C2.51042 7.13021 2.61458 7.20312 2.70312 7.29688C2.79688 7.38542 2.86979 7.48958 2.92188 7.60938C2.97396 7.72917 3 7.85938 3 8C3 8.14062 2.97396 8.27083 2.92188 8.39062C2.86979 8.51042 2.79688 8.61719 2.70312 8.71094C2.61458 8.79948 2.51042 8.86979 2.39062 8.92188C2.27083 8.97396 2.14062 9 2 9C1.85938 9 1.72917 8.97396 1.60938 8.92188C1.48958 8.86979 1.38281 8.79948 1.28906 8.71094C1.20052 8.61719 1.13021 8.51042 1.07812 8.39062C1.02604 8.27083 1 8.14062 1 8C1 7.85938 1.02604 7.72917 1.07812 7.60938C1.13021 7.48958 1.20052 7.38542 1.28906 7.29688C1.38281 7.20312 1.48958 7.13021 1.60938 7.07812C1.72917 7.02604 1.85938 7 2 7ZM2.88281 12.2422C2.88281 12.1224 2.90625 12.0104 2.95312 11.9062C3 11.7969 3.0625 11.7031 3.14062 11.625C3.21875 11.5469 3.3099 11.4844 3.41406 11.4375C3.52344 11.3906 3.63802 11.3672 3.75781 11.3672C3.8776 11.3672 3.98958 11.3906 4.09375 11.4375C4.20312 11.4844 4.29688 11.5469 4.375 11.625C4.45312 11.7031 4.51562 11.7969 4.5625 11.9062C4.60938 12.0104 4.63281 12.1224 4.63281 12.2422C4.63281 12.362 4.60938 12.4766 4.5625 12.5859C4.51562 12.6901 4.45312 12.7812 4.375 12.8594C4.29688 12.9375 4.20312 13 4.09375 13.0469C3.98958 13.0938 3.8776 13.1172 3.75781 13.1172C3.63802 13.1172 3.52344 13.0938 3.41406 13.0469C3.3099 13 3.21875 12.9375 3.14062 12.8594C3.0625 12.7812 3 12.6901 2.95312 12.5859C2.90625 12.4766 2.88281 12.362 2.88281 12.2422ZM8 13.25C8.20833 13.25 8.38542 13.3229 8.53125 13.4688C8.67708 13.6146 8.75 13.7917 8.75 14C8.75 14.2083 8.67708 14.3854 8.53125 14.5312C8.38542 14.6771 8.20833 14.75 8 14.75C7.79167 14.75 7.61458 14.6771 7.46875 14.5312C7.32292 14.3854 7.25 14.2083 7.25 14C7.25 13.7917 7.32292 13.6146 7.46875 13.4688C7.61458 13.3229 7.79167 13.25 8 13.25ZM11.6172 12.2422C11.6172 12.0651 11.6771 11.9167 11.7969 11.7969C11.9167 11.6771 12.0651 11.6172 12.2422 11.6172C12.4193 11.6172 12.5677 11.6771 12.6875 11.7969C12.8073 11.9167 12.8672 12.0651 12.8672 12.2422C12.8672 12.4193 12.8073 12.5677 12.6875 12.6875C12.5677 12.8073 12.4193 12.8672 12.2422 12.8672C12.0651 12.8672 11.9167 12.8073 11.7969 12.6875C11.6771 12.5677 11.6172 12.4193 11.6172 12.2422ZM14 7.5C14.1354 7.5 14.2526 7.54948 14.3516 7.64844C14.4505 7.7474 14.5 7.86458 14.5 8C14.5 8.13542 14.4505 8.2526 14.3516 8.35156C14.2526 8.45052 14.1354 8.5 14 8.5C13.8646 8.5 13.7474 8.45052 13.6484 8.35156C13.5495 8.2526 13.5 8.13542 13.5 8C13.5 7.86458 13.5495 7.7474 13.6484 7.64844C13.7474 7.54948 13.8646 7.5 14 7.5ZM12.2422 2.38281C12.4297 2.38281 12.6068 2.41927 12.7734 2.49219C12.9401 2.5651 13.0859 2.66406 13.2109 2.78906C13.3359 2.91406 13.4349 3.0599 13.5078 3.22656C13.5807 3.39323 13.6172 3.57031 13.6172 3.75781C13.6172 3.94531 13.5807 4.1224 13.5078 4.28906C13.4349 4.45573 13.3359 4.60156 13.2109 4.72656C13.0859 4.85156 12.9401 4.95052 12.7734 5.02344C12.6068 5.09635 12.4297 5.13281 12.2422 5.13281C12.0547 5.13281 11.8776 5.09635 11.7109 5.02344C11.5443 4.95052 11.3984 4.85156 11.2734 4.72656C11.1484 4.60156 11.0495 4.45573 10.9766 4.28906C10.9036 4.1224 10.8672 3.94531 10.8672 3.75781C10.8672 3.57031 10.9036 3.39323 10.9766 3.22656C11.0495 3.0599 11.1484 2.91406 11.2734 2.78906C11.3984 2.66406 11.5443 2.5651 11.7109 2.49219C11.8776 2.41927 12.0547 2.38281 12.2422 2.38281Z"
        fill="#C5C5C5"
      />
    </svg> -->
    <div
      v-if="!loading && messageEmpty && !hasConfigError && errorCount === 0 && warningCount === 0"
      class="warning-label"
    >
      <icon icon="warning" :width="24" :height="24" color="#FFCC00" />
      <span>message is empty</span>
    </div>
    <div
      v-if="!loading && !messageEmpty && !hasConfigError && errorCount === 0 && warningCount === 0"
      class="valid"
    >
      <icon icon="checkmark" :width="24" :height="24" />
      <span>valid</span>
    </div>
    <button
      v-if="!loading && (errorCount > 0 || warningCount > 0)"
      class="problem-button"
      @click="clickError"
    >
      <icon v-if="errorCount > 0" icon="crossmark-circled" :width="24" :height="24" color="#F48771" />
      <span v-if="errorCount > 0">{{ errorCount }}</span>
      <icon v-if="warningCount > 0" icon="warning" :width="24" :height="24" color="#FFCC00" />
      <span v-if="warningCount > 0">{{ warningCount }}</span>
    </button>
    <monaco-style-tooltip
      v-if="!loading && hasConfigError"
      class="problem-label"
    >
      <icon v-if="hasConfigError" icon="config" :width="24" :height="24" color="#F48771" />
      <span v-if="hasConfigError">config error</span>
      <template #tooltip-content>
        Hover the error symbol in the status bar on the bottom for more information
      </template>
    </monaco-style-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue'
import { monaco } from '../lib/monaco'
import { isCommitMessageEmpty } from '../lib/message-empty-check'
import type { TabStore } from '../stores/tab.store'
import { tabStoreSymbol } from '../stores/tab.store'
import Icon from './icon.vue'
import MonacoStyleTooltip from './monaco-style-tooltip.vue'

export default defineComponent({
  name: 'ValidityIndicator',
  components: {
    Icon,
    MonacoStyleTooltip,
  },
  setup() {
    const tabStore = inject<TabStore>(tabStoreSymbol)

    // eslint-disable-next-line no-undef
    const loading = ref<boolean>(false)

    const errorCount = computed(
      () =>
        tabStore?.state.messageEditorMarkers.filter(
          (marker) => marker.severity === monaco.MarkerSeverity.Error
        ).length ?? 0
    )
    const warningCount = computed(
      () =>
        tabStore?.state.messageEditorMarkers.filter(
          (marker) => marker.severity === monaco.MarkerSeverity.Warning
        ).length ?? 0
    )
    const hasConfigError = computed(() => tabStore?.state.configErrors.length ?? 0 > 0)
    const messageEmpty = computed(() => isCommitMessageEmpty(tabStore?.state.commitMessage || ''))

    const clickError = () => tabStore?.messageEditorNextMarkerActionTriggered()

    return {
      errorCount,
      warningCount,
      clickError,
      loading,
      hasConfigError,
      messageEmpty,
    }
  },
})
</script>

<style scoped>
.problem-button, .problem-label, .warning-label {
  display: inline-flex;
  align-items: center;
  color: #737373;
  background-color: transparent;
  padding: 0.5rem;
  border: none;
  font: inherit;
}
.problem-button {
  cursor: pointer;
}
.problem-button:focus {
  outline: none;
}
.problem-button:hover {
  color: #cacaca;
}

.loading {
  padding: 0.5rem;
  animation: loading 2s linear infinite;
}

.validity-indicator {
  width: 12rem;
}

.valid {
  color: #adffad;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem;
}
.valid > span {
  margin-left: 0.5rem;
}

.problem-button > span, .problem-label > span, .warning-label > span {
  margin-left: 0.5rem;
}
.problem-button > span + svg, .problem-label > span + svg, .warning-label > span + svg {
  margin-left: 1rem;
}

@keyframes loading {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}
</style>
