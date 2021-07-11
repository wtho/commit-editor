import type { Config } from '../../types'
import type { monaco } from '../monaco'
import { getRuleValue, hasRule, hasRuleAlways } from './utils'

export interface MonarchLanguage extends monaco.languages.IMonarchLanguage {
  types: string[]
  scopes: string[]
}

export function getConventionalCommitTokensProvider(
  config?: Config
): MonarchLanguage {
  const nextEmptyLine = hasRuleAlways(config?.rules, 'body-leading-blank')
    ? '@emptyLine'
    : '@bodyLines'
  const uncheckedTypes = hasRule(config?.rules, 'type-enum')
    ? getRuleValue<string[]>(config?.rules, 'type-enum')
    : []
  const uncheckedScopes = hasRule(config?.rules, 'scope-enum')
    ? getRuleValue<string[]>(config?.rules, 'scope-enum')
    : []
  const types =
    (uncheckedTypes &&
      Array.isArray(uncheckedTypes) &&
      uncheckedTypes.length > 0 &&
      uncheckedTypes.filter((type) => typeof type === 'string' && type)) ||
    []
  const scopes =
    (uncheckedScopes &&
      Array.isArray(uncheckedScopes) &&
      uncheckedScopes.length > 0 &&
      uncheckedScopes.filter((scope) => typeof scope === 'string' && scope)) ||
    []
  const hasTypes = types.length > 0
  const hasScopes = scopes.length > 0

  const conventionalCommitTokensProvider: MonarchLanguage = {
    types,
    scopes,
    defaultToken: 'identifier',

    breakingKeywords: ['BREAKING-CHANGE', 'BREAKING CHANGE'],

    tokenizer: {
      header: [
        // initial state
        [
          /^\w+$/,
          {
            cases: {
              '@types': {
                token: 'header-type',
                next: nextEmptyLine,
              },
              '@default': {
                token: hasTypes ? 'header-unknown-type' : 'header-type',
                next: nextEmptyLine,
              },
            },
          },
        ],
        [
          /(\w)[^()!:]+/,
          {
            cases: {
              '@types': {
                token: 'header-type',
                next: '@headerAfterTypeMaybeBreakingExclamationMark',
              },
              '@default': {
                token: hasTypes ? 'header-unknown-type' : 'header-type',
                next: '@headerAfterTypeMaybeBreakingExclamationMark',
              },
            },
          },
        ],
        [/:/, { token: 'string', next: '@headerDescription' }],

        [/(.*)$/, { token: 'comment', next: nextEmptyLine }],
      ],
      headerAfterTypeMaybeBreakingExclamationMark: [
        [
          /!$/,
          {
            token: 'header-breaking-exclamation-mark',
            next: nextEmptyLine,
          },
        ],
        [
          /!/,
          {
            token: 'header-breaking-exclamation-mark',
            next: '@headerAfterType',
          },
        ],
        { include: '@headerAfterType' },
      ],

      headerAfterType: [
        [/:$/, { token: 'identifier', next: nextEmptyLine }],
        [/: $/, { token: 'identifier', next: nextEmptyLine }],
        [/:/, { token: 'identifier', next: '@headerDescription' }],
        [/\($/, { token: 'header-scope-bracket', next: nextEmptyLine }],
        [/\(/, { token: 'header-scope-bracket', next: '@headerScope' }],
        [
          /(.*)$/,
          {
            cases: {
              '@default': { token: 'comment', next: nextEmptyLine },
            },
          },
        ],
      ],

      headerScope: [
        [
          /([^:)]+)$/,
          {
            cases: {
              '@scopes': { token: 'header-scope', next: nextEmptyLine },
              '@default': {
                token: hasScopes ? 'header-unknown-scope' : 'header-scope',
                next: nextEmptyLine,
              },
            },
          },
        ],
        [
          /([^:)]+)/,
          {
            cases: {
              '@scopes': {
                token: 'header-scope',
                next: '@headerBeforeScopeBracketClose',
              },
              '@default': {
                token: hasScopes ? 'header-unknown-scope' : 'header-scope',
                next: '@headerBeforeScopeBracketClose',
              },
            },
          },
        ],
        [/: +$/, { token: 'identifier', next: nextEmptyLine }],
        [/\)$/, { token: 'header-scope-bracket', next: nextEmptyLine }],
        [/\)/, { token: 'header-scope-bracket', next: '@headerAfterScopeMaybeBreakingExclamationMark' }],
      ],

      headerBeforeScopeBracketClose: [
        [/\)$/, { token: 'header-scope-bracket', next: nextEmptyLine }],
        [
          /\)/,
          {
            token: 'header-scope-bracket',
            next: '@headerAfterScopeMaybeBreakingExclamationMark',
          },
        ],
      ],

      headerAfterScopeMaybeBreakingExclamationMark: [
        [
          /!$/,
          {
            token: 'header-breaking-exclamation-mark',
            next: nextEmptyLine,
          },
        ],
        [
          /!/,
          {
            token: 'header-breaking-exclamation-mark',
            next: '@headerAfterScope',
          },
        ],
        { include: '@headerAfterScope' },
      ],

      headerAfterScope: [
        [/: ?$/, { token: 'comment', next: nextEmptyLine }],
        [/:/, { token: 'comment', next: '@headerDescription' }],
      ],

      headerDescription: [
        [/(.*)$/, { token: 'header-description', next: nextEmptyLine }],
      ],

      emptyLine: [
        [/#(.*)/, { token: 'comment', next: '@bodyLines' }],
        [/(.*)/, { token: 'empty-line', next: '@bodyLines' }],
      ],

      bodyLines: [
        [
          /BREAKING[ -]CHANGE/,
          {
            cases: {
              '@breakingKeywords': 'breaking-keyword',
              '@default': 'identifier',
            },
          },
        ],

        { include: '@whitespace' },

        // first line
        // [/^[^\(]*/, 'first-line']
        // type
        // ...config.types.map((type) => [
        //   new RegExp(`^${type.typeName}`),
        //   "header-type",
        // ]),
        // scope brackets
        // scope
        // ...config.scopes.map((scope) => [
        //   new RegExp(`\\(${scope.scopeName}\\): `),
        //   "header-scope",
        // ]),
        // message
      ],

      comment: [
        // [/[^#]+/, 'comment' ],
        // [/[#*]/, 'comment' ],
      ],
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/^#.*$/, 'comment'],
      ],
    },
  }

  return conventionalCommitTokensProvider
}
