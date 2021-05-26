import { APIToken } from './model-common'

export type MovieData = {
  id: string
  name: string
}
export interface MovieDetailsRequest {
  movieId: number
}
export interface MoviesNowRequest extends APIToken {
  pageNo: number
}
export interface MoviesMoreRequest extends APIToken {
  movieId: string
}
export interface MoviesSearchRequest extends MoviesNowRequest {
  query: string
}