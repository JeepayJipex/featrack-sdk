import type { AxiosInstance } from 'axios'
import type { FTOptions } from './types'
import { buildAxiosInstance } from './helpers'

export interface APIOptions {
  errorMode: 'warn' | 'throw'
  ftApiUrl?: string
}

export class BaseApi<T extends FTOptions> {
  protected baseUrl = 'https://featrack.io/api/'
  protected axiosInstance: AxiosInstance | null = null

  protected endpoints: Record<string, string> = {
    create: 'customers/create',
  }

  protected token: string = ''

  protected applicationSlug = ''

  protected options: T = { errorMode: 'warn' } as T

  constructor() {
  }

  init(
    token: string,
    appSlug: string,
    options: T = { errorMode: 'warn' } as T,
  ) {
    this.token = token
    this.applicationSlug = appSlug
    this.options = { ...({ errorMode: 'warn' } as T), ...options }
    if (options.ftApiUrl) {
      this.baseUrl = options.ftApiUrl.endsWith('/') ? options.ftApiUrl : `${options.ftApiUrl}/`
    }
    this.axiosInstance = buildAxiosInstance(this.token, this.baseUrl, this.options.errorMode)
  }
}
