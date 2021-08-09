import { createTabStore } from './tab.store'

describe('tab.store.ts', () => {
  test('should create a basic tab store', () => {
    const tabStore = createTabStore({
      config: { extends: ['some-conf'] },
      initialMessage: 'initial-msg',
    })

    expect(tabStore).toBeTruthy()
    expect(tabStore.messageEditorNextMarkerActionObservable).toBeTruthy()
    expect(tabStore.state.config).toEqual({ extends: ['some-conf'] })
    expect(tabStore.state.commitMessage).toEqual('initial-msg')
    expect(tabStore.state.initialMessage).toEqual('initial-msg')
    expect(tabStore.state.configErrors).toEqual([])
    expect(tabStore.state.configMarkerMessages).toEqual([])
    expect(tabStore.state.messageEditorMarkers).toEqual([])
    expect(tabStore.state.parseErrorMessages).toEqual([])
    expect(tabStore.state.messageSemVerUpdateState).toEqual({
      major: false,
      minor: false,
      patch: false,
    })
  })

  test('should update config', () => {
    const tabStore = createTabStore({
      config: { defaultIgnores: true },
      initialMessage: '',
    })

    tabStore.setConfig({ rules: {} })

    expect(tabStore.state.config).toEqual({ rules: {} })
  })

  test('should update commit message', () => {
    const tabStore = createTabStore({ config: {}, initialMessage: '' })

    tabStore.setCommitMessage('new message')

    expect(tabStore.state.commitMessage).toEqual('new message')
  })

  test('should update message editor markers', () => {
    const tabStore = createTabStore({ config: {}, initialMessage: '' })

    tabStore.setMessageEditorMarkers([
      {
        message: 'message1',
        severity: 1,
        startColumn: 1,
        endColumn: 2,
        startLineNumber: 4,
        endLineNumber: 4,
      },
    ])

    expect(tabStore.state.messageEditorMarkers).toEqual([
      {
        message: 'message1',
        severity: 1,
        startColumn: 1,
        endColumn: 2,
        startLineNumber: 4,
        endLineNumber: 4,
      },
    ])
  })

  test('should update config markers and errors', () => {
    const tabStore = createTabStore({ config: {}, initialMessage: '' })

    tabStore.setConfigMarkerMessages(['conferr1', 'conferr2'])

    expect(tabStore.state.configErrors).toEqual(['conferr1', 'conferr2'])
    expect(tabStore.state.configMarkerMessages).toEqual([
      'conferr1',
      'conferr2',
    ])
  })

  test('should update parse markers and errors', () => {
    const tabStore = createTabStore({ config: {}, initialMessage: '' })

    tabStore.setParseErrorMessages(['parse1', 'parse2'])

    expect(tabStore.state.configErrors).toEqual(['parse1', 'parse2'])
    expect(tabStore.state.parseErrorMessages).toEqual(['parse1', 'parse2'])
  })

  test('should update parse and config markers and errors', () => {
    const tabStore = createTabStore({ config: {}, initialMessage: '' })

    tabStore.setParseErrorMessages(['parse1', 'parse2'])
    tabStore.setConfigMarkerMessages(['conferr1', 'conferr2'])

    expect(tabStore.state.parseErrorMessages).toEqual(['parse1', 'parse2'])
    expect(tabStore.state.configMarkerMessages).toEqual([
      'conferr1',
      'conferr2',
    ])
    expect(tabStore.state.configErrors).toEqual([
      'parse1',
      'parse2',
      'conferr1',
      'conferr2',
    ])
  })

  test('should update sem ver update state', () => {
    const tabStore = createTabStore({ config: {}, initialMessage: '' })

    tabStore.setMessageSemVerUpdateStates({
      major: true,
      minor: true,
      patch: false,
    })

    expect(tabStore.state.messageSemVerUpdateState).toEqual({
      major: true,
      minor: true,
      patch: false,
    })
  })

  test('should notify next marker action', () => {
    const tabStore = createTabStore({ config: {}, initialMessage: '' })

    const observers = {
      observer: () => {}
    }
    const observerSpy = jest.spyOn(observers, 'observer')
    tabStore.messageEditorNextMarkerActionObservable.subscribe(observers.observer)
    tabStore.messageEditorNextMarkerActionTriggered()

    expect(observerSpy).toHaveBeenCalledTimes(1)
  })
})
