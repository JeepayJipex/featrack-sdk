import type { FTOptions } from '../core/types'
import { Api } from '../core/api'
import { FeatrackError } from '../core/featrack.errors'
import { warnOrThrow } from '../core/helpers'

export function FT(token: string, appSlug: string, {
  errorMode = 'warn',
  ftApiUrl = 'https://featrack.io/api/',

}: FTOptions = {}) {
  function validateToken(token: string) {
    if (!token) {
      warnOrThrow(new FeatrackError('token is required'), errorMode)
    }
  }

  function validateAppSlug(appSlug: string) {
    if (!appSlug) {
      warnOrThrow(new FeatrackError('app slug is required'), errorMode)
    }
  }

  validateToken(token)
  validateAppSlug(appSlug)

  const api = Api.getInstance()

  api.init(token, appSlug, {
    ftApiUrl,
    errorMode,
  })

  return {
    usages: {
      track: api.usagesTrack.bind(api),
    },
    customers: {
      create: api.customersCreate.bind(api),
      identify: api.setCustomerId.bind(api),
    },
    sessions: {
      start: api.sessionsStart.bind(api),
      setTimeSpent: api.sessionsSetTimeSpent.bind(api),
      end: api.sessionsEnd.bind(api),
    },
    api,
  }
}
