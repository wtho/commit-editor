<template>
  <main>
    <div class="title-bar">
      <div class="title-bar__start">
        <icon icon="commit-editor-thin" :width="35" :height="35" color="#fe5196" />
        <h1>commit editor</h1>
        <span class="color-grey">powered by conventional commits</span>
      </div>
      <div class="title-bar__end">
      </div>
    </div>

    <editor-tab />
  </main>
  <status-bar />
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import EditorTab from './components/editor-tab.vue'
import StatusBar from './components/status-bar.vue'
import Icon from './components/icon.vue'
import {
  commitEditorStoreSymbol,
  CommitEditorStore,
} from './stores/commit-editor.store'

export default defineComponent({
  name: 'commit-editor',
  components: {
    EditorTab,
    StatusBar,
    Icon,
  },
  setup() {

    const commitEditorStore = inject<CommitEditorStore>(commitEditorStoreSymbol)

    window.addEventListener(
      'resize',
      () => commitEditorStore?.resizeTriggered(),
      false
    )
    window.addEventListener(
      'keydown',
      (event) => {
        if (event.ctrlKey && event.code === 'KeyB') {
          commitEditorStore?.globalCopyHotkeyPressed()
        }
      },
      false
    )

    return {}
  },
})
</script>

<style scoped>
.title-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.6rem;
}
.title-bar__start,
.title-bar__end {
  display: flex;
  flex-direction: row;
  align-items: center;
}

h1 {
  color: #008cff;
  font-size: 2rem;
  font-weight: 100;
  line-height: 1.24;
  margin-inline-end: 1rem;
  margin-inline-start: 0.8rem;
  margin-block-start: 0rem;
  margin-block-end: 0.3rem;
  background: linear-gradient(80deg, #fe5196, #f77062);
  background-clip: text;
  /* text-fill-color: transparent; */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-bar a {
  color: #737373;
  background-color: transparent;
  padding: 0.5rem;
  border: none;
  font: inherit;
  cursor: pointer;
  margin-right: 1rem;
}
.title-bar a:hover {
  color: #cacaca;
}
</style>

<style>
/* cyrillic-ext */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh0NSDulI.woff2)
    format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F,
    U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh2dSDulI.woff2)
    format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh0dSDulI.woff2)
    format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh3tSDulI.woff2)
    format('woff2');
  unicode-range: U+0370-03FF;
}
/* latin-ext */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh09SDulI.woff2)
    format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(/firacode-v10-uU9NCBsR6Z2vfE9aq3bh3dSD.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh0NSDulI.woff2)
    format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F,
    U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh2dSDulI.woff2)
    format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh0dSDulI.woff2)
    format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh3tSDulI.woff2)
    format('woff2');
  unicode-range: U+0370-03FF;
}
/* latin-ext */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/firacode/v10/uU9NCBsR6Z2vfE9aq3bh09SDulI.woff2)
    format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(/firacode-v10-uU9NCBsR6Z2vfE9aq3bh3dSD.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/quicksand/v22/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58m-wi40.woff2)
    format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1,
    U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/quicksand/v22/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58i-wi40.woff2)
    format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/quicksand-v22-6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58a-wg.woff2)
    format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}
/* @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;600&family=Quicksand&display=swap'); */

:root {
  background-color: #1e1e1e;
  /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
  /* font-family: 'Fira Code', monospace; */
  font-family: 'Quicksand', sans-serif;
}
html {
  font-family: 'Quicksand', sans-serif;
}
button {
  font-family: 'Quicksand', sans-serif;
  font-size: 0.8rem;
}

.monaco-keybinding {
  font-family: "Droid Sans Mono", monospace, monospace, "Droid Sans Fallback"
}

#commit-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

*::selection {
  background-color: rgba(255, 255, 255, 0.1);
}

html {
  display: flex;
  flex-direction: column;
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  margin: 0;
  flex-grow: 1;
  height: 100%;
}

main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.color-grey {
  color: grey
}

.mono {
  font-family: 'Fira Code', monospace;
}
</style>
