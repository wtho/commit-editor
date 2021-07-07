import { default as configConventional } from '@commitlint/config-conventional'
import { default as configAngular } from '@commitlint/config-angular'
import { default as configAngularTypeEnum } from '@commitlint/config-angular-type-enum'
import type { Config } from '../types'

export const extendableCommitlintConfigs: Record<string, Config> = {
  '@commitlint/config-conventional': configConventional,
  '@commitlint/config-angular': configAngular,
  '@commitlint/config-angular-type-enum': configAngularTypeEnum,
}
