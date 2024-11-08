import type { AxiosResponse } from 'axios'
import type { FTOptions } from './types'
import { BaseApi } from './api'
import { FeatrackError } from './featrack.errors'
import { warnOrThrow } from './helpers'

interface IdentifyInput {
  sessionId: string
  applicationSlug: string
  customerUniqueId: string
}

interface IdentifyOutput {
  success: boolean
}
interface StartInput {
  applicationSlug: string
  customerUniqueId?: string
}

interface StartOutput {
  sessionId: string
}

interface SetTimeSpentInput {
  sessionId: string
  timeSpentMs: number
}

interface SetTimeSpentOutput {
  success: boolean
}

interface EndInput {
  sessionId: string
  timeSpentMs: number
}

interface EndOutput {
  success: boolean
}

interface SessionsOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}

export class Sessions extends BaseApi<SessionsOptions> {
  protected endpoints = {
    start: 'sessions/start',
    setTimeSpent: 'sessions/set-time',
    end: 'sessions/end',
    identify: 'sessions/identify',
  }

  protected userUniqueId: string | null = null

  protected currentSessionId: string | null = null

  async start(params: Omit<StartInput, 'applicationSlug'>): Promise<StartOutput | void> {
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
      const response = await this.axiosInstance?.post<StartOutput, AxiosResponse<StartOutput>, StartInput>(
        this.endpoints.start,
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

  async setTimeSpent(params: Omit<SetTimeSpentInput, 'sessionId'>): Promise<SetTimeSpentOutput | void> {
    if (!this.currentSessionId) {
      warnOrThrow(new FeatrackError('Session is not started'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      const response = await this.axiosInstance?.post<SetTimeSpentOutput, AxiosResponse<SetTimeSpentOutput>, SetTimeSpentInput>(
        this.endpoints.setTimeSpent,
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

  async end(params: Omit<EndInput, 'sessionId'>): Promise<EndOutput | void> {
    if (!this.currentSessionId) {
      warnOrThrow(new FeatrackError('Session is not started'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      const response = await this.axiosInstance?.post<EndOutput, AxiosResponse<EndOutput>, EndInput>(
        this.endpoints.end,
        { ...params, sessionId: this.currentSessionId },
      )

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async identify(params: Omit<IdentifyInput, 'sessionId'>): Promise<IdentifyOutput | void> {
    if (!params.customerUniqueId) {
      warnOrThrow(new FeatrackError('customer unique ID is required'), this.options.errorMode)
      return
    }

    if (!this.currentSessionId) {
      await this.start({ customerUniqueId: params.customerUniqueId })
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
      const response = await this.axiosInstance?.post<IdentifyOutput, AxiosResponse<IdentifyOutput>, IdentifyInput>(
        this.endpoints.identify,
        {
          ...params,
          sessionId: this.currentSessionId,
          customerUniqueId: this.userUniqueId,
        },
      )

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }
}
