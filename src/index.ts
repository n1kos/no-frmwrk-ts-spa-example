import 'regenerator-runtime/runtime'
import { App } from './app'
import { ConfigurationResponse, NowPlayingResponse } from '@/shared/model/model-results'
import { APIToken, Movie } from '@/shared/model/model-common'
import { MoviesNowRequest } from './shared/model/model-requests'

async function init() {
  // loadDOM()
  const theApp = new App()
  const theApiToken: APIToken = {
    apiKey: 'bc50218d91157b1ba4f142ef7baaa6a0',
  }
  // let pageRequestNo: number = 1
  const moviesNowCurentRequest: MoviesNowRequest = {
    apiKey: theApiToken.apiKey,
    pageNo: 1,
  }
  const appNode: HTMLElement = document.getElementById('app') as HTMLElement
  const moviesNode: HTMLUListElement = document.createElement('ul')

  let moviesNowPromise: NowPlayingResponse
  let moviesNow: Movie[] | undefined
  appNode.appendChild(moviesNode)
  /**
   ** get the configuration data which might be needed. #todo: store in localstorage, as suggested
   */
  const configObjPromise: ConfigurationResponse = await theApp.getConfig(theApiToken)
  const configObj: string = configObjPromise.images.base_url
  console.log('baseUrl', configObj)

  function updatePageRequest(_moviesNowCurentRequest: MoviesNowRequest): void {
    _moviesNowCurentRequest.pageNo++
  }

  moviesNowPromise = await theApp.getMoviesNow(moviesNowCurentRequest)
  moviesNow = moviesNowPromise.results
  console.log('moviesNow', moviesNow)

  if (moviesNow) {
    updatePageRequest(moviesNowCurentRequest)
    for (const movie of moviesNow) {
      const movieLiNode: HTMLLIElement = document.createElement('li')
      movieLiNode.innerText =
        `${movie.title}, ${movie.release_date}, ${movie.original_title}, ${movie.vote_average}, ${movie.overview}, ${movie.genre_ids}` ||
        'No Title'
      moviesNode.appendChild(movieLiNode)
    }

    async function getMoreMovies() {
      moviesNowPromise = await theApp.getMoviesNow(moviesNowCurentRequest)
      moviesNow = moviesNowPromise.results
      if (moviesNow) {
        updatePageRequest(moviesNowCurentRequest)
        for (const movie of moviesNow) {
          const movieLiNode: HTMLLIElement = document.createElement('li')
          movieLiNode.innerText =
            `${movie.title}, ${movie.release_date}, ${movie.original_title}, ${movie.vote_average}, ${movie.overview}, ${movie.genre_ids}` ||
            'No Title'
          moviesNode.appendChild(movieLiNode)
        }
      }
    }

    appNode.addEventListener('click', getMoreMovies)
  }
  // appNode.innerHTML = new Set(moviesNow).toString()
}

init()
