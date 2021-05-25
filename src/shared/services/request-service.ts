import {
  ConfigurationResponse,
  GenreResponse,
  MovieDetailsResponse,
  NowPlayingResponse,
} from '@/shared/model/model-results'
import { APIToken } from '@/shared/model/model-common'
import { MovieDetailsRequest, MoviesNowRequest } from '@/shared/model/model-requests'

export class ApiRequestService {
  public async getConfig(params: APIToken): Promise<ConfigurationResponse> {
    const configUrl = `https://api.themoviedb.org/3/configuration?api_key=${params.apiKey}`
    const response: Response = await fetch(configUrl)
    if (response) {
      const data: Promise<ConfigurationResponse> = response.json()
      return data
    } else {
      throw new Error()
    }
  }

  public async getGenres(params: APIToken): Promise<GenreResponse> {
    const configUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${params.apiKey}&language=en-US`
    const response: Response = await fetch(configUrl)
    if (response) {
      const data: Promise<GenreResponse> = response.json()
      return data
    } else {
      throw new Error()
    }
  }

  public async getMoviesNow(params: MoviesNowRequest): Promise<NowPlayingResponse> {
    const fetchUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${params.apiKey}&language=en-US&page=${params.pageNo}`
    const response: Response = await fetch(fetchUrl)
    if (response) {
      const data: Promise<NowPlayingResponse> = response.json()
      return data
    } else {
      throw new Error()
    }
  }

  public async getMovieDetails(params: {
    apiKey: APIToken
    movieId: MovieDetailsRequest
  }): Promise<MovieDetailsResponse> {
    const fetchUrl = `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${params.apiKey}&language=en-US&page=1`
    const response: Response = await fetch(fetchUrl)
    if (response) {
      const data: Promise<MovieDetailsResponse> = response.json()
      console.log('movie data for move ', data)
      return data
    } else {
      throw new Error()
    }
  }
}
