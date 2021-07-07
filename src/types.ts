import type { ParserOptions, QualifiedConfig } from '@commitlint/types'

export type Config = Partial<QualifiedConfig & { parserOpts: ParserOptions }>

export interface Icon {
  id: string
  viewBox: string
  paths: string[]
}
