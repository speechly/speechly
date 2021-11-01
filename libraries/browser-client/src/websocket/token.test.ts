import { Token, decodeToken, validateToken, fetchToken, minTokenValidTime } from './token'

describe('token', () => {
  describe('.fetchToken', () => {
    test('returns the token succesfully', async () => {
      const f = mockFetch(200, { access_token: testTokenString })
      await expect(
        fetchToken('base-url', testToken.projectId, testToken.appId, testToken.deviceId, f, beforeExpiry(testToken)),
      ).resolves.toBe(testTokenString)
    })

    test('throws if API call fails', async () => {
      const err = Error('api-error')
      const f = jest.fn().mockRejectedValue(err)

      await expect(
        fetchToken('base-url', testToken.projectId, testToken.appId, testToken.deviceId, f, beforeExpiry(testToken)),
      ).rejects.toThrow(err)
    })

    test('throws if API returns non-OK status', async () => {
      const f = mockFetch(400, { access_token: testTokenString })

      await expect(
        fetchToken('base-url', testToken.projectId, testToken.appId, testToken.deviceId, f, beforeExpiry(testToken)),
      ).rejects.toThrow()
    })

    test('throws if body cannot be read', async () => {
      const err = Error('body-error')
      const f = mockFailFetch(500, err)

      await expect(
        fetchToken('base-url', testToken.projectId, testToken.appId, testToken.deviceId, f, beforeExpiry(testToken)),
      ).rejects.toThrow(err)
    })

    test('throws if token is not in response', async () => {
      const f = mockFetch(200, {})

      await expect(
        fetchToken('base-url', testToken.projectId, testToken.appId, testToken.deviceId, f, beforeExpiry(testToken)),
      ).rejects.toThrow()
    })

    test('throws if token is invalid', async () => {
      const f = mockFetch(200, { access_token: 'some-invalid-token' })

      await expect(
        fetchToken('base-url', testToken.projectId, testToken.appId, testToken.deviceId, f, beforeExpiry(testToken)),
      ).rejects.toThrow()
    })
  })

  describe('.validateToken', () => {
    test('returns true for correct token', () => {
      expect(
        validateToken(
          testTokenString,
          testToken.projectId,
          testToken.appId,
          testToken.deviceId,
          beforeExpiry(testToken),
        ),
      ).toBeTruthy()
    })

    test('returns false when projectId and appId does not match', () => {
      expect(
        validateToken(
          testTokenString,
          'other-app-id',
          testToken.projectId,
          testToken.deviceId,
          beforeExpiry(testToken),
        ),
      ).toBeFalsy()
    })

    test('returns false when deviceId does not match', () => {
      expect(
        validateToken(
          testTokenString,
          testToken.projectId,
          testToken.appId,
          'other-device-id',
          beforeExpiry(testToken),
        ),
      ).toBeFalsy()
    })

    test('returns false when token is expired', () => {
      expect(
        validateToken(
          testTokenString,
          testToken.projectId,
          testToken.appId,
          testToken.deviceId,
          afterExpiry(testToken),
        ),
      ).toBeFalsy()
    })
  })

  describe('.decodeToken', () => {
    test('decodes test token correctly', () => {
      expect(decodeToken(testTokenString)).toMatchObject(testToken)
    })

    test('throws when token is invalid', () => {
      expect(() => {
        decodeToken('123456')
      }).toThrow()
    })

    test('throws when token is not base64 encoded', () => {
      expect(() => {
        decodeToken('123456.$$$$$$$@@@@@@@.123456')
      }).toThrow()
    })

    test('throws when token is not serialised JSON', () => {
      expect(() => {
        decodeToken('123456.123456.123456')
      }).toThrow()
    })
  })
})

const testTokenString =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInByb2plY3RJZCI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMSIsImRldmljZUlkIjoiMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExIiwic2NvcGUiOiJzbHUiLCJleHAiOjE1OTkzMTM2NTYsImNvbmZpZ0lkIjoiMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExIiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3BlZWNobHkuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLnNwZWVjaGx5LmNvbS8ifQ.QqqxerSCgGAReMwS2losF276sJ6vnoPhXn-bbrKgoMU'

const testToken: Token = {
  appId: '00000000-0000-0000-0000-000000000000',
  projectId: '11111111-1111-1111-1111-111111111111',
  deviceId: '11111111-1111-1111-1111-111111111111',
  configId: '11111111-1111-1111-1111-111111111111',
  scopes: ['slu'],
  issuer: 'https://api.speechly.com/',
  audience: 'https://api.speechly.com/',
  expiresAtMs: 1599313656000,
}

function mockFetch(status: number, data: any): jest.Mock {
  const response = { status, json: async () => Promise.resolve(data) }

  return jest.fn().mockResolvedValue(response)
}

function mockFailFetch(status: number, err: Error): jest.Mock {
  const response = { status, json: async () => Promise.reject(err) }

  return jest.fn().mockResolvedValue(response)
}

function beforeExpiry(t: Token): jest.Mock {
  return jest.fn().mockReturnValue(t.expiresAtMs - minTokenValidTime)
}

function afterExpiry(t: Token): jest.Mock {
  return jest.fn().mockReturnValue(t.expiresAtMs)
}
