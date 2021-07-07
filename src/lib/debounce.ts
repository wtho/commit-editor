export const debounce = (
  func: (...args: any[]) => any,
  wait: number,
  immediate?: boolean
) => {
  let timeout: number | undefined
  return function (this: any) {
    const context = this
    const args: any[] = arguments as any
    const later = () => {
      timeout = undefined
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && timeout === undefined
    clearTimeout(timeout)
    timeout = setTimeout(later, wait) as any
    if (callNow) func.apply(context, args)
  }
}
