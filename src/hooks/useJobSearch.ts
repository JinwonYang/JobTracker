import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase.ts'
import type { JobPost, JobSearchFilters, JobSearchResponse } from '../types/jobPost.ts'

export function useJobSearch() {
  const [results, setResults] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const searchJobs = useCallback(async (filters: JobSearchFilters) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)

    const { data, error: invokeError } = await supabase.functions.invoke<JobSearchResponse>(
      'search-jobs',
      {
        body: filters,
      },
    )

    if (invokeError) {
      setResults([])
      setTotalCount(0)
      setError(invokeError.message)
      setLoading(false)
      return
    }

    setResults(data?.results ?? [])
    setTotalCount(data?.totalCount ?? 0)
    setLoading(false)
  }, [])

  return {
    results,
    loading,
    error,
    hasSearched,
    totalCount,
    searchJobs,
  }
}
