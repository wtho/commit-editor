import { reactive, readonly } from 'vue'
import { NotificationSubject } from '../lib/observable'
import type { Config } from '../types'

export const commitEditorStoreSymbol = Symbol('commit-editor-store')

export const createCommitEditorStore = (initialSettings: {
  configEditorOpen: boolean,
  openedWithParams: boolean,
  urlParamMessage?: string,
  urlParamConfig?: Config
}) => {
  const parseErrorMessages: string[] = []
  const configMarkerMessages: string[] = []
  const configErrors: string[] = []

  const state = reactive({
    configEditorOpen: initialSettings.configEditorOpen,
    parseErrorMessages,
    configMarkerMessages,
    configErrors,
  })

  const toggleConfigEditor = () => {
    state.configEditorOpen = !state.configEditorOpen
    resizeTriggered()
  }
  const setParseErrorMessages = (parseErrorMessages: string[]) => {
    state.parseErrorMessages = [...parseErrorMessages]
    state.configErrors = [...parseErrorMessages, ...state.configMarkerMessages]
  }
  const setConfigMarkerMessages = (configMarkerMessages: string[]) => {
    state.configMarkerMessages = [...configMarkerMessages]
    state.configErrors = [...state.parseErrorMessages, ...configMarkerMessages]
  }

  // global notifiers
  const globalCopyHotkeySubject = new NotificationSubject<void>()
  const globalCopyHotkeyPressed = () => globalCopyHotkeySubject.notify()
  const copyMessageResultSubject = new NotificationSubject<
    'success' | 'failure'
  >()
  const copyMessageProcessed = (result: 'success' | 'failure') =>
    copyMessageResultSubject.notify(result)
  const copyMessageActionSubject = new NotificationSubject<void>()
  const copyMessageActionTriggered = () => copyMessageActionSubject.notify()
  const resizeTriggerSubject = new NotificationSubject<void>()
  const resizeTriggered = () => resizeTriggerSubject.notify()
  const configEditorNextMarkerActionSubject = new NotificationSubject<void>()
  const configEditorNextMarkerActionTriggered = () => configEditorNextMarkerActionSubject.notify()

  return {
    state: readonly(state),
    toggleConfigEditor,
    setParseErrorMessages,
    setConfigMarkerMessages,

    // notifiers
    globalCopyHotkeyObservable: globalCopyHotkeySubject.observable,
    globalCopyHotkeyPressed,
    copyMessageResultObservable: copyMessageResultSubject.observable,
    copyMessageProcessed,
    copyMessageActionObservable: copyMessageActionSubject.observable,
    copyMessageActionTriggered,
    resizeTriggerObservable: resizeTriggerSubject.observable,
    resizeTriggered,
    configEditorNextMarkerActionObservable: configEditorNextMarkerActionSubject.observable,
    configEditorNextMarkerActionTriggered,
  }
}

export type CommitEditorStore = ReturnType<typeof createCommitEditorStore>
