import { LatestMovie, Movie } from './model-common'
import { MovieDetails } from './model-common';
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
  data : MovieDetails
}
// export interface JSONPromisResponse {
//   data?: {}
//   errors?: Array<{ message: string }>
// }
