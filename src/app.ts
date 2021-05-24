import { APIToken, UserToken } from '@/shared/model/model-common'
import { AutheticateResponse } from '@/shared/model/model-results'
import { AutheticationService as authServ } from './shared/services/authenticate'
import { MovieData } from '@/shared/model/model-requests'

export class App {
  private autheticate = new authServ()

  /**
   *
   * @param params the provided user API token
   * @returns the generatad bearer token for v4 API
   */
  public async getUserToken(params: APIToken): Promise<AutheticateResponse> {
    return await this.autheticate.authenticate(params)
  }

  public async getMoviesNow(userToken: UserToken): Promise<MovieData> {
    const fetchUrl = `https://api.themoviedb.org/3/movie/76341`
    const movies = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'content-type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${userToken.request_token}`,
      },
    })
    const { data, errors } = await movies.json()
    console.log(data)
    return data
  }

  // public async loadDOM(): Promise<void> {
  //   const DOMData = await this.getMoviesNow({ apiKey: '1d342f36ce9ad0f75afa27e2eb307f5805f100f2' })
  //   const appEntryPoint: HTMLElement = document.getElementById('app') as HTMLElement
  //   appEntryPoint.innerText = DOMData.id
  //   console.log(DOMData.id)
  // }
}