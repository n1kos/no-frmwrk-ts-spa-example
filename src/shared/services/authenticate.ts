import { AutheticateResponse, JSONPromisResponse } from '@/shared/model/model-results'
import { APIToken } from '../model/model-common'

export class AutheticationService {
  public async authenticate(params: APIToken): Promise<AutheticateResponse> {
    const authenticateUrl = `https://api.themoviedb.org/3/authentication/token/new?api_key=${params.apiKey}`
    const response = await fetch(authenticateUrl)
    const data: AutheticateResponse = await response.json()
    if (data.success) {
      //console.log(data)
      return data
    } else {
      throw new Error()
    }

    // let sessionToken: AutheticateResponse
    // if (response) {
    //   sessionToken = response.data
    //   return sessionToken
    // } else {
    //   return null
    // }
  }
}
