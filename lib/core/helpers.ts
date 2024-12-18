import type { FTOptions } from './types'
import axios from 'axios'

export function warnOrThrow(error: Error, errorMode: FTOptions['errorMode']) {
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
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null),
  )
}

export function buildAxiosInstance(token: string, baseURL: string, errorMode: FTOptions['errorMode']) {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  axiosInstance.interceptors.response.use(
    response => response,
    (error) => {
      warnOrThrow(new Error(error?.message || error.response?.data?.message), errorMode)
      return Promise.reject(error)
    },
  )

  return axiosInstance
}
