import { debounce } from "./debounce"


describe('debounce.ts', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  test('should call debounced after 1s if no second call happened', () => {
    const fn = jest.fn()

    const debounced = debounce(fn, 1000)
    debounced()
    jest.advanceTimersByTime(1000)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should not call debounced after 1s if no second call happened', () => {
    const fn = jest.fn()

    const debounced = debounce(fn, 1000)
    debounced()
    jest.advanceTimersByTime(999)

    expect(fn).toHaveBeenCalledTimes(0)
  })

  test('should not call debounced after 1.5s if second call happened after .8s', () => {
    const fn = jest.fn()

    const debounced = debounce(fn, 1000)
    debounced()
    jest.advanceTimersByTime(800)
    debounced()
    jest.advanceTimersByTime(800)

    expect(fn).toHaveBeenCalledTimes(0)
  })

  test('should call debounced after 1.5s if second call happened after .3s', () => {
    const fn = jest.fn()

    const debounced = debounce(fn, 1000)
    debounced()
    jest.advanceTimersByTime(300)
    debounced()
    jest.advanceTimersByTime(1200)

    expect(fn).toHaveBeenCalledTimes(1)
  })
})