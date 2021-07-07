import { Case, caseArray } from '../config-json-schema'
import type { RuleConfigQuality, RulesConfig } from '@commitlint/types'
import type { Config } from '../../types'
import type { monaco } from '../monaco'
import { getRuleNameFromMarkerMessage, getRuleValue, hasRuleNever, textToCase } from './utils'

// Missing QuickFixes:
//   body-max-length
//   body-max-line-length
//   body-min-length
//   footer-max-length
//   footer-max-line-length
//   footer-min-length
//   header-max-length
//   header-min-length
//   references-empty
//   scope-max-length
//   scope-min-length
//   subject-max-length
//   subject-min-length
//   type-max-length
//   type-min-length
//   signed-off-by

function getQuickFixForMarker(
  model: monaco.editor.ITextModel,
  marker: monaco.editor.IMarkerData,
  rules: Partial<RulesConfig<RuleConfigQuality.Qualified>> = {}
): {
  title: string
  range: monaco.IRange
  text: string
  marker: monaco.editor.IMarkerData
}[] {
  const ruleName = getRuleNameFromMarkerMessage(marker.message)

  // body-full-stop
  if (ruleName === 'body-full-stop') {
    const dot = getRuleValue<string>(rules, ruleName)
    if (
      !dot ||
      typeof dot !== 'string' ||
      dot.length !== 1 // there seems to be a problem with ending longer than 1 char in commitlint
    ) {
      return []
    }
    return [{
      title: `Append '${dot}' to the end of the body`,
      text: dot,
      range: {
        startLineNumber: marker.endLineNumber,
        endLineNumber: marker.endLineNumber,
        startColumn: marker.endColumn,
        endColumn: marker.endColumn,
      },
      marker,
    }]
  }
  // body-leading-blank
  if (ruleName === 'body-leading-blank') {
    if (hasRuleNever(rules, ruleName)) {
      return [{
        title: `Remove blank line before body`,
        text: '',
        range: {
          startLineNumber: 2,
          endLineNumber: 3,
          startColumn: 1,
          endColumn: 1,
        },
        marker,
      }]
    }
    return [{
      title: `Insert blank line before body`,
      text: '\n',
      range: {
        startLineNumber: 2,
        endLineNumber: 2,
        startColumn: 1,
        endColumn: 1,
      },
      marker,
    }]
  }
  // body-empty
  if (ruleName === 'body-empty') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    return [{
      title: `Delete complete body`,
      text: '',
      range: marker,
      marker,
    }]
  }
  // body-case
  if (ruleName === 'body-case') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    const newCase = getRuleValue<Case | Case[]>(rules, ruleName) 
    if (!newCase) {
      return []
    }
    if (typeof newCase === 'string' && !caseArray.includes(newCase)) {
      return []
    }
    if (Array.isArray(newCase) && newCase.some(aCase => typeof aCase !== 'string' || !caseArray.includes(aCase))) {
      return []
    }

    const currentText = model.getValueInRange(marker)

    if (typeof newCase === 'string') {
      return [{
        title: `Transform body to ${newCase}`,
        text: textToCase(currentText, newCase),
        range: marker,
        marker,
      }]
    }
    if (Array.isArray(newCase)) {
      return newCase.map(aCase => ({
        title: `Transform body to ${aCase}`,
        text: textToCase(currentText, aCase),
        range: marker,
        marker,
      }))
    }
  }
  // footer-leading-blank
  if (ruleName === 'footer-leading-blank') {
    if (hasRuleNever(rules, ruleName)) {
      return [{
        title: `Remove blank line before footer`,
        text: '',
        range: {
          startLineNumber: marker.startLineNumber - 1,
          endLineNumber: marker.startLineNumber,
          startColumn: 1,
          endColumn: 1,
        },
        marker,
      }]
    }
    return [{
      title: `Insert blank line before footer`,
      text: '\n',
      range: {
        startLineNumber: marker.startLineNumber,
        endLineNumber: marker.startLineNumber,
        startColumn: 1,
        endColumn: 1,
      },
      marker,
    }]
  }
  // footer-empty
  if (ruleName === 'footer-empty') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    return [{
      title: `Delete complete footer`,
      text: '',
      range: marker,
      marker,
    }]
  }
  // header-case
  if (ruleName === 'header-case') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    const newCase = getRuleValue<Case | Case[]>(rules, ruleName) 
    if (!newCase) {
      return []
    }
    if (typeof newCase === 'string' && !caseArray.includes(newCase)) {
      return []
    }
    if (Array.isArray(newCase) && newCase.some(aCase => typeof aCase !== 'string' || !caseArray.includes(aCase))) {
      return []
    }

    const currentText = model.getValueInRange(marker)

    if (typeof newCase === 'string') {
      return [{
        title: `Transform header to ${newCase}`,
        text: textToCase(currentText, newCase),
        range: marker,
        marker,
      }]
    }
    if (Array.isArray(newCase)) {
      return newCase.map(aCase => ({
        title: `Transform header to ${aCase}`,
        text: textToCase(currentText, aCase),
        range: marker,
        marker,
      }))
    }
  }
  // header-full-stop
  if (ruleName === 'header-full-stop') {
    const dot = getRuleValue<string>(rules, ruleName)
    if (
      !dot ||
      typeof dot !== 'string' ||
      dot.length !== 1 // there seems to be a problem with ending longer than 1 char in commitlint
    ) {
      return []
    }
    return [{
      title: `Append '${dot}' to the end of the header`,
      text: dot,
      range: {
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: marker.endColumn,
        endColumn: marker.endColumn,
      },
      marker,
    }]
  }
  // scope-enum
  if (ruleName === 'scope-enum') {
    const scopes = getRuleValue<string[]>(rules, ruleName)
    if (
      !scopes ||
      !Array.isArray(scopes) ||
      scopes.some((scope) => typeof scope !== 'string')
    ) {
      return []
    }
    return scopes.map((scope) => ({
      title: `Set <scope> to ${scope}`,
      range: marker,
      text: scope,
      marker,
    }))
  }

  // scope-case
  if (ruleName === 'scope-case') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    const newCase = getRuleValue<Case | Case[]>(rules, ruleName) 
    if (!newCase) {
      return []
    }
    if (typeof newCase === 'string' && !caseArray.includes(newCase)) {
      return []
    }
    if (Array.isArray(newCase) && newCase.some(aCase => typeof aCase !== 'string' || !caseArray.includes(aCase))) {
      return []
    }

    const currentText = model.getValueInRange(marker)

    if (typeof newCase === 'string') {
      return [{
        title: `Transform scope to ${newCase}`,
        text: textToCase(currentText, newCase),
        range: marker,
        marker,
      }]
    }
    if (Array.isArray(newCase)) {
      return newCase.map(aCase => ({
        title: `Transform scope to ${aCase}`,
        text: textToCase(currentText, aCase),
        range: marker,
        marker,
      }))
    }
  }
  // scope-empty
  if (ruleName === 'scope-empty') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    return [{
      title: `Delete complete scope`,
      text: '',
      range: {
        ...marker,
        startColumn: marker.startColumn - 1,
        endColumn: marker.endColumn + 1,
      },
      marker,
    }]
  }
  // subject-case
  if (ruleName === 'subject-case') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    const newCase = getRuleValue<Case | Case[]>(rules, ruleName) 
    if (!newCase) {
      return []
    }
    if (typeof newCase === 'string' && !caseArray.includes(newCase)) {
      return []
    }
    if (Array.isArray(newCase) && newCase.some(aCase => typeof aCase !== 'string' || !caseArray.includes(aCase))) {
      return []
    }

    const currentText = model.getValueInRange(marker)

    if (typeof newCase === 'string') {
      return [{
        title: `Transform description to ${newCase}`,
        text: textToCase(currentText, newCase),
        range: marker,
        marker,
      }]
    }
    if (Array.isArray(newCase)) {
      return newCase.map(aCase => ({
        title: `Transform description to ${aCase}`,
        text: textToCase(currentText, aCase),
        range: marker,
        marker,
      }))
    }
  }
  // subject-empty
  if (ruleName === 'subject-empty') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    return [{
      title: `Delete complete description`,
      text: '',
      range: marker,
      marker,
    }]
  }
  // subject-full-stop
  if (ruleName === 'subject-full-stop') {
    const dot = getRuleValue<string>(rules, ruleName)
    if (
      !dot ||
      typeof dot !== 'string' ||
      dot.length !== 1 // there seems to be a problem with ending longer than 1 char in commitlint
    ) {
      return []
    }
    return [{
      title: `Append '${dot}' to the end of the subject`,
      text: dot,
      range: {
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: marker.endColumn,
        endColumn: marker.endColumn,
      },
      marker,
    }]
  }
  // type-enum
  if (ruleName === 'type-enum') {
    const types = getRuleValue<string[]>(rules, ruleName)
    if (
      !types ||
      !Array.isArray(types) ||
      types.some((type) => typeof type !== 'string')
    ) {
      return []
    }
    return types.map((type) => ({
      title: `Set <type> to ${type}`,
      range: marker,
      text: type,
      marker,
    }))
  }
  // type-case
  if (ruleName === 'type-case') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    const newCase = getRuleValue<Case | Case[]>(rules, ruleName) 
    if (!newCase) {
      return []
    }
    if (typeof newCase === 'string' && !caseArray.includes(newCase)) {
      return []
    }
    if (Array.isArray(newCase) && newCase.some(aCase => typeof aCase !== 'string' || !caseArray.includes(aCase))) {
      return []
    }

    const currentText = model.getValueInRange(marker)

    if (typeof newCase === 'string') {
      return [{
        title: `Transform type to ${newCase}`,
        text: textToCase(currentText, newCase),
        range: marker,
        marker,
      }]
    }
    if (Array.isArray(newCase)) {
      return newCase.map(aCase => ({
        title: `Transform type to ${aCase}`,
        text: textToCase(currentText, aCase),
        range: marker,
        marker,
      }))
    }
  }
  // type-empty
  if (ruleName === 'type-empty') {
    if (hasRuleNever(rules, ruleName)) {
      return []
    }
    return [{
      title: `Delete complete type`,
      text: '',
      range: marker,
      marker,
    }]
  }

  return []
}

export async function provideCodeActions(
  model: monaco.editor.ITextModel,
  range: monaco.IRange,
  config: Config,
  markers: monaco.editor.IMarkerData[]
): Promise<monaco.languages.CodeActionList> {
  const quickFixesForMarkers = markers.flatMap((marker) =>
    getQuickFixForMarker(model, marker, config?.rules)
  )
  return {
    actions: quickFixesForMarkers.map((quickFix) => ({
      title: quickFix.title,
      diagnostics: [quickFix.marker],
      kind: 'quickfix',
      edit: {
        edits: [
          {
            resource: model.uri,
            edit: {
              range: quickFix.range,
              text: quickFix.text,
            },
          },
        ],
      },
    })),
    dispose: () => {},
  }
}
