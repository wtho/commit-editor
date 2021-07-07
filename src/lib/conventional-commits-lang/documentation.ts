export const docsForTypes: Record<
  string,
  { title: string; description: string }
> = {
  fix: {
    title: 'Bug Fix',
    description: 'A bug fix',
  },
  feat: {
    title: 'New Feature',
    description: 'A new feature',
  },
  build: {
    title: 'Build System Changes',
    description:
      'Changes that affect the build system or external dependencies',
  },
  chore: {
    title: 'Housekeeping Changes',
    description: 'Changes that do not modify src or test files',
  },
  ci: {
    title: 'Continuous Integration',
    description: 'Changes to CI configuration files and scripts',
  },
  docs: {
    title: 'Documentation',
    description: 'Changes only related to the documentation',
  },
  style: {
    title: 'Code Style',
    description:
      'Changes not affecting the meaning of code (white-space, formatting, semi-colons, etc)',
  },
  refactor: {
    title: 'Code Refactoring',
    description: 'Code change that neither fixes a bug nor adds a feature',
  },
  perf: {
    title: 'Performance Improvement',
    description: 'A code change that improves performance',
  },
  test: {
    title: 'Test',
    description: 'Adding or adjusting tests',
  },
  revert: {
    title: 'Revert Commit',
    description: 'Reverts a previous commit',
  },
}

export const docsForConventionalCommits = {
  type: {
    title: 'Type of change',
    description:
      'Describes the type of the change with a single word in the beginning of the commit message',
  },
  scope: {
    title: 'Scope of code change in code base',
    description:
      'A noun describing the section of the code base - surrounded by paranthesis',
  },
  subject: {
    title: 'Description',
    description:
      'Short single-line summary of the code changes, e. g. fix: array parsing issue when multiple spaces were contained in string',
  },
  body: {
    title: 'Long description of change',
    description:
      'Multi-line free-form text describing the code changes, giving more information than in the description',
  },
  breakingChangeExclamationMark: {
    title: 'Marks as breaking change',
    description:
      'The exclamation mark after the type/scope marks the code change as a breaking change according to semantic versioning',
  },
  breakingChangeDashed: {
    title: 'Marks as breaking change',
    description:
      'The BREAKING-CHANGE marks the code change as a breaking change according to semantic versioning',
  },
  breakingChangeSpaced: {
    title: 'Marks as breaking change',
    description:
      'The BREAKING CHANGE marks the code change as a breaking change according to semantic versioning',
  },
  // TODO: footer / issue refs
}
