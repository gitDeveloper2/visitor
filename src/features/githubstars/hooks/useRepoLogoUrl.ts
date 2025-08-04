import { useEffect, useState } from "react"
import { getRepoLogoUrl } from "../service/api"

export function useRepoLogoUrl(repo: string, token?: string) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!repo) return

    const fetchLogo = async () => {
      try {
        setLoading(true)
        const url = await getRepoLogoUrl(repo, token)
        setLogoUrl(url)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogo()
  }, [repo, token])

  return { logoUrl, loading, error }
}
