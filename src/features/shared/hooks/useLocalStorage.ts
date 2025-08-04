// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") return defaultValue
        const stored = localStorage.getItem(key)
        return stored ? (JSON.parse(stored) as T) : defaultValue
    })

    useEffect(() => {
        if (value === undefined || value === null) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }, [key, value])

    const clear = useCallback(() => {
        setValue(defaultValue)
        localStorage.removeItem(key)
    }, [key, defaultValue])

    return [value, setValue, clear] as const
}
