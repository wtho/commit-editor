import { extendableCommitlintConfigs } from './extendable-commitlint-configs'
import { default as configConventional } from '@commitlint/config-conventional'
import { default as configAngular } from '@commitlint/config-angular'
import { default as configAngularTypeEnum } from '@commitlint/config-angular-type-enum'

describe('extendable-commitlint-configs.ts', () => {
  test('should contain config-conventional', () => {
    const conf = extendableCommitlintConfigs['@commitlint/config-conventional']

    expect(conf).toBe(configConventional)
  })

  test('should contain config-angular', () => {
    const conf = extendableCommitlintConfigs['@commitlint/config-angular']

    expect(conf).toBe(configAngular)
  })

  test('should contain config-angular-type-enum', () => {
    const conf = extendableCommitlintConfigs['@commitlint/config-angular-type-enum']

    expect(conf).toBe(configAngularTypeEnum)
  })
})

