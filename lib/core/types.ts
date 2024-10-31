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
