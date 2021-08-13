import { parseUrlParams } from './parse-options-from-location'

describe('parse-options-from-locations.ts', () => {
  const oldWindowLocation = window.location
  const locationSearchGetter = jest.fn()

  beforeAll(() => {
    // @ts-ignore ts2790
    delete globalThis.location

    globalThis.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(oldWindowLocation),
        search: {
          configurable: true,
          get: locationSearchGetter,
        },
      }
    ) as any
  })
  beforeEach(() => {
    locationSearchGetter.mockReset()
  })
  afterAll(() => {
    window.location = oldWindowLocation
  })

  test('parses nothing', () => {
    const parsed = parseUrlParams()

    expect(parsed).toBeNull()
  })

  test('parses nothing from query without message and config', () => {
    locationSearchGetter.mockReturnValue('?notmessage=blabla&notconfig=blub')

    const parsed = parseUrlParams()

    expect(parsed).toBeNull()
  })

  test('parses only message from query without config', () => {
    locationSearchGetter.mockReturnValue('?message=some%20message')

    const { config, message, errors } = parseUrlParams()!

    expect(config).toBeUndefined()
    expect(message).toEqual('some message')
    expect(errors).toEqual([])
  })

  test('parses only config from query without message', () => {
    locationSearchGetter.mockReturnValue(
      '?config=%7B%22extends%22%3A%20%5B%22some-fancy-config%22%5D%7D'
    )

    const { config, message, errors } = parseUrlParams()!

    expect(config).toEqual({ extends: ['some-fancy-config'] })
    expect(message).toBeUndefined()
    expect(errors).toEqual([])
  })

  test('collects errors on parsing', () => {
    locationSearchGetter.mockReturnValue('?config=no-config&message=%E0%A4%A')

    const { config, message, errors } = parseUrlParams()!

    expect(config).toBeUndefined()
    expect(message).toBeUndefined()
    expect(errors).toEqual([
      'could not parse config from params',
      'could not parse message from params',
    ])
  })
})
