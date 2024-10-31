import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FeatrackError } from '../lib/core/featrack.errors'
import * as helpers from '../lib/core/helpers'
import { Usages } from '../lib/core/usages'

/* eslint-disable dot-notation */

describe('usages', () => {
  let usages: Usages

  beforeEach(() => {
    usages = new Usages()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should initialize with default values', () => {
    expect(usages['baseUrl']).toBe('https://featrack.io/api/')
    expect(usages['axiosInstance']).toBeNull()
    expect(usages['token']).toBe('')
    expect(usages['appSlug']).toBe('')
    expect(usages['options']).toEqual({ errorMode: 'warn' })
    expect(usages['userUniqueId']).toBeNull()
  })

  it('should initialize with provided values', () => {
    usages.init('test-token', 'test-app', { errorMode: 'throw', ftApiUrl: 'https://custom.api/' })
    expect(usages['token']).toBe('test-token')
    expect(usages['appSlug']).toBe('test-app')
    expect(usages['options']).toEqual({ errorMode: 'throw', ftApiUrl: 'https://custom.api/' })
    expect(usages['baseUrl']).toBe('https://custom.api/')
  })

  it('should create axios instance on init', () => {
    usages.init('test-token', 'test-app')
    expect(usages['axiosInstance']).not.toBeNull()
    expect(usages['axiosInstance']?.defaults.baseURL).toBe('https://featrack.io/api/')
    expect(usages['axiosInstance']?.defaults.headers['Authorization']).toBe('Bearer test-token')
  })

  it('should identify user', () => {
    usages.identify('user-123')
    expect(usages['userUniqueId']).toBe('user-123')
  })

  it('should warn or throw if user is not identified on track', async () => {
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    await usages.track('feature-slug')
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError('user is not identified, cannot send usages'), 'warn')
  })

  it('should warn or throw if feature slug is not provided on track', async () => {
    usages.identify('user-123')
    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    await usages.track('')
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new FeatrackError('feature slug is required'), 'warn')
  })

  it('should send track request with correct body', async () => {
    usages.init('test-token', 'test-app')
    usages.identify('user-123')
    const postSpy = vi.spyOn(usages['axiosInstance']!, 'post').mockResolvedValue({})

    await usages.track('feature-slug', {
      date: '2023-01-01',
      customerName: 'John Doe',
      featureEmoji: '🚀',
      featureName: 'Feature Name',
      featureDescription: 'Feature Description',
    })

    expect(postSpy).toHaveBeenCalledWith('usages/consume', {
      customerUniqueId: 'user-123',
      featureSlug: 'feature-slug',
      applicationSlug: 'test-app',
      createdAt: '2023-01-01',
      customerName: 'John Doe',
      featureEmoji: '🚀',
      featureName: 'Feature Name',
      featureDescription: 'Feature Description',
    })
  })

  it('should handle errors during track request', async () => {
    usages.init('test-token', 'test-app')
    usages.identify('user-123')

    const warnOrThrowSpy = vi.spyOn(helpers, 'warnOrThrow')
    vi.spyOn(usages['axiosInstance']!, 'post').mockRejectedValue(new Error('Network Error'))

    await usages.track('feature-slug')
    expect(warnOrThrowSpy).toHaveBeenCalledWith(new Error('Network Error'), 'warn')
  })
})
