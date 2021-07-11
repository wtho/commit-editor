// Commands:
// * install
//   * puts git-ce in path OR global installation just adds (also) git-ce as command

import {
  readCommitMessageFile,
  writeCommitMessage,
} from './commit-message-file-handler'
import { initWebServer } from './web-server'
import { initWebSocketServer } from './web-socket-handler'
import open from 'open'
import { loadCommitlintConfig } from './commitlint-config-loader'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'

// * git-ce [...options]
//   * runs git -c core.editor=git-commit-bridge commit [...options]
//
// * git-commit-bridge
//   * reads precomposed commit message
//   * reads local commitlint config
//   * starts local webserver on port <PORT>
//   * opens http://localhost:<PORT>?config=<CONFIG>&message=<MESSAGE> in browser
//   * handles incoming websocket connection
//     * each commit message change is (maybe debounced) sent via ws
//   * on websocket close ends commit
//     * writes commit to commit msg file
//     * exits bridge to tell git commit msg editing is done

// possible configuration
// * which browser/browser-session (open)
// * trigger website open at all
// * alternatively copy link to clipboard
// * where to store config? it's very personal

async function main(executableFileName: string, commitMessageFilePath: string | undefined, inputArgs: string[]) {
  if (await fileExists(commitMessageFilePath)) {
    startup(commitMessageFilePath!)
  } else {
    execGitCommit(executableFileName, inputArgs)
  }
}

async function fileExists(filePath?: string) {
  if (typeof filePath !== 'string' || !filePath) {
    return false
  }
  try {
    const stat = await fs.stat(filePath)
    if (!stat) {
      return false
    }
    return stat.isFile()
  } catch (err) {
    return false
  }
}

async function execGitCommit(executableFileName: string, inputArgs: string[] = []) {
  const args = ['-c', `core.editor="${executableFileName}"`, 'commit', ...inputArgs]
  console.log(['git', ...args].join(' '))
  spawn(`git`, args, { stdio: 'inherit'})
}

async function startup(commitMessageFilePath: string) {

  const [config, precomposedCommitMessage, webSocketServer] =
    await Promise.all([
      loadCommitlintConfig(),
      readCommitMessageFile(commitMessageFilePath),
      initWebSocketServer(),
    ])

  const webServer = await initWebServer(webSocketServer.instance)

  let commitMessage = precomposedCommitMessage

  webSocketServer.onNewCommitMessage(
    (newCommitMessage: string) => (commitMessage = newCommitMessage)
  )

  const { port } = webServer
  const messageParam = precomposedCommitMessage ? `message=${encodeURIComponent(precomposedCommitMessage)}` : null
  const configParam = config ? `config=${encodeURIComponent(config)}` : null
  const joinedParams = [messageParam, configParam].filter(param => !!param).join('&')
  const params = joinedParams ? `?${joinedParams}` : ''
  const url = `http://localhost:${port}${params}`

  console.log(`Opening URL: http://localhost:${port}`)
  await open(url)

  console.log(`\nWaiting for commit-editor to close browser tab`)
  await webSocketServer.closed

  await Promise.allSettled([
    writeCommitMessage(commitMessageFilePath, commitMessage),
    webServer.close({ timeout: 100 }),
  ])

  process.exit(0)
}


export function run(executableFileName: string) {
  const commitMessageFilePath = process.argv[2]
  const inputArgs = process.argv.slice(2)
  main(executableFileName, commitMessageFilePath, inputArgs)
}

