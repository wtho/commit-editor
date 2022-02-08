import * as convertCase from 'js-convert-case'
import type { Case } from '../config-json-schema'
import type { monaco } from '../monaco'
import type { Commit, RulesConfig } from '@commitlint/types'
import type { RuleConfigSeverity, RuleConfigCondition } from '@commitlint/types'

export function hasRule<R extends keyof RulesConfig>(
  rules: Partial<RulesConfig> | undefined,
  ruleName: R
): rules is Partial<RulesConfig> & { [theRuleName in R]: Readonly<[RuleConfigSeverity, RuleConfigCondition]> | Readonly<[RuleConfigSeverity, RuleConfigCondition, unknown]> } {
  if (!rules || !(ruleName in rules)) {
    return false
  }
  const rule = rules[ruleName]
  if (!rule || !Array.isArray(rule) || rule[0] === 0) {
    return false
  }
  return true
}

export function hasRuleAlways<R extends keyof RulesConfig>(
  rules: Partial<RulesConfig> = {},
  ruleName: R
): boolean {
  if (!hasRule(rules, ruleName)) {
    return false
  }
  const rule = rules[ruleName]
  if (rule.length > 1 && rule[1] === 'always') {
    return true
  }
  return false
}
export function hasRuleNever(
  rules: Partial<RulesConfig> | undefined,
  ruleName: keyof RulesConfig
): boolean {
  if (!hasRule(rules, ruleName)) {
    return false
  }
  const rule = rules[ruleName]
  if (rule[1] === 'never') {
    return true
  }
  return false
}
export function getRuleValue<T = unknown>(
  rules: Partial<RulesConfig> = {},
  ruleName: keyof RulesConfig
): T | null {
  if (!(ruleName in rules) || !rules[ruleName] || !Array.isArray(rules[ruleName]) || rules[ruleName]!.length < 2) {
    return null
  }
  const rule = rules[ruleName]! as Readonly<[RuleConfigSeverity, RuleConfigCondition, T]>
  return rule[2]
}
export function isAtType(currentMessage: string): boolean {
  if (currentMessage === '') {
    return true
  }
  return /^[a-zA-Z0-9]*$/.test(currentMessage)
}
export function isAtScope(currentMessage: string): boolean {
  return /^[a-zA-Z0-9]*\([\w\s-]*$/.test(currentMessage)
}
export function isAtBreakingChange(lineContent: string): boolean {
  return ['BREAKING-CHANGE: ', 'BREAKING CHANGE: '].some(
    (keyword) => keyword.slice(0, lineContent.length) === lineContent
  )
}
export function hasTypeEnum(rules?: Partial<RulesConfig>): boolean {
  if (!hasRule(rules, 'type-enum') || hasRuleNever(rules, 'type-enum')) {
    return false
  }
  const typeEnumValues = getRuleValue<string[]>(rules, 'type-enum')
  if (
    !typeEnumValues ||
    !Array.isArray(typeEnumValues) ||
    typeEnumValues.length === 0
  ) {
    return false
  }
  return true
}
export function hasScopeEnum(rules?: Partial<RulesConfig>): boolean {
  if (!hasRule(rules, 'scope-enum') || hasRuleNever(rules, 'scope-enum')) {
    return false
  }
  const scopeEnumValues = getRuleValue<string[]>(rules, 'scope-enum')
  if (
    !scopeEnumValues ||
    !Array.isArray(scopeEnumValues) ||
    scopeEnumValues.length === 0
  ) {
    return false
  }
  return true
}

export function getMarkerForCommitPart(
  markers: monaco.editor.IMarkerData[],
  commitPart: keyof Commit
): { marker: monaco.editor.IMarkerData; rule: string }[] {
  return markers
    .filter((marker) =>
      marker.message.match(new RegExp(`\\(${commitPart}[\\w-]*\\)$`))
    )
    .map((marker) => ({
      marker,
      rule: marker.message.slice(marker.message.lastIndexOf('('), -1),
    }))
}

export function getRuleNameFromMarkerMessage(message: string): string | null {
  const match = message?.match(/\([\w-]+\)$/)
  if (!match || !match[0]) {
    return null
  }
  return match[0].slice(1, -1)
}

export function textToCase(text: string, newCase: Case): string {
  if (newCase === 'camel-case') {
    return convertCase.toCamelCase(text)
  }
  if (newCase === 'kebab-case') {
    return convertCase.toDotCase(text).replace(/\./g, '-').toLocaleLowerCase()
  }
  if (newCase === 'lower-case') {
    return text.toLocaleLowerCase()
  }
  if (newCase === 'pascal-case') {
    return convertCase.toPascalCase(text)
  }
  if (newCase === 'sentence-case') {
    return convertCase.toSentenceCase(text)
  }
  if (newCase === 'snake-case') {
    return convertCase.toSnakeCase(text)
  }
  if (newCase === 'start-case') {
    return convertCase.toHeaderCase(text)
  }
  if (newCase === 'upper-case') {
    return text.toLocaleUpperCase()
  }
  return text
}
