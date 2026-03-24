import { useState, useEffect, useRef } from "react"

/**
 * Custom hook for data fetching with abort controller cleanup.
 * Prevents state updates on unmounted components and supports
 * cancellation when component re-renders or unmounts.
 *
 * Usage:
 *   const { data, loading } = usePageData(
 *     () => Promise.all([getPageContent("home"), getTestimonials()]),
 *     []
 *   )
 */
export function usePageData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const result = await fetcher(controller.signal)
        if (mountedRef.current) {
          setData(result)
        }
      } catch (err) {
        if (mountedRef.current && !(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to load data:", err)
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mountedRef.current = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
