import 'regenerator-runtime/runtime'
import { App } from './app'
import { ConfigurationResponse, NowPlayingResponse } from '@/shared/model/model-results'
import { APIToken, Movie } from '@/shared/model/model-common'
import { MoviesMoreRequest, MoviesNowRequest } from './shared/model/model-requests'
import { Genre } from './shared/model/model-common'

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

  const movieMoreDetails: MoviesMoreRequest = {
    apiKey: theApiToken.apiKey,
    movieId: '',
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

  const genres: Genre[] = (await theApp.getGenres(theApiToken)).genres

  function _updatePageRequest(_moviesNowCurentRequest: MoviesNowRequest): void {
    _moviesNowCurentRequest.pageNo++
  }

  function _getGenreTitle(_ids: number[] = [], _genres: Genre[]): string {
    return _ids
      .map((theId: number) => genres.filter((element: Genre) => element.id == theId))
      .map((element: Genre[]) => element[0].name)
      .toString()
  }

  function _getStars(rating: number = 0) {
    // rating is on 1-10 scale, we are using a 1 - 5 and round to nearest half
    rating = Math.round((rating / 2) * 2) / 2
    const output = []
    // Append all the filled whole stars
    for (var i = rating; i >= 1; i--) output.push('<span class="star on" aria-hidden="true"></span>')
    // If there is a half a star, append it
    if (i == 0.5) output.push('<span class="star half" aria-hidden="true"></span>')
    // Fill the empty stars
    for (let i = 5 - rating; i >= 1; i--) output.push('<span class="star off" aria-hidden="true"></span>')
    return output.join('')
  }

  function _getYear(_date: Date = new Date(1, 1, 1)): number {
    const _dateRelease = new Date(_date.toString()).getFullYear()
    return _dateRelease == 1 ? 0 : _dateRelease
  }

  async function _getMoreMovies() {
    moviesNowPromise = await theApp.getMoviesNow(moviesNowCurentRequest)
    moviesNow = moviesNowPromise.results
    if (moviesNow) {
      _updatePageRequest(moviesNowCurentRequest)
      for (const movie of moviesNow) {
        const movieLiNode: HTMLLIElement = document.createElement('li')
        movieLiNode.setAttribute('data-movie-id', movie.id?.toString() || '')
        movieLiNode.setAttribute('data-movie-link', 'true')
        movieLiNode.innerHTML =
          ` <h1 class='movie-title'>${movie.title}<span class='movie-date'>(${_getYear(
            movie.release_date
          )})</span><span class='movie-more'>...more</span></h1><span class='movie-genres'>${_getGenreTitle(
            movie.genre_ids,
            genres
          )}</span><p>${movie.overview}</p><p class='movie-stars'>${_getStars(movie.vote_average)}</p>` || 'No Info'
        moviesNode.appendChild(movieLiNode)
      }
    }
  }

  async function _showMoreDetails(evt: Event) {
    const _el = evt.target as HTMLElement
    const _desired = _el.closest('[data-movie-link]')
    const _movieId = _desired?.getAttribute('data-movie-id')
    movieMoreDetails.movieId = _movieId || ''
    const _movieData = await theApp.getMovieMore(movieMoreDetails)
    console.log(_movieData)
    return _movieData
  }
  moviesNode.addEventListener('click', _showMoreDetails)

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      /**
       * this will evaluate to true when the page first loads - see below
       */
      if (entry.intersectionRatio > 0) {
        setTimeout(() => {
          _getMoreMovies()
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
