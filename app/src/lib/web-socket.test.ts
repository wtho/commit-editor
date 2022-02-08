import { nextTick } from 'vue'
import { WebSocketHandler } from './web-socket'

let originalWebSocket: typeof global.WebSocket
let currentWebSocketInstance: WebSocketMock

class WebSocketMock {
  sentMessages: string[] = []
  constructor(
    public _argUrl: string
  ) {
    currentWebSocketInstance = this
  }
  onopen?: () => void
  onclose?: () => void
  send(message: string) {
    this.sentMessages.push(message)
  }
  doOpen() {
    this.onopen?.()
  }
  doClose() {
    this.onclose?.()
  }
}

describe('web-socket.ts', () => {
  beforeAll(() => {
    originalWebSocket = global.WebSocket
    global.WebSocket = WebSocketMock as any
  })
  afterAll(() => {
    global.WebSocket = originalWebSocket
  })

  test('create basic websocket handler', () => {
    const webSocketHandler = new WebSocketHandler('http:', 'localhost:8080')

    expect(webSocketHandler).toBeTruthy()
    expect(webSocketHandler.open.value).toBe(false)
  })

  test('open websocket', async () => {
    const webSocketHandler = new WebSocketHandler('http:', 'localhost:8080')

    currentWebSocketInstance.doOpen()

    expect(webSocketHandler.open.value).toBe(true)
    expect(currentWebSocketInstance._argUrl).toEqual('ws://localhost:8080/')
  })

  test('open wss websocket', async () => {
    const webSocketHandler = new WebSocketHandler('https:', 'localhost:8080')

    currentWebSocketInstance.doOpen()

    expect(webSocketHandler.open.value).toBe(true)
    expect(currentWebSocketInstance._argUrl).toEqual('wss://localhost:8080/')
  })

  test('open and close websocket', async () => {
    const webSocketHandler = new WebSocketHandler('http:', 'localhost:8080')

    currentWebSocketInstance.doOpen()
    currentWebSocketInstance.doClose()

    expect(webSocketHandler.open.value).toBe(false)
  })

  test('message should not be sent if websocket is not open', async () => {
    const webSocketHandler = new WebSocketHandler('http:', 'localhost:8080')

    webSocketHandler.send('hello')
    webSocketHandler.send('world')

    expect(currentWebSocketInstance.sentMessages).toEqual([])
  })

  test('message should be sent if websocket is open', async () => {
    const webSocketHandler = new WebSocketHandler('http:', 'localhost:8080')

    webSocketHandler.send('hello')

    currentWebSocketInstance.doOpen()

    webSocketHandler.send('world')

    await nextTick()

    expect(currentWebSocketInstance.sentMessages).toEqual(['hello', 'world'])
  })

  test('empty message should not be sent', async () => {
    const webSocketHandler = new WebSocketHandler('http:', 'localhost:8080')

    currentWebSocketInstance.doOpen()

    webSocketHandler.send('hello')
    webSocketHandler.send('')
    webSocketHandler.send('world')

    await nextTick()

    expect(currentWebSocketInstance.sentMessages).toEqual(['hello', 'world'])
  })
})
