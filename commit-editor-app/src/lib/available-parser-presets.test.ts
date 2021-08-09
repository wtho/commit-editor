import { default as conventionalChangelogConventionalcommits } from 'conventional-changelog-conventionalcommits'
import { availableParserPresets } from './available-parser-presets'

describe('available-parser-presets.ts', () => {
  test('should load available parser presets', () => {

    const convChangConvComPreset = availableParserPresets['conventional-changelog-conventionalcommits']

    expect(convChangConvComPreset.name).toEqual('conventional-changelog-conventionalcommits')
    expect(convChangConvComPreset.path).toEqual('./dependencies/conventional-changelog-conventionalcommits')
    expect(convChangConvComPreset.parserOpts).toEqual(conventionalChangelogConventionalcommits)
  })
})
