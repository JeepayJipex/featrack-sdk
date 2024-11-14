import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Api } from '../lib/core/api'
import { FeatrackError } from '../lib/core/featrack.errors'
import { FT } from '../lib/index'

let sdk: ReturnType<typeof FT>

describe('fT SDK', () => {
  beforeEach(() => {
  })

  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should initialize usages and customers with valid token and appSlug', () => {
    sdk = FT('validToken', 'validAppSlug')
    expect(sdk.usages).toBeDefined()
    expect(sdk.customers).toBeDefined()
  })

  it('should throw an error if token is missing', () => {
    expect(() => FT('', 'validAppSlug', {
      errorMode: 'throw',
    })).toThrow(FeatrackError)
  })

  it('should throw an error if appSlug is missing', () => {
    expect(() => FT('validToken', '', {
      errorMode: 'throw',
    })).toThrow(FeatrackError)
  })

  it('should identify a customer', () => {
    sdk = FT('validToken', 'validAppSlug')
    sdk.customers.identify('uniqueCustomerId')
    // Assuming identify method has some observable effect to test
  })

  it('should create a customer and identify them', () => {
    sdk = FT('validToken', 'validAppSlug')
    sdk.customers.create('uniqueCustomerId', { customerName: 'Test Customer' })
    // Assuming create method has some observable effect to test
  })

  it('should use default options if not provided', () => {
    sdk = FT('validToken', 'validAppSlug')
    expect(sdk.usages).toBeDefined()
    expect(sdk.customers).toBeDefined()
  })

  it('should use provided options', () => {
    sdk = FT('validToken', 'validAppSlug', { errorMode: 'throw', ftApiUrl: 'https://customapi.com/' })
    expect(sdk.usages).toBeDefined()
    expect(sdk.customers).toBeDefined()
  })

  it('should throw an error if session is not started when setting time spent', async () => {
    const sdk = FT('validToken', 'validAppSlug', { errorMode: 'throw' })
    await expect(sdk.sessions.setTimeSpent({ timeSpentMs: 1000 })).rejects.toThrow(FeatrackError)
  })

  it('should throw an error if session is not started when ending session', async () => {
    sdk = FT('validToken', 'validAppSlug', { errorMode: 'throw' })
    await expect(sdk.sessions.end({ timeSpentMs: 1000 })).rejects.toThrow(FeatrackError)
  })

  it('should throw an error if user is not identified when tracking usage', async () => {
    sdk = FT('validToken', 'validAppSlug', { errorMode: 'throw' })
    await expect(sdk.usages.track('featureSlug')).rejects.toThrow(FeatrackError)
  })
})
