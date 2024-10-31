import type { AxiosInstance } from 'axios'
import type { FTOptions } from './types'
import axios from 'axios'
import { FeatrackError } from './featrack.errors'
import { stripUndefinedValues, warnOrThrow } from './helpers'

export interface UsagesOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}
export class Usages {
  protected baseUrl = 'https://featrack.io/api/'
  protected axiosInstance: AxiosInstance | null = null

  protected endpoints = {
    track: 'usages/consume',
  }

  protected token: string = ''
  protected appSlug: string = ''
  protected options: UsagesOptions = { errorMode: 'warn' }

  protected userUniqueId: string | null = null

  constructor() {
  }

  init(
    token: string,
    appSlug: string,
    options: UsagesOptions = { errorMode: 'warn' }
  ) {
    this.token = token
    this.appSlug = appSlug
    this.options = { ...this.options, ...options }
    if (options.ftApiUrl) {
      this.baseUrl = options.ftApiUrl.endsWith('/') ? options.ftApiUrl : `${options.ftApiUrl}/`
    }
    this.createAxiosInstance()
  }

  async track(
    slug: string,
    params?: {
      date?: string
      customerName?: string
      featureEmoji?: string
      featureName?: string
      featureDescription?: string
    }
  ) {
    if (!this.userUniqueId) {
      warnOrThrow(new FeatrackError('user is not identified, cannot send usages'), this.options.errorMode)
      return
    }

    if (!slug) {
      warnOrThrow(new FeatrackError('feature slug is required'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    const { date, customerName, featureEmoji, featureName, featureDescription } = params || {}

    const body = {
      customerUniqueId: this.userUniqueId,
      featureSlug: slug,
      applicationSlug: this.appSlug,
      createdAt: date || new Date().toISOString(),
      customerName,
      featureEmoji,
      featureName,
      featureDescription
    }

    try {
      await this.axiosInstance?.post(this.endpoints.track, stripUndefinedValues(body))
    }
    catch (err: any) {
      warnOrThrow(err, this.options.errorMode)
    }
  }

  identify(userUniqueId: string) {
    this.userUniqueId = userUniqueId
  }

  protected createAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        authorization: `Bearer ${this.token}`
      },
    })
  }
}
