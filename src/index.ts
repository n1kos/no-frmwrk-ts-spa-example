import 'regenerator-runtime/runtime'
import { App } from './app'
import { ConfigurationResponse, NowPlayingResponse } from '@/shared/model/model-results'
import { APIToken, Movie } from '@/shared/model/model-common'
import { MoviesNowRequest } from './shared/model/model-requests'
import { Genre } from './shared/model/model-common'
import { GenreResponse } from './shared/model/model-results'

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
  // const appNode: HTMLElement = document.getElementById('container') as HTMLElement
  const moviesParentNode: HTMLElement = document.getElementById('movies') as HTMLElement
  const observerNode: HTMLElement = document.getElementById('infinite-scroll-trigger') as HTMLElement
  const moviesNode: HTMLUListElement = document.createElement('ul')
  let observer: IntersectionObserver

  let moviesNowPromise: NowPlayingResponse
  let moviesNow: Movie[] | undefined
  moviesParentNode.appendChild(moviesNode)
  /**
   ** get the configuration data which might be needed. #todo: store in localstorage, as suggested
   */
  const configObjPromise: ConfigurationResponse = await theApp.getConfig(theApiToken)
  const configObj: string = configObjPromise.images.base_url
  console.log('baseUrl', configObj)

  const genres: Genre[] = await (await theApp.getGenres(theApiToken)).genres

  function updatePageRequest(_moviesNowCurentRequest: MoviesNowRequest): void {
    _moviesNowCurentRequest.pageNo++
  }

  function getGenreTitle(_ids: number[] = [], _genres: Genre[]): string {
    return _ids
      .map((theId: number) => genres.filter((element: Genre) => element.id == theId))
      .map((element: Genre[]) => element[0].name)
      .toString()
  }

  async function getMoreMovies() {
    moviesNowPromise = await theApp.getMoviesNow(moviesNowCurentRequest)
    moviesNow = moviesNowPromise.results
    if (moviesNow) {
      updatePageRequest(moviesNowCurentRequest)
      for (const movie of moviesNow) {
        const movieLiNode: HTMLLIElement = document.createElement('li')
        movieLiNode.innerText =
          `${movie.title}, ${movie.release_date}, ${movie.original_title}, ${movie.vote_average}, ${
            movie.overview
          }, ${getGenreTitle(movie.genre_ids, genres)}` || 'No Title'
        moviesNode.appendChild(movieLiNode)
      }
    }
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      /**
       * this will evaluate to true when the page first loads - see below
       */
      if (entry.intersectionRatio > 0) {
        setTimeout(() => {
          getMoreMovies()
        }, 1000)
      }
    })
  })

  /**
   *! ok, this is a bit hacky cos when the page loads the condition for getting more is true
   *! (since everything is flat) which resulted in an extra call. This is resolved by not getting
   *! the list explitictly but perhaps a solution which would use listeners to attach the event
   *! after everything was ready would be better
   */
  // getMoreMovies()
  observer.observe(observerNode)
}

init()
