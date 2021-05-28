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
  private myApiToken: APIToken
  private moviesNowCurentRequest: MoviesNowRequest
  private moviesSearchRequest: MoviesSearchRequest
  private movieMoreDetails: MoviesMoreRequest

  constructor(theApitoken: APIToken) {
    this.myApiToken = theApitoken
    this.moviesNowCurentRequest = {
      apiKey: this.myApiToken.apiKey,
      pageNo: 1,
    }
    this.moviesSearchRequest = {
      apiKey: this.myApiToken.apiKey,
      pageNo: 1,
      query: '',
    }
    this.movieMoreDetails = {
      apiKey: this.myApiToken.apiKey,
      movieId: '',
    }
  }

  public get anApiToken(): APIToken {
    return this.myApiToken
  }

  public get moviesNowCurent(): MoviesNowRequest {
    return this.moviesNowCurentRequest
  }

  public get moviesSearch(): MoviesSearchRequest {
    return this.moviesSearchRequest
  }

  public get moviesMoreDetails(): MoviesMoreRequest {
    return this.movieMoreDetails
  }

  // public set moviesMoreDetails(_theId) {
  //   this.movieMoreDetails.movieId = _theId.movieId
  // }
  public setmovieMoreDetails(_id: string = '') {
    this.movieMoreDetails.movieId = _id
  }
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
