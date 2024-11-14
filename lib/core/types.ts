export interface FTOptions {
  errorMode?: 'warn' | 'throw'
  ftApiUrl?: string
}

export interface CustomersTypes {
  create: {
    input: {
      applicationSlug: string
      name?: string
      uniqueId: string
    }
    output: {
      id: string
      name: string | null
      uniqueId: string
      createdAt: string
      updatedAt: string
    }
  }
}

export interface IdentifyInput {
  sessionId: string
  applicationSlug: string
  customerUniqueId: string
}

export interface IdentifyOutput {
  success: boolean
}
export interface StartInput {
  applicationSlug: string
  customerUniqueId?: string
  screen?: 'mobile' | 'desktop' | 'tablet' | 'other'
  timezone?: string
}

export interface StartOutput {
  sessionId: string
}

export interface SetTimeSpentInput {
  sessionId: string
  timeSpentMs: number
}

export interface SetTimeSpentOutput {
  success: boolean
}

export interface EndInput {
  sessionId: string
  timeSpentMs: number
}

export interface EndOutput {
  success: boolean
}

export interface SessionsOptions extends FTOptions {
  errorMode: 'warn' | 'throw'
}
