import { decode as base64Decode } from 'base-64'

const secondsInHour = 60 * 60
type fetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>
type nowFn = () => number

export interface Token {
  appId: string
  deviceId: string
  configId: string
  scopes: string[]
  issuer: string
  audience: string
  expiresAt: number
}

export async function fetchToken(
  baseUrl: string,
  appId: string,
  deviceId: string,
  fetcher: fetchFn = fetch,
  nowFn: nowFn = Date.now,
): Promise<string> {
  const body = { appId, deviceId }

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

  if (!validateToken(json.access_token, appId, deviceId, nowFn)) {
    throw Error('Invalid token received from Speechly API')
  }

  return json.access_token
}

export function validateToken(token: string, appId: string, deviceId: string, now: nowFn = Date.now): boolean {
  const decoded = decodeToken(token)

  // If the token will expire in an hour or less, mark it as invalid.
  if ((decoded.expiresAt - now()) / 1000 < secondsInHour) {
    return false
  }

  if (decoded.appId !== appId) {
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
    throw new Error('Error decoding token header')
  }

  return {
    appId: body.appId,
    deviceId: body.deviceId,
    configId: body.configId,
    scopes: body.scope.split(' '),
    issuer: body.iss,
    audience: body.aud,
    expiresAt: body.exp,
  }
}
