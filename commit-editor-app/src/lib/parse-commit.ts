import type { Commit } from '@commitlint/types'
import parse from '@commitlint/parse'
import type { Monaco, monaco } from './monaco'

export type CommitRanges = {
  // eslint-disable-next-line no-unused-vars
  [_key in keyof Commit]: monaco.Range | null
}

export const parseCommit = async (
  monaco: Monaco,
  {
    commitMessage,
  }: {
    commitMessage: string
  }
): Promise<{ parsed: Commit; ranges: CommitRanges }> => {
  const parsed = await parse(commitMessage)
  const rangeEntries = Object.entries(parsed).map(
    ([rawKey, value]: [string, string | null | string[]]) => {
      const key = rawKey as keyof Commit
      if (!value || typeof value !== 'string') {
        return [key, null]
      }
      if (key === 'type') {
        return [key, new monaco.Range(1, 1, 1, value.length)]
      }
      if (key === 'header') {
        return [key, new monaco.Range(1, 1, 1, value.length)]
      }
      if (key === 'scope') {
        const scopeBegin = parsed.header.indexOf('(') + 1
        return [
          key,
          new monaco.Range(1, scopeBegin, 1, scopeBegin + value.length),
        ]
      }
      if (key === 'subject') {
        const subjectBegin = parsed.header.indexOf(':') + 1
        return [
          key,
          new monaco.Range(1, subjectBegin, 1, subjectBegin + value.length),
        ]
      }
      if (key === 'body') {
        const bodyBegin = parsed.raw.indexOf(value)
        const textBeforeBody = parsed.raw.slice(0, bodyBegin)
        const linesBeforeBodyCount = textBeforeBody.split('\n').length
        const columnCountBeforeBody =
          textBeforeBody.split('\n').slice(-1)[0]?.length + 1 ?? 1
        const bodyLineCount = value.split('\n').length ?? 0
        const columnCountAfterBody = value.includes('\n')
          ? value.split('\n').slice(-1)[0].length + 1
          : columnCountBeforeBody + value.length + 1
        return [
          key,
          new monaco.Range(
            linesBeforeBodyCount,
            columnCountBeforeBody,
            linesBeforeBodyCount + bodyLineCount,
            columnCountAfterBody
          ),
        ]
      }
      if (key === 'footer') {
        const textBeforeFooter = parsed.raw.slice(
          0,
          parsed.raw.lastIndexOf(value)
        )
        const lineCountBeforeFooter = textBeforeFooter.split('\n').length
        const columnCountBeforeFooter =
          textBeforeFooter.split('\n').slice(-1)[0]?.length + 1 ?? 1
        const lineCountFooter = value.split('\n').length
        const columnCountAfterFooter = value.includes('\n')
          ? value.split('\n').slice(-1)[0].length + 1
          : columnCountBeforeFooter + value.length + 1
        return [
          key,
          new monaco.Range(
            lineCountBeforeFooter,
            columnCountBeforeFooter,
            lineCountBeforeFooter + lineCountFooter,
            columnCountAfterFooter
          ),
        ]
      }
      return [key, null]
    }
  )
  const ranges = Object.fromEntries(rangeEntries) as CommitRanges
  return { parsed, ranges }
}
