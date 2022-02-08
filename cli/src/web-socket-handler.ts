import * as WebSocket from 'ws'

export async function initWebSocketServer() {
  const server = new WebSocket.Server({ noServer: true })
  let webSocketCloses: () => void
  let onNewCommitMessageCallback: (msg: string) => void

  server.on('connection', (ws) => {
    ws.on('message', (message) => {
      onNewCommitMessageCallback(message.toString())
    })
    ws.once('close', () => {
      webSocketCloses()
    })
  })

  return {
    closed: new Promise<void>((rs) => (webSocketCloses = rs)),
    onNewCommitMessage: (cb: (msg: string) => void) =>
      (onNewCommitMessageCallback = cb),
    instance: server
  }
}
