export const debounce = (
  func: (..._funcArgs: unknown[]) => unknown,
  wait: number,
  immediate?: boolean
) => {
  let timeout: number | undefined | NodeJS.Timeout
  return function (this: unknown, ...args: unknown[]) {
    const context = this
    const later = () => {
      timeout = undefined
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && timeout === undefined
    clearTimeout(timeout as number)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}
