<template>
  <button
    class="action vs-dark"
    :class="{
      'action--success': showCopySuccess,
      'action--fail': showCopyFailure,
    }"
    @click="handleCopyButtonClick"
  >
    <div class="action-content">
      <div class="action-content__default">
        copy message
        <div class="monaco-keybinding">
          <span class="monaco-keybinding-key">Ctrl</span
          ><span class="monaco-keybinding-key-separator">+</span
          ><span class="monaco-keybinding-key">B</span>
        </div>
      </div>
      <div class="action-content__success text--green">
        copied
        <icon icon="checkmark" :width="18" :height="18" />
      </div>
      <div class="action-content__fail text--red">
        failed
        <icon icon="crossmark" :width="18" :height="18" />
      </div>
    </div>
  </button>
</template>
<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue'
import {
  CommitEditorStore,
  commitEditorStoreSymbol,
} from '../stores/commit-editor.store'
import Icon from '../components/icon.vue'

export default defineComponent({
  name: 'CopyButton',
  components: {
    Icon,
  },
  setup: () => {
    const commitEditorStore = inject<CommitEditorStore>(commitEditorStoreSymbol)

    const currentCopySuccesses = ref<number[]>([])
    const currentCopyFailures = ref<number[]>([])
    const showCopySuccess = computed(
      () => currentCopySuccesses.value.length > 0
    )
    const showCopyFailure = computed(() => currentCopyFailures.value.length > 0)

    commitEditorStore?.copyMessageResultObservable.subscribe(result => {
      if (result === 'success') {
        currentCopySuccesses.value.push(1)
        new Promise<void>(rs => setTimeout(() => rs(), 1000)).then(() => {
          currentCopySuccesses.value.pop()
        })
      }
      if (result === 'failure') {
        currentCopyFailures.value.push(1)
        new Promise<void>(rs => setTimeout(() => rs(), 1000)).then(() => {
          currentCopyFailures.value.pop()
        })
      }
    })

    const handleCopyButtonClick = () =>
      commitEditorStore?.copyMessageActionTriggered()

    return {
      showCopySuccess,
      showCopyFailure,
      handleCopyButtonClick,
    }
  },
})
</script>

<style scoped>
.action {
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  padding: 0.4rem 0.7rem;
  border-radius: 50px;
  text-decoration: none;
  color: #fffb;
  border: 1.5px solid #ffffff40;
  transition: background-color 0.3s ease, color 0.3s ease;
  min-width: fit-content;
  display: inline-flex;
  flex-direction: row;
  align-items: baseline;
  margin-inline-start: 0.1rem;
}
.action .monaco-keybinding {
  margin-inline-start: 0.5rem;
}
.action:hover {
  background-color: #fff2;
  color: #fff;
}
.action:active {
  transition: background-color 0.1s ease, color 0.1s ease;
  background-color: #fff3;
  color: #fff;
}

.action-content {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}
.action-content__default {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  height: 100%;
  width: 100%;
  transition: transform 0.2s ease-out;
}
.action-content__success,
.action-content__fail {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  transform: translateY(2rem);
  transition: transform 0.2s ease-out;
}
.action-content__success svg,
.action-content__fail svg {
  margin-inline-start: 0.2rem;
}

.action--success .action-content__default,
.action--fail .action-content__default {
  transform: translateY(-2rem);
}
.action--success .action-content__success {
  transform: translateY(-0rem);
}
.action--fail .action-content__fail {
  transform: translateY(-0rem);
}
.text--green {
  color: #adffad;
}
.text--red {
  color: #f48771;
}
</style>
