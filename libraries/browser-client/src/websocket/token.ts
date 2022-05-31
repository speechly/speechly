import { decode as base64Decode } from 'base-64'

type fetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>
type nowFn = () => number

export const minTokenValidTime = 60 * 60 * 1000 // 1 hour

/**
 * @internal
 */
export interface Token {
  appId: string
  projectId: string
  deviceId: string
  configId: string
  scopes: string[]
  issuer: string
  audience: string
  expiresAtMs: number
}

export async function fetchToken(
  baseUrl: string,
  projectId: string | undefined,
  appId: string | undefined,
  deviceId: string,
  fetcher: fetchFn = fetch,
  nowFn: nowFn = Date.now,
): Promise<string> {
  let body
  if (projectId !== undefined) {
    body = { projectId, deviceId }
  } else {
    body = { appId, deviceId }
  }

  const response = await fetcher(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = await response.json()

  if (response.status !== 200) {
    throw Error(json.error ?? `Speechly API login request failed with ${response.status}`)
  }

  if (json.access_token === undefined) {
    throw Error('Invalid login response from Speechly API')
  }

  if (!validateToken(json.access_token, projectId, appId, deviceId, nowFn)) {
    throw Error('Invalid token received from Speechly API')
  }

  return json.access_token
}

export function validateToken(
  token: string,
  projectId: string | undefined,
  appId: string | undefined,
  deviceId: string,
  now: nowFn = Date.now,
): boolean {
  const decoded = decodeToken(token)
  if (decoded.expiresAtMs - now() < minTokenValidTime) {
    return false
  }

  if (decoded.appId !== appId || decoded.projectId !== projectId) {
    return false
  }

  if (decoded.deviceId !== deviceId) {
    return false
  }

  return true
}

export function decodeToken(token: string): Token {
  const b = token.split('.')[1]

  let body: any
  try {
    body = JSON.parse(base64Decode(b))
  } catch (e) {
    throw new Error('Error decoding Speechly token!')
  }

  return {
    appId: body.appId,
    projectId: body.projectId,
    deviceId: body.deviceId,
    configId: body.configId,
    scopes: body.scope.split(' '),
    issuer: body.iss,
    audience: body.aud,
    expiresAtMs: body.exp * 1000, // JWT exp is in seconds, convert to ms, since that's what JS works with.
  }
}
