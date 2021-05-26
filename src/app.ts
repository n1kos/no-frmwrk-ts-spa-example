import { APIToken, MovieDetailsMoreCollection } from './shared/model/model-common'
import {
  ConfigurationResponse,
  GenreResponse,
  MovieDetailsResponse,
  MoviesSearchResponse,
  NowPlayingResponse,
} from './shared/model/model-results'
import { MoviesMoreRequest, MoviesNowRequest, MoviesSearchRequest } from './shared/model/model-requests'
import { ApiRequestService as ApiService } from './shared/services/request-service'

export class App {
  private apiService = new ApiService()

  /**
   *
   * @param params the provided user API token
   * @returns the configuration of the site
   */
  public async getConfig(params: APIToken): Promise<ConfigurationResponse> {
    return await this.apiService.getConfig(params)
  }
  public async getGenres(params: APIToken): Promise<GenreResponse> {
    return await this.apiService.getGenres(params)
  }

  public async getMoviesNow(params: MoviesNowRequest): Promise<NowPlayingResponse> {
    return await this.apiService.getMoviesNow(params)
  }

  public async getMoviesSearch(params: MoviesSearchRequest): Promise<MoviesSearchResponse> {
    return await this.apiService.getMoviesSearch(params)
  }

  public async getMovieDetails(params: MoviesMoreRequest): Promise<MovieDetailsResponse> {
    return await this.apiService.getMovieDetails(params)
  }

  public async getMovieMore(params: MoviesMoreRequest): Promise<MovieDetailsMoreCollection> {
    const [_reviews, _similar, _videos] = await Promise.all([
      this.apiService.getMovieDetailsReviews(params),
      this.apiService.getMovieDetailsSimilar(params),
      this.apiService.getMovieDetailsVideos(params),
    ])
    return {
      reviews: _reviews,
      similar: _similar,
      videos: _videos,
    }
  }
  // public async loadDOM(): Promise<void> {
  //   const DOMData = await this.getMoviesNow({ apiKey: '1d342f36ce9ad0f75afa27e2eb307f5805f100f2' })
  //   const appEntryPoint: HTMLElement = document.getElementById('app') as HTMLElement
  //   appEntryPoint.innerText = DOMData.id
  //   console.log(DOMData.id)
  // }
}
