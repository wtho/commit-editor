import { initConfigSchema } from './config-json-schema'

describe('config-json-schema.ts', () => {
  test('should init config schema', () => {

    const setDiagnosticsOptions = jest.fn()
    const monacoMock = {
      languages: {
        json: {
          jsonDefaults: {
            setDiagnosticsOptions
          }
        }
      }
    }

    initConfigSchema(monacoMock as any)

    expect(setDiagnosticsOptions).toHaveBeenCalled()
  })

  test('should snap config schema', () => {
    const setDiagnosticsOptions = jest.fn()
    const monacoMock = {
      languages: {
        json: {
          jsonDefaults: {
            setDiagnosticsOptions
          }
        }
      }
    }

    initConfigSchema(monacoMock as any)

    const schema = setDiagnosticsOptions.mock.calls[0][0].schemas[0].schema
    expect(schema).toMatchSnapshot()
  })
})