import { reactive, readonly } from 'vue'
import type { MessageSemVerUpdateState, } from '../lib/commitlint'
import type { monaco } from '../lib/monaco'
import { NotificationSubject } from '../lib/observable'
import type { Config } from '../types'

export const tabStoreSymbol = Symbol('tab-store')

export const createTabStore = (initialSettings: { config: Config, initialMessage: string }) => {
  // initial state values
  const config = initialSettings.config
  const messageEditorMarkers: monaco.editor.IMarkerData[] = []
  const messageSemVerUpdateState: MessageSemVerUpdateState = {
    major: false,
    minor: false,
    patch: false,
  }
  const parseErrorMessages: string[] = []
  const configMarkerMessages: string[] = []
  const configErrors: string[] = []

  const state = reactive({
    config,
    messageEditorMarkers,
    messageSemVerUpdateState,
    initialMessage: initialSettings.initialMessage,
    parseErrorMessages,
    configMarkerMessages,
    configErrors,
    commitMessage: initialSettings.initialMessage,
  })

  const setMessageEditorMarkers = (markers: monaco.editor.IMarkerData[]) => state.messageEditorMarkers = markers
  const setMessageEditorMarkerSemVerUpdateStates = (semVerUpdate: MessageSemVerUpdateState) => state.messageSemVerUpdateState = semVerUpdate
  const setConfig = (config: Config) => state.config = config
  const setParseErrorMessages = (parseErrorMessages: string[]) => {
    state.parseErrorMessages = [...parseErrorMessages]
    state.configErrors = [...parseErrorMessages, ...state.configMarkerMessages]
  }
  const setConfigMarkerMessages = (configMarkerMessages: string[]) => {
    state.configMarkerMessages = [...configMarkerMessages]
    state.configErrors = [...state.parseErrorMessages, ...configMarkerMessages]
  }
  const setCommitMessage = (commitMessage: string) => state.commitMessage = commitMessage

  // notifiers
  const messageEditorNextMarkerActionSubject = new NotificationSubject<void>()
  const messageEditorNextMarkerActionTriggered = () => messageEditorNextMarkerActionSubject.notify()

  return {
    state: readonly(state),
    // state updates
    setMessageEditorMarkers,
    setMessageEditorMarkerSemVerUpdateStates,
    setConfig,
    setParseErrorMessages,
    setConfigMarkerMessages,
    setCommitMessage,

    // notifiers
    messageEditorNextMarkerActionObservable: messageEditorNextMarkerActionSubject.observable,
    messageEditorNextMarkerActionTriggered,
  }
}

export type TabStore = ReturnType<typeof createTabStore>
