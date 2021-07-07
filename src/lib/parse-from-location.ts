import type { Config } from "../types"

export function parseUrlParams(): {
  config?: Config
  message?: string
  errors?: string[]
} | null {
  if (!location.search) {
    return null
  }
  const params = new URLSearchParams(window.location.search)
  const paramMessage: string | undefined = params.get('message') ?? undefined
  const paramConfig: string | undefined = params.get('config') ?? undefined
  if (!paramMessage && !paramConfig) {
    return null
  }

  let config: Config | undefined = undefined
  let message: string | undefined = undefined
  const errors: string[] = []
  try {
    const urlConfig = paramConfig
      ? decodeURIComponent(paramConfig)
      : paramConfig
    const parsedConfig = urlConfig ? JSON.parse(urlConfig) : urlConfig
    config = parsedConfig
  } catch (err) {
    errors.push('could not parse config from params')
  }
  try {
    message = paramMessage ? decodeURIComponent(paramMessage) : paramMessage
  } catch (err) {
    errors.push('could not parse message from params')
  }
  return { config, message, errors }
}
