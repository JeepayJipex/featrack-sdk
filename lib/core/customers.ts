import type { AxiosInstance, AxiosResponse } from 'axios'
import type { CustomersTypes, FTOptions } from './types'
import axios from 'axios'
import { FeatrackError } from './featrack.errors'
import { warnOrThrow } from './helpers'

interface CustomersOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}

export class Customers {
  private baseUrl = 'https://featrack.io/api/'
  private axiosInstance: AxiosInstance | null = null

  private endpoints = {
    create: 'customers/create',
  }

  private token: string = ''

  private applicationSlug = ''

  private options: CustomersOptions = { errorMode: 'warn' }

  constructor() {
  }

  init(
    token: string,
    appSlug: string,
    options: CustomersOptions = { errorMode: 'warn' }
  ) {
    this.token = token
    this.applicationSlug = appSlug
    this.options = { ...this.options, ...options }
    if (options.ftApiUrl) {
      this.baseUrl = options.ftApiUrl.endsWith('/') ? options.ftApiUrl : `${options.ftApiUrl}/`
    }
    this.createAxiosInstance()
  }

  async create(
    uniqueId: string,
    params?: {
      customerName?: string
    }
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

    const response = await this.axiosInstance.post<CustomersTypes['create']['output'], AxiosResponse<CustomersTypes['create']['output']>, CustomersTypes['create']['input']>(this.endpoints.create, {
      applicationSlug: this.applicationSlug,
      uniqueId,
      ...params,
    })

    return response.data
  }

  private createAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${this.token}`,
      },
    })
  }
}
