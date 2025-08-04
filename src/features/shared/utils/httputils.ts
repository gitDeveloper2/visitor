// utils/axiosWithRetry.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export async function axiosWithRetry<T = any>(
  config: AxiosRequestConfig,
  maxRetries = 1
): Promise<AxiosResponse<T>> {
  let attempts = 0
  while (true) {
    try {
      const response = await axios(config)

      // Don't retry for 401 or 403
      if ([401, 403].includes(response.status)) return response

      return response
    } catch (error: any) {
      const status = error.response?.status

      // If unauthorized or forbidden, do not retry
      if ([401, 403].includes(status)) throw error

      // If it's a client error (4xx other than 401/403), don't retry
      if (status >= 400 && status < 500) throw error

      // Retry only on network/server errors
      if (++attempts >= maxRetries) throw error
    }
  }
}
