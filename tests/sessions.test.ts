import { AxiosError } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FeatrackError } from '../lib/core/featrack.errors'
import { warnOrThrow } from '../lib/core/helpers'
import * as helpers from '../lib/core/helpers'
import { Sessions } from '../lib/core/sessions'

/* eslint-disable dot-notation */
describe('sessions', () => {
  let sessions: Sessions
  const token = 'test-token'
  const appSlug = 'test-app'
  const sessionId = 'test-session-id'
  const timeSpentMs = 1000

  beforeEach(() => {
    sessions = new Sessions()
    sessions.init(token, appSlug)
  })

  it('should initialize with correct values', () => {
    expect(sessions['token']).toBe(token)
    expect(sessions['applicationSlug']).toBe(appSlug)
    expect(sessions['axiosInstance']).not.toBeNull()
  })

  it('should set baseUrl correctly if ftApiUrl is provided', () => {
    const customUrl = 'https://custom-api.com/'
    sessions.init(token, appSlug, { errorMode: 'warn', ftApiUrl: customUrl })
    expect(sessions['baseUrl']).toBe(customUrl)
  })

  it('should throw error if applicationSlug is not set on start', async () => {
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    sessions['applicationSlug'] = ''
    await sessions.start({ customerUniqueId: 'customer-123' })
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError('application slug is required'), 'warn')
  })

  it('should throw error if axiosInstance is not initialized on start', async () => {
    sessions['axiosInstance'] = null
    await sessions.start({ customerUniqueId: 'customer-123' })
    expect(warnOrThrow).toHaveBeenCalledWith(new FeatrackError('Featrack SDK not initialized'), 'warn')
  })

  it('should make a POST request to start session', async () => {
    const postMock = vi.spyOn(sessions['axiosInstance']!, 'post').mockResolvedValue({ data: { sessionId } })
    const response = await sessions.start({ customerUniqueId: 'customer-123' })
    expect(postMock).toHaveBeenCalledWith('sessions/start', {
      applicationSlug: appSlug,
      customerUniqueId: 'customer-123',
    })
    expect(response).toEqual({ sessionId })
  })

  it('should handle axios response error correctly on start', async () => {
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    const errorMessage = 'Request failed'
    vi.spyOn(sessions['axiosInstance']!, 'post').mockRejectedValue(new AxiosError(errorMessage))
    await sessions.start({ customerUniqueId: 'customer-123' })
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError(errorMessage), 'warn')
  })

  it('should throw error if sessionId is not provided on setTimeSpent', async () => {
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    await sessions.setTimeSpent({ sessionId: '', timeSpentMs })
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError('session ID is required'), 'warn')
  })

  it('should make a POST request to set time spent', async () => {
    const postMock = vi.spyOn(sessions['axiosInstance']!, 'post').mockResolvedValue({ data: { success: true } })
    const response = await sessions.setTimeSpent({ sessionId, timeSpentMs })
    expect(postMock).toHaveBeenCalledWith('sessions/set-time', { sessionId, timeSpentMs })
    expect(response).toEqual({ success: true })
  })

  it('should handle axios response error correctly on setTimeSpent', async () => {
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    const errorMessage = 'Request failed'
    vi.spyOn(sessions['axiosInstance']!, 'post').mockRejectedValue(new AxiosError(errorMessage))
    await sessions.setTimeSpent({ sessionId, timeSpentMs })
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError(errorMessage), 'warn')
  })

  it('should throw error if sessionId is not provided on end', async () => {
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    await sessions.end({ sessionId: '', timeSpentMs })
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError('session ID is required'), 'warn')
  })

  it('should make a POST request to end session', async () => {
    const postMock = vi.spyOn(sessions['axiosInstance']!, 'post').mockResolvedValue({ data: { success: true } })
    const response = await sessions.end({ sessionId, timeSpentMs })
    expect(postMock).toHaveBeenCalledWith('sessions/end', { sessionId, timeSpentMs })
    expect(response).toEqual({ success: true })
  })

  it('should handle axios response error correctly on end', async () => {
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    const errorMessage = 'Request failed'
    vi.spyOn(sessions['axiosInstance']!, 'post').mockRejectedValue(new AxiosError(errorMessage))
    await sessions.end({ sessionId, timeSpentMs })
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError(errorMessage), 'warn')
  })
})