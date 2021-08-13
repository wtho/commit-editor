import type { Monaco } from './monaco'

type ValueType =
  | { type: 'array'; items: { type: 'string' } }
  | { type: 'string' | 'integer' }
  | { enum: readonly (string | number)[] }
  | {}

const ruleType = ({
  description,
  title,
  ...valueType
}: ValueType & { description?: string; title?: string }) => {
  const defaultRuleTuple = [{ enum: [0, 1, 2] }, { enum: ['always', 'never'] }]
  const hasKeys = Object.keys(valueType).length > 0
  return {
    type: 'array',
    items: hasKeys ? [...defaultRuleTuple, valueType] : defaultRuleTuple,
    description,
    title,
  }
}

export const caseArray = [
  'lower-case',
  'upper-case',
  'camel-case',
  'kebab-case',
  'pascal-case',
  'sentence-case',
  'snake-case',
  'start-case',
] as const
export type Case = typeof caseArray[number]
const caseDescription = `
'lower-case': default
'upper-case': UPPERCASE
'camel-case': camelCase
'kebab-case': kebab-case
'pascal-case': PascalCase
'sentence-case': Sentence case
'snake-case': snake_case
'start-case': Start Case`

export function initConfigSchema(monaco: Monaco) {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemaValidation: 'error',
    schemas: [
      {
        uri: 'internal://server/config.json',
        fileMatch: ['config.json'],
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          $id: 'internal://server/config.json',
          type: 'object',
          properties: {
            extends: {
              type: 'array',
              items: {
                enum: [
                  '@commitlint/config-conventional',
                  '@commitlint/config-angular',
                  '@commitlint/config-angular-type-enum',
                ],
              },
            },
            // TODO: parserPreset
            // TODO: formatter
            // TODO: ignores
            defaultIgnores: {
              type: 'boolean',
            },
            rules: {
              properties: {
                'body-full-stop': ruleType({
                  type: 'string',
                  title: 'body ends with value',
                  description: `The body must end with the configured value, e. g. '.'`,
                }),
                'body-leading-blank': ruleType({
                  title: 'body begins with blank line',
                  description: `The line before the body must be a blank line`,
                }),
                'body-empty': ruleType({
                  title: 'body is empty',
                  description: `The body must kept empty`,
                }),
                'body-max-length': ruleType({
                  type: 'integer',
                  title: 'body has value or less characters',
                  description:
                    'The body can consist of only up to the number of characters as configured',
                }), // TODO check infinity in json
                'body-max-line-length': ruleType({
                  type: 'integer',
                  title: 'body lines has value or less characters',
                  description: `Each line in the body can have a maximum length of characters as configured`,
                }),
                'body-min-length': ruleType({
                  type: 'integer',
                  title: 'body has value or more characters',
                  description: `The body must consist of at least as many characters as configured`,
                }),
                'body-case': ruleType({
                  enum: caseArray,
                  title: 'body is in case value',
                  description: `The body must be written in the configured case:${caseDescription}`,
                }),
                'footer-leading-blank': ruleType({
                  title: 'footer begins with blank line',
                  description: `The line before the footer must be a blank line`,
                }),
                'footer-empty': ruleType({
                  title: 'footer is empty',
                  description: `A footer is not allowed, it must be empty`,
                }),
                'footer-max-length': ruleType({
                  type: 'integer',
                  title: 'footer has value or less characters',
                  description: `The footer can consist of only up to the number of characters as configured`,
                }),
                'footer-max-line-length': ruleType({
                  type: 'integer',
                  title: 'footer lines has value or less characters',
                  description: `Each line in the footer can have a maximum length of characters as configured`,
                }),
                'footer-min-length': ruleType({
                  type: 'integer',
                  title: 'footer has value or more characters',
                  description: `The footer must consist of at least as many characters as configured`,
                }),
                'header-case': ruleType({
                  enum: caseArray,
                  title: 'header is in case value',
                  description: `The header must be written in the configured case:${caseDescription}`,
                }),
                'header-full-stop': ruleType({
                  type: 'string',
                  title: 'header ends with value',
                  description: `The header must end with the configured value, e. g. '.'`,
                }),
                'header-max-length': ruleType({
                  type: 'integer',
                  title: 'header has value or less characters',
                  description: `The header can consist of only up to the number of characters as configured`,
                }),
                'header-min-length': ruleType({
                  type: 'integer',
                  title: 'header has value or more characters',
                  description: `The header must consist of at least as many characters as configured`,
                }),
                'references-empty': ruleType({
                  title: 'references has at least one entry',
                  description: `When configured with 'never', the references must have at least one entry`,
                }),
                'scope-enum': ruleType({
                  type: 'array',
                  items: { type: 'string' },
                  title: 'scope is found in value',
                  description: `The scope value in brackets after the type must be one of the specified values`,
                }),
                'scope-case': ruleType({
                  enum: caseArray,
                  title: 'scope is in case value',
                  description: `The scope must be written in the configured case:${caseDescription}`,
                }),
                'scope-empty': ruleType({
                  title: 'scope is empty',
                  description: `A scope value is not allowed, it must be empty`,
                }),
                'scope-max-length': ruleType({
                  type: 'integer',
                  title: 'scope has value or less characters',
                  description: `The scope can consist of only up to the number of characters as configured`,
                }),
                'scope-min-length': ruleType({
                  type: 'integer',
                  title: 'scope has value or more characters',
                  description: `The scope must consist of at least as many characters as configured`,
                }),
                'subject-case': ruleType({
                  enum: caseArray,
                  title: 'subject is in case value',
                  description: `The subject must be written in the configured case:${caseDescription}`,
                }),
                'subject-empty': ruleType({
                  title: 'subject is empty',
                  description: `A subject is not allowed, it must be empty`,
                }),
                'subject-full-stop': ruleType({
                  type: 'string',
                  title: 'subject ends with value',
                  description: `The subject must end with the configured value, e. g. '.'`,
                }),
                'subject-max-length': ruleType({
                  type: 'integer',
                  title: 'subject has value or less characters',
                  description: `The subject can consist of only up to the number of characters as configured`,
                }),
                'subject-min-length': ruleType({
                  type: 'integer',
                  title: 'subject has value or more characters',
                  description: `The subject must consist of at least as many characters as configured`,
                }),
                'type-enum': ruleType({
                  type: 'array',
                  items: { type: 'string' },
                  title: 'type is found in value',
                  description: `The type value must be one of the specified values`,
                }),
                'type-case': ruleType({
                  enum: caseArray,
                  title: 'type is in case value',
                  description: `The type must be written in the configured case:${caseDescription}`,
                }),
                'type-empty': ruleType({
                  title: 'type is empty',
                  description: `Type is not allowed, it must be empty`,
                }),
                'type-max-length': ruleType({
                  type: 'integer',
                  title: 'type has value or less characters',
                  description: `The type can consist of only up to the number of characters as configured`,
                }),
                'type-min-length': ruleType({
                  type: 'integer',
                  title: 'type has value or more characters',
                  description: `The type must consist of at least as many characters as configured`,
                }),
                'signed-off-by': ruleType({
                  type: 'string',
                  title: 'message has value',
                  description: `message must contain the configured value, e. g. 'Signed-off-by:'`,
                }),
              },
            },
          },
          additionalProperties: false,
        },
      },
    ],
  })
}
