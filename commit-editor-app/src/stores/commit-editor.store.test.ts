import { nextTick, ref } from 'vue'
import type { WebSocketHandler } from '../lib/web-socket'
import { createCommitEditorStore } from './commit-editor.store'

describe('commit.store.ts', () => {
  test('should create a basic commit editor store', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })

    expect(commitEditorStore).toBeTruthy()
    expect(commitEditorStore.state.configEditorOpen).toEqual(false)
    expect(commitEditorStore.state.initialConfig).toEqual({ formatter: 'url-param-formatter'})
    expect(commitEditorStore.state.initialMessage).toEqual('url-param-message')
    expect(commitEditorStore.state.configErrors).toEqual([])
    expect(commitEditorStore.state.configMarkerMessages).toEqual([])
    expect(commitEditorStore.state.parseErrorMessages).toEqual([])
    expect(commitEditorStore.state.webSocketOpen).toEqual(false)
  })

  test('should react to websocket open changes', async () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })

    webSocketHandlerStub.open.value = true

    await nextTick()

    expect(commitEditorStore.state.webSocketOpen).toEqual(true)
  })

  test('should forward websocket message', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const sendSpy = jest.spyOn(webSocketHandlerStub, 'send')
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })

    commitEditorStore.sendViaWebSocket('hello websocket')

    expect(sendSpy).toBeCalledTimes(1)
  })

  test('should toggle config editor and trigger resize', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })
    const resizeListener = {
      trigger: () => {}
    }
    const resizeSpy = jest.spyOn(resizeListener, 'trigger')
    commitEditorStore.resizeTriggerObservable.subscribe(resizeListener.trigger)

    commitEditorStore.toggleConfigEditor()

    expect(resizeSpy).toBeCalledTimes(1)
    expect(commitEditorStore.state.configEditorOpen).toEqual(true)
  })

  test('should update config markers and errors', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })

    commitEditorStore.setConfigMarkerMessages(['conferr1', 'conferr2'])

    expect(commitEditorStore.state.configErrors).toEqual(['conferr1', 'conferr2'])
    expect(commitEditorStore.state.configMarkerMessages).toEqual([
      'conferr1',
      'conferr2',
    ])
  })

  test('should update parse markers and errors', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })

    commitEditorStore.setParseErrorMessages(['parse1', 'parse2'])

    expect(commitEditorStore.state.configErrors).toEqual(['parse1', 'parse2'])
    expect(commitEditorStore.state.parseErrorMessages).toEqual(['parse1', 'parse2'])
  })

  test('should update parse and config markers and errors', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })

    commitEditorStore.setParseErrorMessages(['parse1', 'parse2'])
    commitEditorStore.setConfigMarkerMessages(['conferr1', 'conferr2'])

    expect(commitEditorStore.state.parseErrorMessages).toEqual(['parse1', 'parse2'])
    expect(commitEditorStore.state.configMarkerMessages).toEqual([
      'conferr1',
      'conferr2',
    ])
    expect(commitEditorStore.state.configErrors).toEqual([
      'parse1',
      'parse2',
      'conferr1',
      'conferr2',
    ])
  })

  test('should toggle global hotkey', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })
    const hotkeyListener = {
      trigger: () => {}
    }
    const hotkeySpy = jest.spyOn(hotkeyListener, 'trigger')
    commitEditorStore.globalCopyHotkeyObservable.subscribe(hotkeyListener.trigger)

    commitEditorStore.globalCopyHotkeyPressed()

    expect(hotkeySpy).toBeCalledTimes(1)
  })

  test('should trigger copy message', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })
    const copyMessageListener = {
      trigger: () => {}
    }
    const copyMessageSpy = jest.spyOn(copyMessageListener, 'trigger')
    commitEditorStore.copyMessageActionObservable.subscribe(copyMessageListener.trigger)

    commitEditorStore.copyMessageActionTriggered()

    expect(copyMessageSpy).toBeCalledTimes(1)
  })

  test('should trigger copy message processed', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })
    const copyMessageProcessedListener = {
      trigger: () => {}
    }
    const copyMessageProcessedSpy = jest.spyOn(copyMessageProcessedListener, 'trigger')
    commitEditorStore.copyMessageResultObservable.subscribe(copyMessageProcessedListener.trigger)

    commitEditorStore.copyMessageProcessed('success')

    expect(copyMessageProcessedSpy).toBeCalledTimes(1)
    expect(copyMessageProcessedSpy).toBeCalledWith('success')
  })

  test('should trigger config next marker action', () => {
    const webSocketHandlerStub: WebSocketHandler = {
      open: ref(false),
      send: () => {}
    } as any
    const commitEditorStore = createCommitEditorStore({
      configEditorOpen: false,
      openedWithParams: false,
      webSocketHandler: webSocketHandlerStub,
      urlParamConfig: { formatter: 'url-param-formatter' },
      urlParamMessage: 'url-param-message',
    })
    const copyMessageProcessedListener = {
      trigger: () => {}
    }
    const configNextMarkerSpy = jest.spyOn(copyMessageProcessedListener, 'trigger')
    commitEditorStore.configEditorNextMarkerActionObservable.subscribe(copyMessageProcessedListener.trigger)

    commitEditorStore.configEditorNextMarkerActionTriggered()

    expect(configNextMarkerSpy).toBeCalledTimes(1)
  })
})
