import { APIToken } from './shared/model/model-common'
import { ConfigurationResponse, MovieDetailsResponse, NowPlayingResponse } from './shared/model/model-results'
import { MovieDetailsRequest } from './shared/model/model-requests'
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

  public async getMoviesNow(params: APIToken): Promise<NowPlayingResponse> {
    return await this.apiService.getMoviesNow(params)
  }

  public async getMovieDetails(params: {
    apiKey: APIToken
    movieId: MovieDetailsRequest
  }): Promise<MovieDetailsResponse> {
    return await this.apiService.getMovieDetails(params)
  }

  // public async loadDOM(): Promise<void> {
  //   const DOMData = await this.getMoviesNow({ apiKey: '1d342f36ce9ad0f75afa27e2eb307f5805f100f2' })
  //   const appEntryPoint: HTMLElement = document.getElementById('app') as HTMLElement
  //   appEntryPoint.innerText = DOMData.id
  //   console.log(DOMData.id)
  // }
}
