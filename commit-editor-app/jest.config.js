/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'jsdom'
}
