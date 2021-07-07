declare module '@commitlint/config-*' {
  import type { ParserOptions, QualifiedConfig } from '@commitlint/types'
  export type Config = Partial<QualifiedConfig & { parserOpts: ParserOptions }>
  const config: Config
  export default config
}


declare module 'conventional-changelog-conventionalcommits' {
  import type { ParserOptions } from '@commitlint/types'
  interface DefaultValues {
    context?: unknown;
    gitRawCommitsOpts?: GitRawCommitsOpts;
    parserOpts?: ParserOptions;
    writerOpts?: WriterOptions;
  }
  interface Options {
    config?: Promise<DefaultValues> | (() => DefaultValues) | DefaultValues;
    pkg?: {
      path?: string
      transform?: (packageJson: object) => object
    }
    append?: boolean
    releaseCount?: number
    skipUnstable?: boolean
    debug?: (msg: string) => void
    warn?: (msg: string) => void
    transform?: (commit: unknown, callback: (err: Error | null, commit: unknown) => void, through2This: unknown, ) => void
    outputUnreleased?: boolean
    lernaPackage?: unknown
    tagPrefix?: string
  }
  interface Context {
    host?: string
    owner?: string
    repository?: string
    repoUrl?: string
    gitSemverTags?: string[]
    previousTag?: string
    currentTag?: string
    packageData?: object
    linkCompare?: boolean
  }
  interface GitRawCommitsOpts {
    format?: string
    from?: number
    reverse?: boolean
    debug?: (msg: string) => void
    parserOpts?: ParserOptions
    warn?: (msg: string) => void
  }
  interface WriterOptions {
    transform?: object | ((commit: object) => string)
    groupBy?: string
    commitGroupSort?: ((commitGroup1: object, commitGroup2: object) => number) | string | string[]
    commitsSort?: ((commitGroup1: object, commitGroup2: object) => number) | string | string[]
    noteGroupsSort?: ((commitGroup1: object, commitGroup2: object) => number) | string | string[]
    notesSort?: ((commitGroup1: object, commitGroup2: object) => number) | string | string[]
    generateOn?: (() => void) | string | any
    finalizeContext?: (context: Context, options: object, commits: object[], keyCommit: object) => Context 
    debug?: (msg: string) => void
    reverse?: boolean
    includeDetails?: boolean
    ignoreReverted?: boolean
    doFlush?: boolean
    mainTemplate?: string
    headerPartial?: string
    commitPartial?: string
    footerPartial?: string
    partials?: object
  }
  interface ProcessedOptions {
    gitRawCommitsOpts: {
      noMerges: null
    },
    conventionalChangelog: {
      parserOpts: ParserOptions
      writerOpts: WriterOptions
    },
    parserOpts: ParserOptions
    recommendedBumpOpts: {
      parserOpts: ParserOptions
      whatBump: (...args: unknown[]) => unknown
    }
    writerOpts: WriterOptions
  }
  const conventionalCommits: (options?: Options, gitRawCommitsOpts?: GitRawCommitsOpts, parserOpts?: ParserOptions, writerOpts?: WriterOptions) => ProcessedOptions
  export default conventionalCommits
}
