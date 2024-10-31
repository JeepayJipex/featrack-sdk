import type { AxiosInstance, AxiosResponse } from 'axios'
import type { CustomersTypes, FTOptions } from './types'
import { FeatrackError } from './featrack.errors'
import { buildAxiosInstance, warnOrThrow } from './helpers'

interface CustomersOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}

export class Customers {
  protected baseUrl = 'https://featrack.io/api/'
  protected axiosInstance: AxiosInstance | null = null

  protected endpoints = {
    create: 'customers/create',
  }

  protected token: string = ''

  protected applicationSlug = ''

  protected options: CustomersOptions = { errorMode: 'warn' }

  constructor() {
  }

  init(
    token: string,
    appSlug: string,
    options: CustomersOptions = { errorMode: 'warn' },
  ) {
    this.token = token
    this.applicationSlug = appSlug
    this.options = { ...this.options, ...options }
    if (options.ftApiUrl) {
      this.baseUrl = options.ftApiUrl.endsWith('/') ? options.ftApiUrl : `${options.ftApiUrl}/`
    }
    this.axiosInstance = buildAxiosInstance(this.token, this.baseUrl, this.options.errorMode)
  }

  async create(
    uniqueId: string,
    params?: {
      customerName?: string
    },
  ) {
    if (!uniqueId) {
      warnOrThrow(new FeatrackError('customer name is required'), this.options.errorMode)
      return
    }

    if (!this.applicationSlug) {
      warnOrThrow(new FeatrackError('application slug is required'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      const response = await this.axiosInstance?.post<CustomersTypes['create']['output'], AxiosResponse<CustomersTypes['create']['output']>, CustomersTypes['create']['input']>(this.endpoints.create, {
        applicationSlug: this.applicationSlug,
        uniqueId,
        ...params,
      })

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }
}
