import type { Monaco } from '../monaco'
import type { monaco } from '../monaco'
import { getCurrentLenses } from './code-lense-provider'
import { provideCompletionItems } from './completion-provider'
import { theme } from './theme'
import { loadCopyToClipboardAction } from './copy-to-clipboard-action'
import { getConventionalCommitTokensProvider } from './monarch-tokens-provider'
import { provideHover } from './hover-provider'
import { provideCodeActions } from './code-actions-provider'
import { watch } from 'vue'
import type { Ref } from 'vue'
import type { Config } from '../../types'
import type { TabStore } from '../../stores/tab.store'

export interface EditorContext {
  commandIds?: {
    nullCommand: string
  }
}

export function initMonacoLanguageConventionalCommits(
  monaco: Monaco,
  messageEditor: Ref<monaco.editor.IStandaloneCodeEditor | null>,
  tabStore: TabStore,
  copyCallbackFunction: (outcome: 'success' | 'failure') => void
): void {
  let editorContext: EditorContext = {}

  const registered = monaco.languages
    .getLanguages()
    .some((lang) => lang.id === 'conventional-commits')

  if (!registered) {
    // =============================
    // === language registration ===
    // =============================
    monaco.languages.register({ id: 'conventional-commits' })

    // =============
    // === theme ===
    // =============
    monaco.editor.defineTheme('conventional-commits-theme', theme)

    // ===================
    // === code lenses ===
    // ===================
    monaco.languages.registerCodeLensProvider('conventional-commits', {
      provideCodeLenses: (model, token) => {
        return {
          lenses: getCurrentLenses(
            tabStore.state.config as Config,
            editorContext,
            model
          ),
          dispose: () => {},
        }
      },
      resolveCodeLens: (model, lens, token) => lens,
    })

    // =======================
    // === code completion ===
    // =======================
    monaco.languages.registerCompletionItemProvider('conventional-commits', {
      provideCompletionItems(model, position, context, token) {
        return provideCompletionItems(
          monaco,
          model,
          position,
          tabStore.state.config as Config
        )
      },
    })

    // ======================
    // === hover provider ===
    // ======================
    monaco.languages.registerHoverProvider('conventional-commits', {
      provideHover(model, position, token) {
        return provideHover(
          monaco,
          model,
          position,
          tabStore.state.config as Config,
          tabStore.state.messageEditorMarkers as monaco.editor.IMarkerData[]
        )
      },
    })

    // ==================================
    // === code actions - quick fixes ===
    // ==================================
    monaco.languages.registerCodeActionProvider('conventional-commits', {
      provideCodeActions(model, range, context, token) {
        return provideCodeActions(
          model,
          range,
          tabStore.state.config as Config,
          context.markers
        )
      },
    })
  }

  watch(
    () => tabStore.state.config,
    (newInputConfig) => {
      const newConfig = newInputConfig as Config
      if (messageEditor.value && !editorContext.commandIds) {
        const nullCommand = messageEditor.value.addCommand(0, () => {}, '')
        if (nullCommand) {
          editorContext.commandIds = {
            nullCommand,
          }
          // =====================
          // === editor action ===
          // =====================
          messageEditor.value.addAction(
            loadCopyToClipboardAction(monaco, copyCallbackFunction)
          )
        }
      }

      // ==============================
      // === monarch token language ===
      // ==============================
      monaco.languages.setMonarchTokensProvider(
        'conventional-commits',
        getConventionalCommitTokensProvider(newConfig)
      )
    }
  )
}
