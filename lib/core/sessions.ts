import type { AxiosResponse } from 'axios'
import type { FTOptions } from './types'
import { BaseApi } from './api'
import { FeatrackError } from './featrack.errors'
import { warnOrThrow } from './helpers'

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
  }

  async start(params: Omit<StartInput, 'applicationSlug'>): Promise<StartOutput | void> {
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

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async setTimeSpent(params: SetTimeSpentInput): Promise<SetTimeSpentOutput | void> {
    if (!params.sessionId) {
      warnOrThrow(new FeatrackError('session ID is required'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      const response = await this.axiosInstance?.post<SetTimeSpentOutput, AxiosResponse<SetTimeSpentOutput>, SetTimeSpentInput>(
        this.endpoints.setTimeSpent,
        params,
      )

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }

  async end(params: EndInput): Promise<EndOutput | void> {
    if (!params.sessionId) {
      warnOrThrow(new FeatrackError('session ID is required'), this.options.errorMode)
      return
    }

    if (!this.axiosInstance) {
      warnOrThrow(new FeatrackError('Featrack SDK not initialized'), this.options.errorMode)
      return
    }

    try {
      const response = await this.axiosInstance?.post<EndOutput, AxiosResponse<EndOutput>, EndInput>(
        this.endpoints.end,
        params,
      )

      return response.data
    }
    catch (error: any) {
      warnOrThrow(error, this.options.errorMode)
    }
  }
}
