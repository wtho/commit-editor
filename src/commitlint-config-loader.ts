import * as path from 'path'


export async function loadCommitlintConfig() {
  // TODO error case
  // TODO smarter search for commitlint.config.js/commitlint.config.ts
  // as we know the git folder, we could search upwards up to it

  try {
    const configPath = require.resolve(path.join(process.cwd(), './commitlint.config'))
    const config = require(configPath)

    const stringifiedConfig = JSON.stringify(config, null, 2)
    return stringifiedConfig
  } catch (err) {
    return null
  }
}