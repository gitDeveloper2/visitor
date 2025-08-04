import {  useState } from "react"
import { getRepoStarRecords } from "../service/api"

export function useStarHistory() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<{ date: string; count: number }[]>([])
    const [error, setError] = useState<Error | null>(null)

    const fetchHistory = async (repo: string, token: string, maxRequests = 15) => {
        setLoading(true)
        setError(null)
        let result: { date: string; count: number; }[] | null = null;
        try {
            result = await getRepoStarRecords(repo, token, maxRequests)
         
            
            setData(result)
        } catch (err) {
            setError(err as Error)
        } finally {
            setLoading(false)
        }
        return result;
    }

    return { loading, data, error, fetchHistory }
}
