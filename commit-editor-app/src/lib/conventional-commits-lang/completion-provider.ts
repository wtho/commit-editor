import type { Config } from '../../types'
import type { Monaco } from '../monaco'
import type { monaco } from '../monaco'
import { docsForConventionalCommits, docsForTypes } from './documentation'
import {
  getRuleValue,
  hasRuleAlways,
  hasScopeEnum,
  hasTypeEnum,
  isAtBreakingChange,
  isAtScope,
  isAtType,
} from './utils'

export function provideCompletionItems(
  monaco: Monaco,
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  config: Config
): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
  const word = model.getWordUntilPosition(position)
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  }
  const rangeUntilPosition = {
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: 1,
    endColumn: position.column,
  }
  const inputUntilPosition = model.getValueInRange(rangeUntilPosition)
  if (position.lineNumber === 1) {
    // maybe type or scope

    if (isAtType(inputUntilPosition) && hasTypeEnum(config.rules)) {
      const typeEnumValues = getRuleValue<string[]>(config.rules, 'type-enum')
      const scopesAllowed = !hasRuleAlways(config.rules, 'scope-empty')
      // TODO read comment character from config
      const commentCharacter = '#'
      // TODO read empty line before body from config
      const linesBetweenHeaderBody = '\n\n'
      const insertTextForType = (type: string) =>
        scopesAllowed
          ? `${type}${'(${1:}): ${2:description}'}${linesBetweenHeaderBody}${'${3:'}${commentCharacter}${' body}'}`
          : `${type}${': ${1:description}'}${linesBetweenHeaderBody}${'${2:'}${commentCharacter}${' body}'}`
      return {
        suggestions: typeEnumValues?.map((type) => ({
          label: type,
          documentation:
            docsForTypes[type]?.title ?? docsForConventionalCommits.type.title,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: insertTextForType(type),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: rangeUntilPosition,
        })) ?? [],
      }
    }

    if (isAtScope(inputUntilPosition) && hasScopeEnum(config.rules)) {
      const scopeEnumValues = getRuleValue<string[]>(config.rules, 'scope-enum')
      return {
        suggestions: scopeEnumValues?.map((scope) => ({
          label: scope,
          documentation: docsForConventionalCommits.scope.title,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: scope,
          range,
        })) ?? [],
      }
    }
  }

  const currentLineRange: monaco.IRange = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: 1,
    endColumn: position.column,
  }
  const currentLineContent = model.getValueInRange(currentLineRange)
  if (position.lineNumber > 1 && isAtBreakingChange(currentLineContent)) {
    return {
      suggestions: [
        {
          label: 'BREAKING-CHANGE',
          insertText: 'BREAKING-CHANGE: ',
          range: currentLineRange,
          kind: monaco.languages.CompletionItemKind.Function,
        },
        {
          label: 'BREAKING CHANGE',
          insertText: 'BREAKING CHANGE: ',
          range: currentLineRange,
          kind: monaco.languages.CompletionItemKind.Function,
        },
      ],
    }
  }
  return {
    suggestions: [],
  }
}
