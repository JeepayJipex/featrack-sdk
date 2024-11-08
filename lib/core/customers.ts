import type { AxiosResponse } from 'axios'
import type { CustomersTypes, FTOptions } from './types'
import { BaseApi } from './api'
import { FeatrackError } from './featrack.errors'
import { warnOrThrow } from './helpers'

interface CustomersOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}

export class Customers extends BaseApi<CustomersOptions> {
  protected endpoints = {
    create: 'customers/create',
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
