export function warnOrThrow(error: Error, errorMode: 'warn' | 'throw') {
  if (errorMode === 'throw') {
    throw error
  }
  else {
    console.warn(error)
  }
}

export function stripUndefinedValues(obj: Record<string, any>) {
  if (typeof obj !== 'object' || obj === null) {
    console.error('Invalid input: expected an object')
    return obj
  }

  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  )
}
