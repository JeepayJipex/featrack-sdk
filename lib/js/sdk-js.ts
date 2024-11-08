import type { FTOptions } from '../core/types'
import { Customers } from '../core/customers'
import { FeatrackError } from '../core/featrack.errors'
import { warnOrThrow } from '../core/helpers'
import { Sessions } from '../core/sessions'
import { Usages } from '../core/usages'

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

  const usages = new Usages()
  const customers = new Customers()
  const sessions = new Sessions()

  usages.init(token, appSlug, {
    ftApiUrl,
    errorMode,
  })

  customers.init(token, appSlug, {
    ftApiUrl,
    errorMode,
  })

  sessions.init(token, appSlug, {
    ftApiUrl,
    errorMode,
  })

  function identify(uniqueId: string) {
    usages.identify(uniqueId)
  }

  function createCustomer(uniqueId: string, params?: { customerName?: string }) {
    customers.create(uniqueId, params)
    usages.identify(uniqueId)
  }

  return {
    usages,
    customers: {
      create: createCustomer,
      identify,
    },
    sessions,
  }
}
