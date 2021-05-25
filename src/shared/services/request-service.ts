import { ConfigurationResponse, MovieDetailsResponse, NowPlayingResponse } from '@/shared/model/model-results'
import { APIToken } from '@/shared/model/model-common'
import { MovieDetailsRequest } from '@/shared/model/model-requests'

export class ApiRequestService {
  public async getConfig(params: APIToken): Promise<ConfigurationResponse> {
    const configUrl = `https://api.themoviedb.org/3/configuration?api_key=${params.apiKey}`
    const response: Response = await fetch(configUrl)
    if (response) {
      const data: Promise<ConfigurationResponse> = response.json()
      console.log('copnfig data', data)
      return data
    } else {
      throw new Error()
    }
  }

  public async getMoviesNow(params: APIToken): Promise<NowPlayingResponse> {
    const fetchUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${params.apiKey}&language=en-US&page=1`
    const response: Response = await fetch(fetchUrl)
    if (response) {
      const data: Promise<NowPlayingResponse> = response.json()
      console.log('NowPlaying data', data)
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
