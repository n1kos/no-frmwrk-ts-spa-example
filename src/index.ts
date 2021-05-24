import 'regenerator-runtime/runtime'
import { MovieData } from '@/shared/model/model-requests'
import { App } from './app'

async function init() {
  // loadDOM()
  const theApp = new App()

  /**
   ** supply API token, get Bearer token to use for API requests
   */
  const userTokenPromise = await theApp.getUserToken({ apiKey: 'bc50218d91157b1ba4f142ef7baaa6a0' })
  const userToken: string = userTokenPromise.request_token
  console.log('userToken', userToken)
  const someMoviePromise = await theApp.getMoviesNow({ request_token: userToken })
  const someMovie: MovieData = someMoviePromise
  console.log(someMovie)
}

init()
