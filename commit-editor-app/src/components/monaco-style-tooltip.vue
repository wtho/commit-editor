<template>
  <div class="tooltip-hover-element">
    <slot> </slot>

    <div class="tooltip-wrapper" :style="styles" :class="classes">
      <div class="tooltip">
        <p class="tooltip-paragraph">
          <slot name="tooltip-content"></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MonacoStyleTooltip',
  props: {
    width: {
      type: String,
      default: '100%',
    },
    position: {
      type: String,
      validator: (input: string) => ['top', 'bottom'].includes(input),
      default: 'top',
    },
    align: {
      type: String,
      validator: (input: string) =>
        ['inline-start', 'inline-center', 'inline-end'].includes(input),
      default: 'inline-center',
    },
  },
  setup(props) {
    const styles = {
      width: props.width,
    }
    const classes: string[] = []
    if (props.position === 'top') {
      classes.push('tooltip-wrapper--top')
    } else {
      classes.push('tooltip-wrapper--bottom')
    }
    if (props.align === 'inline-start') {
      classes.push('tooltip-wrapper--align-inline-start')
    } else if (props.align === 'inline-end') {
      classes.push('tooltip-wrapper--align-inline-end')
    } else {
      classes.push('tooltip-wrapper--align-inline-center')
    }
    return { styles, classes }
  },
})
</script>

<style scoped>
.tooltip-hover-element {
  position: relative;
  display: flex;
}

.tooltip-hover-element:hover > .tooltip-wrapper--top {
  max-height: unset;
  padding-bottom: 0.5rem;
}
.tooltip-hover-element:hover > .tooltip-wrapper--bottom {
  max-height: unset;
  padding-top: 0.5rem;
}
.tooltip-wrapper {
  position: absolute;

  z-index: 50;
  overflow: hidden;

  max-height: 0;
}
.tooltip-wrapper--bottom {
  padding-top: 0;
  top: 100%;
}
.tooltip-wrapper--top {
  padding-bottom: 0;
  bottom: 100%;
}
.tooltip-wrapper--align-inline-center {
  left: 50%;
  transform: translateX(-50%);
}
.tooltip-wrapper--align-inline-start {
  left: 0;
}
.tooltip-wrapper--align-inline-end {
  right: 0;
}
.tooltip {
  font-size: 14px;
  border: 1px solid #454545;
  color: #cccccc;
  background-color: #252526;
  padding: 4px 8px;
  cursor: default;
  user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  box-sizing: initial;
  line-height: 1.5em;
  -webkit-text-size-adjust: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI',
    HelveticaNeue-Light, system-ui, Ubuntu, 'Droid Sans', sans-serif;
  /* animation: fadein .1s linear; */
  /* position: relative; */
  /* overflow: visible; */
}

.tooltip-paragraph {
  margin: 0;
  display: inline-flex;
  flex-direction: column;
}
</style>
<style>
.tooltip-paragraph > *:not(:first-child) {
  margin-top: 0.8rem;
}
</style>
