import * as nodeStatic from 'node-static'
import * as http from 'http'
import * as path from 'path'
import type * as WebSocket from 'ws'
import type { Socket } from 'net'

const noPort = 0

export async function initWebServer(
  webSocketServer: WebSocket.Server
) {
  const servePath = path.join(__dirname, '../web-app-dist')
  const staticServer = new nodeStatic.Server(servePath)

  let startsUp: () => void
  const startedUp = new Promise<void>((rs) => (startsUp = rs))

  const server = http.createServer((req, res) => staticServer.serve(req, res))

  server.on('upgrade', (request, socket, head) => {
    webSocketServer.handleUpgrade(request, socket as Socket, head, (ws) =>
      webSocketServer.emit('connection', ws, request)
    )
  })

  server.on('error', (err) => {
    console.log('SERVER ERR')
    console.log(err)
  })

  server.listen(noPort, () => startsUp())

  await startedUp

  const addressInfo = server.address() as { port: number }
  const { port: assignedPort } = addressInfo

  return {
    port: assignedPort,
    close: (options: {timeout: number}) =>
      new Promise<void>((rs, rj) => {
        server.close((err) => {
          if (err) {
            rj(err)
          } else rs()
        })
        // set maximum timeout
        setTimeout(() => rs(), options.timeout ?? 100)
      }),
  }
}
