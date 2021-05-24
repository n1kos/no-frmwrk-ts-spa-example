export interface APIToken {
  apiKey: string
}
export interface UserToken {
  request_token: string
}

export interface Genre {
  id: number
  name: string
}

export interface LatestMovie {
  adult?: boolean
  backdrop_path?: string | null
  belongs_to_collection?: null
  budget?: number
  genres?: Genre[]
  homepage?: string
  id?: number
  imdb_id?: string
  original_language?: string
  original_title?: string
  overview?: string
  popularity?: number
  poster_path?: string | null
  production_companies?: object[]
  production_countries?: object[]
  release_date?: string
  revenue?: number
  runtime?: number
  spoken_languages?: object[]
  status?: string
  tagline?: string
  title?: string
  video?: boolean
  vote_average?: number
  vote_count?: number
}

export interface Movie {
  poster_path?: string | null
  adult?: boolean
  overview?: string
  release_date?: string
  genre_ids?: number[]
  id?: number
  original_title?: string
  original_language?: string
  title?: string
  backdrop_path?: string | null
  popularity?: number
  vote_count?: number
  video?: boolean
  vote_average?: number
}
