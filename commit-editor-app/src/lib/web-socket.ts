import { ref } from "vue"

export class WebSocketHandler {
  private webSocket: WebSocket
  private webSocketInitialize: (() => void) | undefined
  private webSocketInitialized = new Promise<void>(rs => this.webSocketInitialize = rs)
  open = ref(false)

  constructor(httpProtocol: string, host: string) {
    this.webSocket = new WebSocket(
      `${httpProtocol === 'https' ? 'wss' : 'ws'}://${host}/`
    )
    this.webSocket.onopen = () => {
      this.webSocketInitialize?.()
      this.open.value = true
    }
    this.webSocket.onclose = () => {
      this.open.value = false
    }
  }

  async send(message?: string) {
    if (!message) {
      return
    }
    await this.webSocketInitialized
    this.webSocket.send(message)
  }
}
