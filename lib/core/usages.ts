import type { FTOptions } from './types'
import { BaseApi } from './api'
import { FeatrackError } from './featrack.errors'
import { stripUndefinedValues, warnOrThrow } from './helpers'

export interface UsagesOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}
export class Usages extends BaseApi<UsagesOptions> {
  protected endpoints = {
    track: 'usages/consume',
  }

  protected userUniqueId: string | null = null
  protected sessionId: string | null = null

  async track(
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
      ...(this.sessionId ? { sessionId: this.sessionId } : {}),
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

  setSessionId(sessionId: string) {
    this.sessionId = sessionId
  }
}
