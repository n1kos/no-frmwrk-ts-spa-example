import 'regenerator-runtime/runtime'
import { App } from './app'
import { ConfigurationResponse, NowPlayingResponse } from './shared/model/model-results'
import { APIToken, Movie } from './shared/model/model-common'

async function init() {
  // loadDOM()
  const theApp = new App()
  const theApiToken: APIToken = {
    apiKey: 'bc50218d91157b1ba4f142ef7baaa6a0',
  }

  /**
   ** get the configuration data which might be needed. #todo: store in localstorage, as suggested
   */
  const configObjPromise: ConfigurationResponse = await theApp.getConfig(theApiToken)
  const configObj: string = configObjPromise.images.base_url
  console.log('baseUrl', configObj)

  const moviesNowPromise: NowPlayingResponse = await theApp.getMoviesNow(theApiToken)
  const moviesNow: Movie[] | undefined = moviesNowPromise.results
  console.log('moviesNow', moviesNow)
}

init()
