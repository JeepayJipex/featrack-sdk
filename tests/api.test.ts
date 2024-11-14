import type { Mock } from 'vitest'
import { AxiosInstance } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Api } from '../lib/core/api'
import { buildAxiosInstance } from '../lib/core/helpers'

/* eslint-disable dot-notation */

describe('api', () => {
  let api: Api<any>

  beforeEach(() => {
    api = Api.getInstance()
  })

  it('should be a singleton', () => {
    const api1 = Api.getInstance()
    const api2 = Api.getInstance()
    expect(api1).toBe(api2)
  })

  it('should initialize with default options', () => {
    api.init('token', 'appSlug')
    expect(api['token']).toBe('token')
    expect(api['applicationSlug']).toBe('appSlug')
    expect(api['options'].errorMode).toBe('warn')
    expect(api['axiosInstance']).toBeDefined()
  })

  it('should initialize with custom options', () => {
    api.init('token', 'appSlug', { errorMode: 'throw', ftApiUrl: 'https://customapi.com/' })
    expect(api['token']).toBe('token')
    expect(api['applicationSlug']).toBe('appSlug')
    expect(api['options'].errorMode).toBe('throw')
    expect(api['baseUrl']).toBe('https://customapi.com/')
    expect(api['axiosInstance']).toBeDefined()
  })
  it('should create a customer', async () => {
    api.init('token', 'appSlug')
    const postSpy = vi.spyOn(api['axiosInstance']!, 'post').mockResolvedValue({ data: {} })
    await api.customersCreate('uniqueId', { customerName: 'Test Customer' })
    expect(postSpy).toHaveBeenCalledWith('customers/create', { uniqueId: 'uniqueId', customerName: 'Test Customer' })
  })

  it('should start a session', async () => {
    api.init('token', 'appSlug')
    vi.spyOn(api['axiosInstance']!, 'post').mockResolvedValue({ data: { sessionId: 'sessionId' } })
    const response = await api.sessionsStart({ customerUniqueId: 'uniqueCustomerId' })
    expect(response?.sessionId).toBe('sessionId')
    expect(api['currentSessionId']).toBe('sessionId')
  })
  it('should set time spent', async () => {
    api.init('token', 'appSlug')
    api.setSessionId('sessionId')
    const postSpy = vi.spyOn(api['axiosInstance']!, 'post').mockResolvedValue({ data: {} })
    await api.sessionsSetTimeSpent({ timeSpentMs: 1000 })
    expect(postSpy).toHaveBeenCalledWith('sessions/set-time', { timeSpentMs: 1000, sessionId: 'sessionId' })
  })

  it('should end a session', async () => {
    api.init('token', 'appSlug')
    api.setSessionId('sessionId')
    const postSpy = vi.spyOn(api['axiosInstance']!, 'post').mockResolvedValue({ data: { success: true } })
    const response = await api.sessionsEnd({ timeSpentMs: 1000 })
    expect(response?.success).toBe(true)
    expect(postSpy).toHaveBeenCalledWith('sessions/end', { timeSpentMs: 1000, sessionId: 'sessionId' })
  })

  it('should identify a session', async () => {
    api.init('token', 'appSlug')
    api.setSessionId('sessionId')
    const postSpy = vi.spyOn(api['axiosInstance']!, 'post').mockResolvedValue({ data: { success: true } })
    await api.sessionsIdentify({ customerUniqueId: 'uniqueCustomerId' })
    expect(postSpy).toHaveBeenCalledWith('sessions/identify', {
      customerUniqueId: 'uniqueCustomerId',
      sessionId: 'sessionId',
      applicationSlug: 'appSlug',
    })
  })

  it('should track usage', async () => {
    api.init('token', 'appSlug')
    api.setCustomerId('customerId')
    const postSpy = vi.spyOn(api['axiosInstance']!, 'post').mockResolvedValue({ data: {} })
    await api.usagesTrack('featureSlug', { featureName: 'Feature Name' })
    expect(postSpy).toHaveBeenCalledWith('usages/consume', expect.objectContaining({
      customerUniqueId: 'customerId',
      featureSlug: 'featureSlug',
      applicationSlug: 'appSlug',
      featureName: 'Feature Name',
    }))
  })
})
