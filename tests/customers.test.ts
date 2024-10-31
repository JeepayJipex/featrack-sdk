import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Customers } from '../lib/core/customers'
import { FeatrackError } from '../lib/core/featrack.errors'
import { warnOrThrow } from '../lib/core/helpers'
import * as helpers from '../lib/core/helpers'
import { AxiosError } from 'axios'

describe('Customers', () => {
    let customers: Customers
    const token = 'test-token'
    const appSlug = 'test-app'
    const uniqueId = 'test-unique-id'
    const customerName = 'test-customer'

    beforeEach(() => {
        customers = new Customers()
        customers.init(token, appSlug)
    })

    it('should initialize with correct values', () => {
        expect(customers['token']).toBe(token)
        expect(customers['applicationSlug']).toBe(appSlug)
        expect(customers['axiosInstance']).not.toBeNull()
    })

    it('should set baseUrl correctly if ftApiUrl is provided', () => {
        const customUrl = 'https://custom-api.com/'
        customers.init(token, appSlug, { errorMode: 'warn', ftApiUrl: customUrl })
        expect(customers['baseUrl']).toBe(customUrl)
    })

    it('should throw error if uniqueId is not provided', async () => {
        const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')

        await customers.create('')
        expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError('customer name is required'), 'warn')
    })

    it('should throw error if applicationSlug is not set', async () => {
        const warnOrThrowSpy  = vi.spyOn(helpers, 'warnOrThrow')
        customers['applicationSlug'] = ''
        await customers.create(uniqueId)
        expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError('application slug is required'), 'warn')
    })

    it('should throw error if axiosInstance is not initialized', async () => {
        customers['axiosInstance'] = null
        await customers.create(uniqueId)
        expect(warnOrThrow).toHaveBeenCalledWith(new FeatrackError('Featrack SDK not initialized'), 'warn')
    })

    it('should make a POST request to create customer', async () => {
        const postMock = vi.spyOn(customers['axiosInstance']!, 'post').mockResolvedValue({ data: { success: true } })
        const response = await customers.create(uniqueId, { customerName })
        expect(postMock).toHaveBeenCalledWith('customers/create', {
            applicationSlug: appSlug,
            uniqueId,
            customerName,
        })
        expect(response).toEqual({ success: true })
    })

    it('should handle axios response error correctly', async () => {
        const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
        const errorMessage = 'Request failed'
        vi.spyOn(customers['axiosInstance']!, 'post').mockRejectedValue(new AxiosError(errorMessage))
        await customers.create(uniqueId, { customerName })
        expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError(errorMessage), 'warn')
    })
})
