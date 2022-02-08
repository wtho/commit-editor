// TODO read comment character from config
export function isCommitMessageEmpty(
  message: string,
  commentCharacter = '#'
): boolean {
  return !message
    .split('\n')
    .some((line) => !line.startsWith(commentCharacter) && line.trim())
}
