export interface JobSearchFilters {
  keyword: string
  location: string
  salary: string
  workType: string
}

export interface JobPost {
  id: string
  source: string
  externalId: string
  title: string
  company: string
  location: string
  salary: string
  workType: string
  workArrangement: string
  summary: string
  url: string
  postedAt: string | null
}

export interface JobSearchResponse {
  results: JobPost[]
  totalCount: number
  fetchedAt: string
}

export const EMPTY_JOB_SEARCH_FILTERS: JobSearchFilters = {
  keyword: '',
  location: '',
  salary: '',
  workType: '',
}
