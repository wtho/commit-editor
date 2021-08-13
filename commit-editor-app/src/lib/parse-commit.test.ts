import type { Commit } from '@commitlint/types'
import { parseCommit } from './parse-commit'

jest.mock('@commitlint/parse', () => jest.fn())

describe('parse-commit.ts', () => {
  class Range {
    constructor(public _startLineNumber: number, public _startColumn: number, public _endLineNumber: number, public _endColumn: number) {}
  }
  const monacoMock: any = { Range }

  test('should parse commit', async () => {
    const parseMock: jest.Mock<Promise<Commit>, [string]> = require('@commitlint/parse')
    parseMock.mockResolvedValue({
      type: 'feat',
      scope: 'frontend',
      subject: 'add blue border',
      header: 'feat(frontend): add blue border',
      body: 'add the blue border to all visual components',
      footer: `BREAKING-CHANGE: the old 'border' option is removed\nFixes #123`,
      notes: [],
      references: [],
      mentions: [],
      raw: `feat(frontend): add blue border

add the blue border to all visual components

BREAKING-CHANGE: the old 'border' option is removed
Fixes #123`,
      revert: null,
      merge: null,
    })
    const commitMessage = `feat(frontend): add blue border

add the blue border to all visual components

BREAKING-CHANGE: the old 'border' option is removed
Fixes #123`

    const parsed = await parseCommit(monacoMock, { commitMessage } )

    expect(parsed).toEqual({
      parsed: {
        body: 'add the blue border to all visual components',
        footer: `BREAKING-CHANGE: the old 'border' option is removed\nFixes #123`,
        header: 'feat(frontend): add blue border',
        mentions: [],
        merge: null,
        notes: [],
        raw: `feat(frontend): add blue border

add the blue border to all visual components

BREAKING-CHANGE: the old 'border' option is removed
Fixes #123`,
        references: [],
        revert: null,
        scope: 'frontend',
        subject: 'add blue border',
        type: 'feat',
      },
      ranges: {
        body: new Range(3, 1, 4, 46),
        footer: new Range(5, 1, 7, 11),
        header: new Range(1, 1, 1, 31),
        mentions: null,
        merge: null,
        notes: null,
        raw: null,
        references: null,
        revert: null,
        scope: new Range(1, 5, 1, 13),
        subject: new Range(1, 15, 1, 30),
        type: new Range(1, 1, 1, 4),
      }
    })

  })

  test('should parse different', async () => {
    const parseMock: jest.Mock<Promise<Commit>, [string]> = require('@commitlint/parse')
    parseMock.mockResolvedValue({
      type: 'fix',
      scope: null,
      subject: 'bug',
      header: 'fix: bug',
      body: 'just\na\nbody',
      footer: `Fixes #123`,
      notes: [],
      references: [],
      mentions: [],
      raw: `fix: bug

just
a
body

Fixes #123`,
      revert: null,
      merge: null,
    })
    const commitMessage = `fix: bug

just
a
body

Fixes #123`

    const parsed = await parseCommit(monacoMock, { commitMessage } )

    expect(parsed).toEqual({
      parsed: {
        body: 'just\na\nbody',
        footer: `Fixes #123`,
        header: 'fix: bug',
        mentions: [],
        merge: null,
        notes: [],
        raw: `fix: bug

just
a
body

Fixes #123`,
        references: [],
        revert: null,
        scope: null,
        subject: 'bug',
        type: 'fix',
      },
      ranges: {
        body: new Range(3, 1, 6, 5),
        footer: new Range(7, 1, 8, 12),
        header: new Range(1, 1, 1, 8),
        mentions: null,
        merge: null,
        notes: null,
        raw: null,
        references: null,
        revert: null,
        scope: null,
        subject: new Range(1, 4, 1, 7),
        type: new Range(1, 1, 1, 3),
      }
    })

  })
})
