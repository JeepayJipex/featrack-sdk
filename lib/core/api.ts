import type { AxiosInstance, AxiosResponse } from 'axios'
import type { EndInput, EndOutput, FTOptions, IdentifyInput, IdentifyOutput, SetTimeSpentInput, SetTimeSpentOutput, StartInput, StartOutput } from './types'
import { FeatrackError } from './featrack.errors'
import { buildAxiosInstance, stripUndefinedValues, warnOrThrow } from './helpers'

export interface APIOptions {
  errorMode: 'warn' | 'throw'
  ftApiUrl?: string
}

export class Api<T extends FTOptions> {
  protected baseUrl = 'https://featrack.io/api/'
  protected axiosInstance: AxiosInstance | null = null

  protected endpoints = {
    customers: {
      create: 'customers/create',
    },
    sessions: {
      start: 'sessions/start',
      setTimeSpent: 'sessions/set-time',
      end: 'sessions/end',
      identify: 'sessions/identify',
    },
    usages: {
      track: 'usages/consume',
    },

  }

  protected token: string = ''

  protected applicationSlug = ''

  protected options: T = { errorMode: 'warn' } as T

  protected userUniqueId: string | null = null

  protected currentSessionId: string | null = null

  private static instance: Api<FTOptions>

  constructor() {
  }

  static getInstance() {
    if (this.instance) {
      return this.instance
    }
    this.instance = new Api()
    return this.instance
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

  async customersCreate(uniqueId: string, params?: { customerName?: string }) {
    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      return this.axiosInstance.post(this.endpoints.customers.create, {
        uniqueId,
        ...params,
      })
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async sessionsStart(params: Omit<StartInput, 'applicationSlug'>): Promise<StartOutput | void> {
    if (this.currentSessionId) {
      warnOrThrow(new FeatrackError('session already started'), this.options.errorMode)
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
      const response = await this.axiosInstance.post<StartOutput, AxiosResponse<StartOutput>, StartInput>(
        this.endpoints.sessions.start,
        {
          ...params,
          applicationSlug: this.applicationSlug,
        },
      )
      this.currentSessionId = response.data.sessionId
      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async sessionsSetTimeSpent(params: Omit<SetTimeSpentInput, 'sessionId'>): Promise<SetTimeSpentOutput | void> {
    if (!this.currentSessionId) {
      warnOrThrow(new FeatrackError('Session is not started'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      const response = await this.axiosInstance.post<SetTimeSpentOutput, AxiosResponse<SetTimeSpentOutput>, SetTimeSpentInput>(
        this.endpoints.sessions.setTimeSpent,
        {
          ...params,
          sessionId: this.currentSessionId,
        },
      )

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async sessionsEnd(params: Omit<EndInput, 'sessionId'>): Promise<EndOutput | void> {
    if (!this.currentSessionId) {
      warnOrThrow(new FeatrackError('Session is not started'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      const response = await this.axiosInstance.post<EndOutput, AxiosResponse<EndOutput>, EndInput>(
        this.endpoints.sessions.end,
        { ...params, sessionId: this.currentSessionId },
      )

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async sessionsIdentify(params: Omit<IdentifyInput, 'sessionId' | 'applicationSlug'>): Promise<IdentifyOutput | void> {
    if (!params.customerUniqueId) {
      warnOrThrow(new FeatrackError('customer unique ID is required'), this.options.errorMode)
      return
    }

    if (!this.currentSessionId) {
      await this.sessionsStart({ customerUniqueId: params.customerUniqueId })
    }

    if (!this.currentSessionId) {
      warnOrThrow(new FeatrackError('Session is not started'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    this.userUniqueId = params.customerUniqueId
    try {
      const response = await this.axiosInstance.post<IdentifyOutput, AxiosResponse<IdentifyOutput>, IdentifyInput>(
        this.endpoints.sessions.identify,
        {
          ...params,
          sessionId: this.currentSessionId,
          customerUniqueId: this.userUniqueId,
          applicationSlug: this.applicationSlug,
        },
      )

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async usagesTrack(
    slug: string,
    params?: {
      date?: string
      customerName?: string
      featureEmoji?: string
      featureName?: string
      featureDescription?: string
    },
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
      applicationSlug: this.applicationSlug,
      createdAt: date || new Date().toISOString(),
      customerName,
      featureEmoji,
      featureName,
      featureDescription,
      ...(this.currentSessionId ? { sessionId: this.currentSessionId } : {}),
    }

    try {
      console.log('body', body)
      await this.axiosInstance.post(this.endpoints.usages.track, stripUndefinedValues(body))
    }
    catch (err: any) {
      warnOrThrow(new FeatrackError(`Failed to track usages :${err.message}`), this.options.errorMode)
    }
  }

  setSessionId(sessionId: string) {
    this.currentSessionId = sessionId
  }

  setCustomerId(customerId: string) {
    this.userUniqueId = customerId
  }
}
