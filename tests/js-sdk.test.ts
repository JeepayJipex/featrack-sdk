import { describe, expect, it } from 'vitest'
import { FeatrackError } from '../lib/core/featrack.errors'
import { FT } from '../lib/index'

describe('fT SDK', () => {
  it('should initialize usages and customers with valid token and appSlug', () => {
    const sdk = FT('validToken', 'validAppSlug')
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
    const sdk = FT('validToken', 'validAppSlug')
    sdk.customers.identify('uniqueCustomerId')
    // Assuming identify method has some observable effect to test
  })

  it('should create a customer and identify them', () => {
    const sdk = FT('validToken', 'validAppSlug')
    sdk.customers.create('uniqueCustomerId', { customerName: 'Test Customer' })
    // Assuming create method has some observable effect to test
  })

  it('should use default options if not provided', () => {
    const sdk = FT('validToken', 'validAppSlug')
    expect(sdk.usages).toBeDefined()
    expect(sdk.customers).toBeDefined()
  })

  it('should use provided options', () => {
    const sdk = FT('validToken', 'validAppSlug', { errorMode: 'throw', ftApiUrl: 'https://customapi.com/' })
    expect(sdk.usages).toBeDefined()
    expect(sdk.customers).toBeDefined()
  })
})
