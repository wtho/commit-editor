import type {
  Commit,
  LintOptions,
  LintOutcome,
  ParserOptions,
  RuleConfigQuality,
  RulesConfig,
} from '@commitlint/types'
import lint from '@commitlint/lint'
import parse from '@commitlint/parse'
import type { monaco } from './monaco'

type IMarkerPosition = Pick<
  monaco.editor.IMarkerData,
  'startLineNumber' | 'startColumn' | 'endLineNumber' | 'endColumn'
>

interface PositionData {
  typePosition: IMarkerPosition
  scopePosition: IMarkerPosition
  subjectPosition: IMarkerPosition
  headerPosition: IMarkerPosition
  bodyPosition: IMarkerPosition
  footerPosition: IMarkerPosition
  referencesPosition: IMarkerPosition
  severity: number
  message: string
  commitMessage: string
}

export interface MessageSemVerUpdateState {
  major: boolean
  minor: boolean
  patch: boolean
}
const messageSemVerUpdateStateNoUpdate: MessageSemVerUpdateState = {
  major: false,
  minor: false,
  patch: false,
}

export const validate = async ({
  commitMessage,
  rules = {},
  options,
}: {
  commitMessage: string | undefined
  rules?: Partial<RulesConfig<RuleConfigQuality.Qualified>>,
  options?: LintOptions
}): Promise<{
  markers: monaco.editor.IMarkerData[]
  semVerUpdate: MessageSemVerUpdateState
  configErrors: string[]
}> => {
  if (!commitMessage || !commitMessage.trim()) {
    return { markers: [], semVerUpdate: messageSemVerUpdateStateNoUpdate, configErrors: [] }
  }
  let linted: LintOutcome
  let parsed: Commit
  try {
    const [lintOutcome, parsedCommit] = await Promise.all([
      lint(commitMessage, rules, options),
      parse(commitMessage, undefined, options?.parserOpts),
    ])
    linted = lintOutcome
    parsed = parsedCommit
  } catch (err) {
    return { markers: [], semVerUpdate: messageSemVerUpdateStateNoUpdate, configErrors: [err?.message] }
  }

  const lineStartsWithBreakingChange = /^BREAKING[- ]CHANGE:/
  const hasLineThatStartsWithBreakingChange = (text?: string | null) =>
    text?.split('\n').some((line) => lineStartsWithBreakingChange.test(line))
  const parserOpts = options?.parserOpts as
    | (ParserOptions & { breakingHeaderPattern?: RegExp })
    | undefined
  const breakingHeaderPattern = parserOpts?.breakingHeaderPattern
  const major =
    (breakingHeaderPattern?.test(parsed.header) ||
      hasLineThatStartsWithBreakingChange(parsed.footer) ||
      hasLineThatStartsWithBreakingChange(parsed.body)) ??
    false
  const minor = !major && parsed.type === 'feat'
  const patch = !major && !minor && parsed.type === 'fix'
  const semVerUpdate: MessageSemVerUpdateState = { major, minor, patch }

  if (linted.errors.length === 0 && linted.warnings.length === 0) {
    return { markers: [], semVerUpdate: semVerUpdate, configErrors: [] }
  }

  // find [startLineNumber, startCol, endLineNumber, endCol] of type, scope, subject, body, footer
  const typePosition = getTypePosition(parsed, commitMessage)
  const scopePosition = getScopePosition(parsed, commitMessage)
  const subjectPosition = getSubjectPosition(parsed, commitMessage)
  const headerPosition = getHeaderPosition(parsed, commitMessage)
  const bodyPosition = getBodyPosition(parsed, commitMessage, rules)
  const footerPosition = getFooterPosition(parsed, commitMessage)
  const referencesPosition = getReferencesPosition(parsed, commitMessage)

  const markers = [...linted.errors, ...linted.warnings]
    .map((linteds) => {
      const severity = linteds.level * 4
      const message = `${linteds.message} (${linteds.name})`
      const positionData: PositionData = {
        typePosition,
        scopePosition,
        subjectPosition,
        headerPosition,
        bodyPosition,
        footerPosition,
        referencesPosition,
        message,
        severity,
        commitMessage,
      }
      const match = Object.entries(markerPositions).find(([ruleStartsWith]) =>
        linteds.name.startsWith(ruleStartsWith)
      )
      if (!match) {
        return null
      }
      return match[1](positionData, rules)
    })
    .filter((l) => {
      return !!l
    }) as monaco.editor.IMarkerData[]
  return { markers, semVerUpdate: semVerUpdate, configErrors: [] }
}

const markerPositions: {
  [ruleStartsWith: string]: (
    _positionData: PositionData,
    _rules?: Partial<RulesConfig<RuleConfigQuality.Qualified>>
  ) => monaco.editor.IMarkerData
} = {
  'header-max-length': ({ headerPosition, severity, message }, rules) => ({
    ...headerPosition,
    startColumn:
      rules?.['header-max-length']?.[2] ?? headerPosition.startColumn,
    severity,
    message,
  }),
  'header-': ({ headerPosition, severity, message }) => ({
    ...headerPosition,
    severity,
    message,
  }),
  'type-': ({ typePosition, severity, message }) => ({
    ...typePosition,
    severity,
    message,
  }),
  'scope-': ({ scopePosition, severity, message }) => ({
    ...scopePosition,
    severity,
    message,
  }),
  'subject-': ({ subjectPosition, severity, message }) => ({
    ...subjectPosition,
    severity,
    message,
  }),
  'body-leading-blank': ({
    severity,
    message,
    commitMessage,
  }) => ({
    ...fullLineOfMessage(1, commitMessage),
    severity,
    message,
  }),
  'body-': ({ bodyPosition, severity, message }) => ({
    ...bodyPosition,
    severity,
    message,
  }),
  'footer-leading-blank': ({
    footerPosition,
    severity,
    message,
    commitMessage,
  }) => ({
    ...firstLineOfPosition(footerPosition, commitMessage),
    severity,
    message,
  }),
  'footer-': ({ footerPosition, severity, message }) => ({
    ...footerPosition,
    severity,
    message,
  }),
}

const firstLineOfPosition = (
  position: IMarkerPosition,
  message: string
): IMarkerPosition => {
  return {
    ...position,
    endLineNumber: position.startLineNumber,
    endColumn: (message.split('\n')[position.startLineNumber]?.length ?? 0) + 1,
  }
}

const fullLineOfMessage = (
  lineIndex: number,
  message: string
): IMarkerPosition => {
  if (!message) {
    return {
      startLineNumber: 1,
      endLineNumber: 1,
      startColumn: 0,
      endColumn: 1,
    }
  }
  const lines = message.split('\n')
  if (lines.length <= lineIndex) {
    // mark last part of last line
    return {
      startLineNumber: lines.length,
      endLineNumber: lines.length,
      startColumn: lines.slice(-1)[0].length,
      endColumn: lines.slice(-1)[0].length + 1,
    }
  }
  return {
    startLineNumber: lineIndex + 1,
    endLineNumber: lineIndex + 1,
    startColumn: 0,
    endColumn: lines[lineIndex].length + 1,
  }
}

const getTypePosition = (
  parsed: Commit,
  commitMessage: string
): IMarkerPosition => {
  if (parsed.type) {
    const parsedTypeIndex = commitMessage.indexOf(parsed.type)
    return {
      startLineNumber: 0,
      startColumn: parsedTypeIndex,
      endLineNumber: 0,
      endColumn: parsedTypeIndex + parsed.type.length + 1,
    }
  }
  return {
    startLineNumber: 0,
    startColumn: 0,
    endLineNumber: 0,
    endColumn: Math.max(
      commitMessage.split('(')[0].split(' ')[0].length + 1,
      1
    ),
  }
}

const getScopePosition = (
  parsed: Commit,
  commitMessage: string
): IMarkerPosition => {
  if (parsed.scope) {
    const parsedScopeIndex = commitMessage.indexOf(parsed.scope) + 1
    return {
      // TODO: what to do if e. g. type can be 'feat' and scope can be 'feat' too? -> better detection! -> brackets
      startLineNumber: 1,
      startColumn: parsedScopeIndex,
      endLineNumber: 1,
      endColumn: parsedScopeIndex + parsed.scope.length,
    }
  }
  const [header] = commitMessage.split('\n')
  const preColon = header.includes(':') ? header.split(':')[0] : header
  if (!preColon) {
    return {
      startLineNumber: 0,
      startColumn: 0,
      endLineNumber: 0,
      endColumn: 1,
    }
  }
  if (preColon.includes('(')) {
    const [preColonSkip, afterOpenBrackets] = preColon.split('(')
    if (!afterOpenBrackets.includes(')')) {
      return {
        startLineNumber: 0,
        startColumn: preColonSkip.length + 1,
        endLineNumber: 0,
        endColumn: preColonSkip.length + 1 + afterOpenBrackets.length + 1,
      }
    }
    const [inBrackets] = afterOpenBrackets.split(')')
    if (inBrackets) {
      return {
        startLineNumber: 0,
        startColumn: preColonSkip.length + 1,
        endLineNumber: 0,
        endColumn: preColonSkip.length + 1 + inBrackets.length + 1,
      }
    }
    return {
      startLineNumber: 0,
      startColumn: preColonSkip.length,
      endLineNumber: 0,
      endColumn: preColonSkip.length + 2,
    }
  }
  return {
    startLineNumber: 0,
    startColumn: 0,
    endLineNumber: 0,
    endColumn: Math.max(commitMessage.split('\n')[0].length, 1),
  }
}

const getSubjectPosition = (
  parsed: Commit,
  commitMessage: string
): IMarkerPosition => {
  if (parsed.subject) {
    const parsedSubjectIndex = commitMessage
      .split('\n')[0]
      .lastIndexOf(parsed.subject)
    return {
      startLineNumber: 1,
      startColumn: parsedSubjectIndex + 1,
      endLineNumber: 1,
      endColumn: parsedSubjectIndex + parsed.subject.length + 1,
    }
  }
  const [header] = commitMessage.split('\n')
  if (!header) {
    return {
      startLineNumber: 0,
      startColumn: 0,
      endLineNumber: 0,
      endColumn: 1,
    }
  }
  if (header.includes(': ')) {
    return {
      startLineNumber: 0,
      startColumn: header.indexOf(': ') + 2,
      endLineNumber: 0,
      endColumn: header.length + 1,
    }
  }
  if (header.includes(':')) {
    return {
      startLineNumber: 0,
      startColumn: header.indexOf(':') + 1,
      endLineNumber: 0,
      endColumn: header.length + 1,
    }
  }
  return {
    startLineNumber: 0,
    startColumn: 0,
    endLineNumber: 0,
    endColumn: header.length + 1,
  }
}

const getHeaderPosition = (
  parsed: Commit,
  commitMessage: string
): IMarkerPosition => {
  return {
    startLineNumber: 0,
    endLineNumber: 0,
    startColumn: 0,
    endColumn: parsed.header
      ? parsed.header.length + 1
      : commitMessage.split('\n')[0].length + 1,
  }
}

const getBodyPosition = (
  parsed: Commit,
  commitMessage: string,
  rules: Partial<RulesConfig<RuleConfigQuality.Qualified>>
): IMarkerPosition => {
  const [severity, condition] = Object.values({
    ...[2, 'always'],
    ...rules['body-leading-blank'],
  })
  const bodyStartLineAccordingToLeadingBlankRule =
    severity > 0 && condition === 'always' ? 3 : 2
  if (!parsed.body) {
    return {
      startLineNumber: bodyStartLineAccordingToLeadingBlankRule,
      startColumn: 1,
      endLineNumber: bodyStartLineAccordingToLeadingBlankRule,
      endColumn: 2,
    }
  }
  const bodyStartIndex = commitMessage.indexOf(parsed.body)
  const bodyStartLineAccordingToParsed = bodyStartIndex
    ? commitMessage.slice(0, bodyStartIndex)?.split('\n').length
    : undefined
  const bodyStartLine =
    bodyStartLineAccordingToParsed ?? bodyStartLineAccordingToLeadingBlankRule
  const bodyLineCount = parsed.body
    ? parsed.body?.split('\n').length - 1
    : Math.max(commitMessage?.split('\n').length, bodyStartLine + 1) -
      bodyStartLine -
      1
  const endColumn = parsed.body
    ? parsed.body?.split('\n').slice(-1)[0].length + 1
    : commitMessage?.split('\n').slice(-1)[0].length + 1
  return {
    startLineNumber: bodyStartLine,
    startColumn: 1,
    endLineNumber: bodyStartLine + bodyLineCount,
    endColumn,
  }
}

const getFooterPosition = (
  parsed: Commit,
  commitMessage: string
): IMarkerPosition => {
  const lines = commitMessage.split('\n')
  const lastLineIdx = lines.length
  if (!parsed.footer) {
    const lastLineLength = lines.slice(-1)[0].length
    return {
      startLineNumber: lastLineIdx,
      startColumn: lastLineLength,
      endColumn: lastLineIdx,
      endLineNumber: lastLineLength + 1,
    }
  }

  // search from end to find footer line
  const textBeforeFooter = commitMessage.slice(
    0,
    commitMessage.lastIndexOf(parsed.footer)
  )
  const lineCountBeforeFooter = textBeforeFooter.split('\n').length
  const lineCountFooter = parsed.footer.split('\n').length - 1
  const footerStartColumn = textBeforeFooter.split('\n').slice(-1)[0].length + 1
  const footerEndColumn = parsed.footer.includes('\n')
    ? parsed.footer.split('\n').slice(-1)[0].length + 1
    : parsed.footer.length + footerStartColumn

  return {
    startLineNumber: lineCountBeforeFooter,
    startColumn: footerStartColumn,
    endLineNumber: lineCountBeforeFooter + lineCountFooter,
    endColumn: footerEndColumn,
  }
}

const getReferencesPosition = (
  parsed: Commit,
  commitMessage: string
): IMarkerPosition => {
  // TODO references
  const lines = commitMessage.split('\n')
  const lastLineIdx = lines.length
  const lastLineLength = lines.slice(-1)[0].length
  return {
    startLineNumber: lastLineIdx,
    startColumn: lastLineLength,
    endColumn: lastLineIdx,
    endLineNumber: lastLineLength + 1,
  }
}
