import { MovieDetailsReviewsResponse, MovieDetailsSimilarResponse, MovieDetailsVideosResponse } from './model-results'
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

export interface Company {
  id: number
  logo_path: string
  name: string
}

export interface Country {
  iso_3166_1: string
  name: string
}

export interface Language {
  iso_639_1: string
  name: string
}

export type Status = 'Rumored' | 'Planned' | 'In Production' | 'Post' | 'Production' | 'Released' | 'Canceled'

export interface PageInfo {
  page?: number
  total_pages?: number
  total_results?: number
}

export interface AuthorDetails {
  name?: string
  username?: string
  avatar_path?: string | null
  rating?: number | null
}

export interface ReviewsDetails {
  author?: string
  author_details?: AuthorDetails
  content?: string
  created_at?: string
  id?: string
  updated_at?: string
  url?: string
  total_pages?: number
  total_results?: number
}
export interface Movie {
  poster_path?: string | null
  adult?: boolean
  overview?: string
  release_date?: Date
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
export interface LatestMovie extends Movie {
  belongs_to_collection?: null
  budget?: number
  genres?: Genre[]
  homepage?: string
  imdb_id?: string
  production_companies?: Company[]
  production_countries?: Country[]
  spoken_languages?: Language[]
  revenue?: number
  runtime?: number
  status?: string
  tagline?: string
}
export interface MovieDetails extends Movie {
  belongs_to_collection?: null | object
  budget?: number
  genres?: Genre[]
  homepage?: string | null
  imdb_id?: string | null
  production_companies?: Company[]
  production_countries?: Country[]
  spoken_languages?: Language[]
  origin_country?: string
  revenue?: number
  runtime?: number | null
  status?: Status
  tagline?: string | null
}
export interface MovieDetailsMoreCollection {
  reviews: MovieDetailsReviewsResponse
  similar: MovieDetailsSimilarResponse
  videos: MovieDetailsVideosResponse
}
