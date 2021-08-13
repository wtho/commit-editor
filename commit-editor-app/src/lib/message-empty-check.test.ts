import { isCommitMessageEmpty } from "./message-empty-check"


describe('message-empty-check.ts', () => {
  test('empty string should be classified as empty', () => {
    const classifiedAsEmpty = isCommitMessageEmpty('')

    expect(classifiedAsEmpty).toBe(true)
  })

  test('only new-line message should be classified as empty', () => {
    const classifiedAsEmpty = isCommitMessageEmpty('\n\n\n')

    expect(classifiedAsEmpty).toBe(true)
  })

  test('only spaces message should be classified as empty', () => {
    const classifiedAsEmpty = isCommitMessageEmpty('      ')

    expect(classifiedAsEmpty).toBe(true)
  })

  test('only spaces/tabs/newlines message should be classified as empty', () => {
    const classifiedAsEmpty = isCommitMessageEmpty(' \n  \t  \n  ')

    expect(classifiedAsEmpty).toBe(true)
  })

  test('message with comments should be classified as empty', () => {
    const classifiedAsEmpty = isCommitMessageEmpty(' \n# hey  \t  \n# how ar eyou \n  ')

    expect(classifiedAsEmpty).toBe(true)
  })

  test('message with custom comment char comments should be classified as empty', () => {
    const classifiedAsEmpty = isCommitMessageEmpty(' \nX hey  \t  \nX how ar eyou \n  ', 'X')

    expect(classifiedAsEmpty).toBe(true)
  })

  test('message letters outside of comments should be classified as not empty', () => {
    const classifiedAsEmpty = isCommitMessageEmpty(' x\n# hey  \t  \n# how ar eyou \n  ')

    expect(classifiedAsEmpty).toBe(false)
  })
})