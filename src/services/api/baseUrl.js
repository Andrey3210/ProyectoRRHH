const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const API_CONTEXT_PATH = import.meta.env.VITE_API_CONTEXT_PATH || '/api'

function computeApiBaseUrl() {
  const base = API_BASE_URL || 'http://localhost:8080'
  const context = API_CONTEXT_PATH || '/api'

  const normalizedContext = context ? `/${context.replace(/^\/+|\/+$/g, '')}` : ''

  const url = new URL(base)
  const basePath = url.pathname.replace(/\/+$/, '')
  const sanitizedPath = basePath === '/' ? '' : basePath

  const hasContext =
    !!normalizedContext &&
    (sanitizedPath === normalizedContext || sanitizedPath.endsWith(`${normalizedContext}`))

  const finalPath = hasContext ? sanitizedPath : `${sanitizedPath}${normalizedContext}`

  url.pathname = finalPath || '/'

  return url.toString().replace(/\/+$/, '')
}

export const getApiBaseUrl = (() => {
  let cachedBaseUrl
  return () => {
    if (!cachedBaseUrl) {
      cachedBaseUrl = computeApiBaseUrl()
    }
    return cachedBaseUrl
  }
})()
