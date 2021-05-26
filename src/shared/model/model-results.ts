import { LatestMovie, Movie, Genre, PageInfo, AuthorDetails } from './model-common'
import { MovieDetails } from './model-common'
export interface ConfigurationResponse {
  images: {
    base_url: string
    secure_base_url: string
    backdrop_sizes: string[]
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
  change_keys: string[]
}
export interface LatestMovieDataResponse {
  data: LatestMovie
}
export interface NowPlayingResponse {
  page?: number
  results?: Movie[]
  dates?: {
    maximum?: Date
    minimum?: Date
  }
  total_pages?: number
  total_results?: number
}
export interface MovieDetailsResponse {
  data: MovieDetails
}
export interface GenreResponse {
  genres: Genre[]
}

export interface MovieDetailsVideosResponse {
  id?: number
  results?: {
    id?: string
    iso_639_1?: string
    iso_3166_1?: string
    key?: string
    name?: string
    site?: string
    size?: 360 | 480 | 720 | 1080
    type?: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers'
  }[]
}

export interface MovieDetailsReviewsResponse {
  id?: number
  page?: number
  results?: {
    author?: string
    author_details?: AuthorDetails
    content?: string
    created_at?: string
    id?: string
    updated_at?: string
    url?: string
    total_pages?: number
    total_results?: number
  }[]
}
export interface MovieDetailsSimilarResponse extends Movie, PageInfo {
  results: Movie[]
}

// export interface JSONPromisResponse {
//   data?: {}
//   errors?: Array<{ message: string }>
// }
