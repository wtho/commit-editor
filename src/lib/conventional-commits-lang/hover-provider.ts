import type { Config } from '../../types'
import { parseCommit } from '../parse-commit'
import type { Monaco, monaco } from '../monaco'
import { docsForTypes } from './documentation'

export async function provideHover(
  monaco: Monaco,
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  config: Config,
  allMarkers: monaco.editor.IMarkerData[] = []
): Promise<monaco.languages.Hover> {
  const currentMessage = model.getValue()
  const { parsed, ranges } = await parseCommit(monaco, {
    commitMessage: currentMessage,
  })
  if (ranges.type?.containsPosition(position)) {
    const range = ranges.type
    const type = parsed.type!
    const { title, description } = docsForTypes[type] ?? {
      title: undefined,
      description: undefined,
    }
    const specificTypeDocs = title ? [
      `${'**`'}${type}${'`**'} (${title}): ${description}`,
      '',
    ] : []

    // const typeMarkers = getMarkersForCommitPart(allMarkers, 'type')

    return {
      range,
      contents: [
        {
          value: [
            ...specificTypeDocs,
            'The **`type`** indicates the commit type.',
            '',
            'It declares the nature of the code changes, usually matching one of a limited set of possible types, which cover all typical modifications.',
            '',
            'The type is part of the header, whereas the header can have one of the following forms:',
            '```text',
            '<type>: <description>  ',
            // TODO: filter out when '!' is not in breaking pattern
            '<type>!: <description>            # with breaking-indicating \'!\'  ',
            '<type>(<scope>): <description>  ',
            // TODO: filter out when '!' is not in breaking pattern
            '<type>(<scope>)!: <description>   # with breaking-indicating \'!\'  ',
            '```',
          ].filter(line => line !== undefined).join('\n'),
        },
      ],
    }
  }
  if (ranges.scope?.containsPosition(position)) {
    const range = ranges.scope
    return {
      range,
      contents: [
        {
          value: [
            'The **`scope`** indicates the changed section of the code base',
            '',
            'If the scope is used, it should be a reused label of the code base section.',
            '',
            'The scope is part of the header, whereas the header can have one of the following forms:',
            '```text',
            '<type>: <description>  ',
            // TODO: filter out when '!' is not in breaking pattern
            '<type>!: <description>            # with breaking-indicating \'!\'  ',
            '<type>(<scope>): <description>  ',
            // TODO: filter out when '!' is not in breaking pattern
            '<type>(<scope>)!: <description>   # with breaking-indicating \'!\'  ',
            '```',
          ].filter(line => line !== undefined).join('\n'),
        }
      ]
    }
  }
  if (ranges.subject?.containsPosition(position)) {
    const range = ranges.subject
    return {
      range,
      contents: [
        {
          value: [
            'The **`description`** indicates the changed section of the code base',
            '',
            'If the description is used, it should be a reused label of the code base section.',
            '',
            'The description is part of the header, whereas the header can have one of the following forms:',
            '```text',
            '<type>: <description>  ',
            // TODO: filter out when '!' is not in breaking pattern
            '<type>!: <description>            # with breaking-indicating \'!\'  ',
            '<type>(<scope>): <description>  ',
            // TODO: filter out when '!' is not in breaking pattern
            '<type>(<scope>)!: <description>   # with breaking-indicating \'!\'  ',
            '```',
          ].filter(line => line !== undefined).join('\n'),
        }
      ]
    }
  }
  if (ranges.body?.containsPosition(position)) {
    const range = ranges.body
    return {
      range,
      contents: [
        {
          value: [
            'The **`body`** gives context and additional information about the code change',
            '',
            'It can be multi-line and free-form text.',
          ].filter(line => line !== undefined).join('\n'),
        }
      ]
    }
  }
  if (ranges.footer?.containsPosition(position)) {
    const range = ranges.footer
    return {
      range,
      contents: [
        {
          value: [
            'The **`footer`** contains a breaking change description or references related items',
            '',
            'The footer can be multi-line, whereas every line should be in one of the following forms:',
            '`BREAKING CHANGE: <description>`',
            '`<token>: <reference>`',
            '`<token> #<reference>',
          ].filter(line => line !== undefined).join('\n'),
        }
      ]
    }
  }
  return {
    contents: []
  }
}
