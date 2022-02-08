import { promises as fs } from "fs"


export async function readCommitMessageFile(commitMessageFilePath: string) {
  const precomposedCommitMessageBuffer = await fs.readFile(commitMessageFilePath)
  return precomposedCommitMessageBuffer.toString()
}

export async function writeCommitMessage(commitMessageFilePath: string, commitMessage: string) {
  await fs.writeFile(commitMessageFilePath, commitMessage)
}

