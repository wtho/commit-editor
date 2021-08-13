/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  collectCoverageFrom: ['src/**/*.ts'],
}
