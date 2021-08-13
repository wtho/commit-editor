import type {
  RuleConfigQuality,
  RulesConfig,
  Commit,
  Parser,
  LintOptions,
  LintOutcome,
} from '@commitlint/types'
import { validate } from './commitlint'
import parseMock from '@commitlint/parse'
import lintMock from '@commitlint/lint'
import type { ParseOptions } from 'jsonc-parser'

const parse = parseMock as any as jest.Mock<
  Promise<Commit>,
  [string, Parser | undefined, ParseOptions | undefined]
>
const lint = lintMock as any as jest.Mock<
  Promise<LintOutcome>,
  [
    string,
    Partial<RulesConfig<RuleConfigQuality.Qualified>> | undefined,
    LintOptions | undefined
  ]
>

jest.mock('@commitlint/lint', () => jest.fn(), { virtual: true })
jest.mock('@commitlint/parse', () => jest.fn(), { virtual: true })

const generateMockCommit = (raw = '', footer: string | null = null): Commit => {
  const bodyContent = raw.split('\n').slice(2).join('\n')
  const header = raw.split('\n')[0]
  return {
    raw,
    body: bodyContent ?? null,
    header,
    footer: footer ?? null,
    scope: header.includes('(')
      ? header.split('(')[1]?.split(')')?.[0] ?? null
      : null,
    type: header.includes(':') ? header.split(':')[0] ?? null : null,
    subject: header.split(':')[1] ?? null,
    merge: null,
    revert: null,
    references: [],
    notes: [],
    mentions: [],
  }
}

const defaultRules: Partial<RulesConfig<RuleConfigQuality.Qualified>> = {
  'body-leading-blank': [1, 'always'],
  'body-max-line-length': [2, 'always', 100],
  'footer-leading-blank': [1, 'always'],
  'footer-max-line-length': [2, 'always', 100],
  'header-max-length': [2, 'always', 100],
  'subject-case': [
    2,
    'never',
    ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
  ],
  'subject-empty': [2, 'never'],
  'subject-full-stop': [2, 'never', '.'],
  'type-case': [2, 'always', 'lower-case'],
  'type-empty': [2, 'never'],
  'type-enum': [
    2,
    'always',
    [
      'build',
      'chore',
      'ci',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      'test',
    ],
  ],
}

describe('commitlint.ts', () => {
  test('validates an empty message to no errors/updates', async () => {
    lint.mockResolvedValue({ warnings: [], errors: [], valid: true, input: '' })
    parse.mockResolvedValue(generateMockCommit(''))

    const validated = await validate({ commitMessage: '' })

    expect(validated).toEqual({
      configErrors: [],
      markers: [],
      semVerUpdate: {
        major: false,
        minor: false,
        patch: false,
      },
    })
  })

  test('validates an only-whitespace message to no errors/updates', async () => {
    lint.mockResolvedValue({
      warnings: [],
      errors: [],
      valid: true,
      input: '  ',
    })
    parse.mockResolvedValue(generateMockCommit('  '))

    const validated = await validate({ commitMessage: '  ' })

    expect(validated).toEqual({
      configErrors: [],
      markers: [],
      semVerUpdate: {
        major: false,
        minor: false,
        patch: false,
      },
    })
  })

  test('validates a message without rules to no errors/updates', async () => {
    lint.mockResolvedValue({
      warnings: [],
      errors: [],
      valid: true,
      input: 'hey!',
    })
    parse.mockResolvedValue(generateMockCommit('hey!'))

    const validated = await validate({ commitMessage: 'hey!' })

    expect(validated).toEqual({
      configErrors: [],
      markers: [],
      semVerUpdate: {
        major: false,
        minor: false,
        patch: false,
      },
    })
  })

  test('validates a valid message with rules to no errors/updates', async () => {
    lint.mockResolvedValue({
      warnings: [],
      errors: [],
      valid: true,
      input: 'docs: update docs',
    })
    parse.mockResolvedValue(generateMockCommit('docs: update docs'))

    const validated = await validate({
      commitMessage: 'docs: update docs',
      rules: defaultRules,
    })

    expect(validated).toEqual({
      configErrors: [],
      markers: [],
      semVerUpdate: {
        major: false,
        minor: false,
        patch: false,
      },
    })
  })

  test('validates a valid message to patch update', async () => {
    lint.mockResolvedValue({
      warnings: [],
      errors: [],
      valid: true,
      input: 'fix: fix bug',
    })
    parse.mockResolvedValue(generateMockCommit('fix: fix bug'))

    const validated = await validate({
      commitMessage: 'fix: fix bug',
      rules: defaultRules,
    })

    expect(validated).toEqual({
      configErrors: [],
      markers: [],
      semVerUpdate: {
        major: false,
        minor: false,
        patch: true,
      },
    })
  })

  test('validates a valid message to minor update', async () => {
    lint.mockResolvedValue({
      warnings: [],
      errors: [],
      valid: true,
      input: 'feat: new feature',
    })
    parse.mockResolvedValue(generateMockCommit('feat: new feature'))

    const validated = await validate({
      commitMessage: 'feat: new feature',
      rules: defaultRules,
    })

    expect(validated).toEqual({
      configErrors: [],
      markers: [],
      semVerUpdate: {
        major: false,
        minor: true,
        patch: false,
      },
    })
  })

  test('validates a valid message to major update', async () => {
    lint.mockResolvedValue({
      warnings: [],
      errors: [],
      valid: true,
      input:
        'feat: new feature\n\nBREAKING-CHANGE: dropping support for something',
    })
    parse.mockResolvedValue(
      generateMockCommit(
        'feat: new feature\n\nBREAKING-CHANGE: dropping support for something'
      )
    )

    const validated = await validate({
      commitMessage:
        'feat: new feature\n\nBREAKING-CHANGE: dropping support for something',
      rules: defaultRules,
    })

    expect(validated).toEqual({
      configErrors: [],
      markers: [],
      semVerUpdate: {
        major: true,
        minor: false,
        patch: false,
      },
    })
  })

  test('handles when commitlint throws', async () => {
    lint.mockRejectedValue(new Error('something happened'))
    parse.mockResolvedValue(
      generateMockCommit(
        'feat: new feature\n\nBREAKING-CHANGE: dropping support for something'
      )
    )

    const validated = await validate({
      commitMessage: 'feat: some feature',
      rules: defaultRules,
    })

    expect(validated).toEqual({
      configErrors: ['something happened'],
      markers: [],
      semVerUpdate: {
        major: false,
        minor: false,
        patch: false,
      },
    })
  })

  test('validates an invalid message with errors', async () => {
    lint.mockResolvedValue({
      warnings: [],
      errors: [
        {
          level: 1,
          message: 'header may not be longer than 10 characters',
          name: 'header-max-length',
          valid: false,
        },
        {
          level: 2,
          message: 'header may not be empty',
          name: 'header-empty',
          valid: false,
        },
        {
          level: 2,
          message: 'type may not be empty',
          name: 'type-empty',
          valid: false,
        },
        {
          level: 2,
          message: 'scope may not be empty',
          name: 'scope-empty',
          valid: false,
        },
        {
          level: 2,
          message: 'subject may not be empty',
          name: 'subject-empty',
          valid: false,
        },
        {
          level: 2,
          message: 'body requires a leading blank line',
          name: 'body-leading-blank',
          valid: false,
        },
        {
          level: 1,
          message: 'body may not be empty',
          name: 'body-empty',
          valid: false,
        },
        {
          level: 2,
          message: 'footer requires a leading blank line',
          name: 'footer-leading-blank',
          valid: false,
        },
        {
          level: 1,
          message: 'footer may not be empty',
          name: 'footer-empty',
          valid: false,
        },
        {
          level: 1,
          message: 'illegal-token may not be empty',
          name: 'illegal-token-empty',
          valid: false,
        },
      ],
      valid: false,
      input: 'feat some feature',
    })
    parse.mockResolvedValue(generateMockCommit('feat some feature'))

    const validated = await validate({
      commitMessage: 'feat some feature',
      rules: defaultRules,
    })

    expect(validated).toEqual({
      configErrors: [],
      markers: [
        {
          endColumn: 18,
          endLineNumber: 0,
          message:
            'header may not be longer than 10 characters (header-max-length)',
          severity: 4,
          startColumn: 100,
          startLineNumber: 0,
        },
        {
          endColumn: 18,
          endLineNumber: 0,
          message: 'header may not be empty (header-empty)',
          severity: 8,
          startColumn: 0,
          startLineNumber: 0,
        },
        {
          endColumn: 5,
          endLineNumber: 0,
          message: 'type may not be empty (type-empty)',
          severity: 8,
          startColumn: 0,
          startLineNumber: 0,
        },
        {
          endColumn: 17,
          endLineNumber: 0,
          message: 'scope may not be empty (scope-empty)',
          severity: 8,
          startColumn: 0,
          startLineNumber: 0,
        },
        {
          endColumn: 18,
          endLineNumber: 0,
          message: 'subject may not be empty (subject-empty)',
          severity: 8,
          startColumn: 0,
          startLineNumber: 0,
        },
        {
          endColumn: 18,
          endLineNumber: 1,
          message: 'body requires a leading blank line (body-leading-blank)',
          severity: 8,
          startColumn: 17,
          startLineNumber: 1,
        },
        {
          endColumn: 2,
          endLineNumber: 3,
          message: 'body may not be empty (body-empty)',
          severity: 4,
          startColumn: 1,
          startLineNumber: 3,
        },
        {
          endColumn: 1,
          endLineNumber: 1,
          message:
            'footer requires a leading blank line (footer-leading-blank)',
          severity: 8,
          startColumn: 17,
          startLineNumber: 1,
        },
        {
          endColumn: 1,
          endLineNumber: 18,
          message: 'footer may not be empty (footer-empty)',
          severity: 4,
          startColumn: 17,
          startLineNumber: 1,
        },
      ],
      semVerUpdate: {
        major: false,
        minor: false,
        patch: false,
      },
    })
  })
})
