import type { AxiosInstance } from 'axios'
import type { FTOptions } from './types'
import axios from 'axios'
import { FeatrackError } from './featrack.errors'
import { stripUndefinedValues, warnOrThrow } from './helpers'

export interface UsagesOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}
export class Usages {
  private baseUrl = 'https://featrack.io/api/'
  private axiosInstance: AxiosInstance | null = null

  private endpoints = {
    track: 'usages/consume',
  }

  private token: string = ''
  private appSlug: string = ''
  private options: UsagesOptions = { errorMode: 'warn' }

  private userUniqueId: string | null = null

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
    catch (err) {
      console.error(err)
    }
  }

  identify(userUniqueId: string) {
    this.userUniqueId = userUniqueId
  }

  private createAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        authorization: `Bearer ${this.token}`
      },
    })
  }
}
