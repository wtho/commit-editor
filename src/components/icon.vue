<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :style="styles"
    :class="classes"
    fill="currentColor"
  >
    <path
      v-for="path of paths"
      :key="path"
      :d="path"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { githubIcon } from '../icons/github'
import { externalLinkIcon } from '../icons/external-link'
import { configIcon } from '../icons/config'
import { heartIcon } from '../icons/heart'
import { checkmarkIcon } from '../icons/checkmark'
import { crossmarkIcon } from '../icons/crossmark'
import { crossmarkCircledIcon } from '../icons/crossmark-circled'
import { warningIcon } from '../icons/warning'
import { semanticReleaseIcon } from '../icons/semantic-release'
import { flashIcon } from '../icons/flash'
import { chevronUpIcon } from '../icons/chevron-up'
import { commitEditorIcon } from '../icons/commit-editor'
import { commitEditorThinIcon } from '../icons/commit-editor-thin'

const availableIcons = [
  githubIcon,
  heartIcon,
  flashIcon,
  checkmarkIcon,
  crossmarkIcon,
  crossmarkCircledIcon,
  warningIcon,
  externalLinkIcon,
  configIcon,
  semanticReleaseIcon,
  chevronUpIcon,
  commitEditorIcon,
  commitEditorThinIcon,
]

export default defineComponent({
  name: 'icon',
  props: {
    width: {
      type: Number,
      default: 16,
    },
    height: {
      type: Number,
      default: 16,
    },
    icon: {
      type: String,
      validator: (input: string) =>
        availableIcons.map((icon) => icon.id).includes(input),
      default: 'warning',
    },
    color: {
      type: String,
    },
    flippedVertically: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { width, height, icon, color } = props
    const { viewBox, paths } = {
      viewBox: '0 4 16 16',
      paths: [],
      ...(availableIcons.find((availableIcon) => availableIcon.id === icon) ??
        {}),
    }

    const styles: Record<string, string> = {}
    if (color) {
      styles.color = color
    }
    const classes = computed(() => (props.flippedVertically ? ['flipped'] : []))

    return {
      width,
      height,
      viewBox,
      paths,
      styles,
      classes,
    }
  },
})
</script>

<style scoped>
svg {
  transition: transform 0.2s ease-out;
  transform: rotateX(0deg);
}
.flipped {
  transform: rotateX(180deg);
}
</style>
