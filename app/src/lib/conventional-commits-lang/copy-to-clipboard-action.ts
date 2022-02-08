import type { Monaco } from "../monaco"
import type { monaco } from "../monaco"

export function loadCopyToClipboardAction(
  monaco: Monaco,
  copyCallbackFunction: (_outcome: 'success' | 'failure') => void
): monaco.editor.IActionDescriptor {
  return {
    id: 'editor.content.clipboard',
    label: 'Copy commit message to clipboard',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
    run: async (editor) => {
      try {
        const data = editor.getModel()?.getValue()
        if (!data) {
          copyCallbackFunction('failure')
          return;
        }
        await navigator?.clipboard?.writeText(data)
        copyCallbackFunction('success')
      } catch (err) {
        copyCallbackFunction('failure')
      }
    },
  }
}
