export const debounce = (
  debouncee: (..._debounceeArgs: unknown[]) => unknown,
  waitForMsToTrigger: number,
) => {
  let timeoutHandle: number | undefined | NodeJS.Timeout
  return function (this: unknown, ...args: unknown[]) {
    const thisContext = this
    const delayedFunctionCall = () => {
      timeoutHandle = undefined
      debouncee.apply(thisContext, args)
    }
    clearTimeout(timeoutHandle as number | undefined)
    timeoutHandle = setTimeout(delayedFunctionCall, waitForMsToTrigger)
  }
}
