import 'regenerator-runtime/runtime'
import { App } from './app'
import { ConfigurationResponse, NowPlayingResponse } from '@/shared/model/model-results'
import { APIToken, Movie, Genre } from '@/shared/model/model-common'
import { MoviesMoreRequest, MoviesNowRequest, MoviesSearchRequest } from '@/shared/model/model-requests'
import { Utils } from './shared/services/utils-service'

async function init() {
  // loadDOM()
  const theApp = new App()
  const utils = new Utils()
  
  const theApiToken: APIToken = {
    apiKey: 'bc50218d91157b1ba4f142ef7baaa6a0',
  }

  const moviesNowCurentRequest: MoviesNowRequest = {
    apiKey: theApiToken.apiKey,
    pageNo: 1,
  }

  const moviesSearchRequest: MoviesSearchRequest = {
    apiKey: theApiToken.apiKey,
    pageNo: 1,
    query: '',
  }

  const movieMoreDetails: MoviesMoreRequest = {
    apiKey: theApiToken.apiKey,
    movieId: '',
  }

  const moviesParentNode: HTMLElement = document.getElementById('movies') as HTMLElement
  const searchBtnNode: HTMLInputElement = document.getElementById('moviesSearch') as HTMLInputElement
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

  const genres: Genre[] = (await theApp.getGenres(theApiToken)).genres

  const _buildDOMwithResults = (_movies: Movie[]): void => {
    document.dispatchEvent(new CustomEvent('movieDataLoaded', { detail: moviesNow }))
    if (moviesSearchRequest.query == '') {
      utils._updatePageRequest(moviesNowCurentRequest)
    } else {
      utils._updatePageRequest(moviesSearchRequest)
    }

    for (const movie of _movies) {
      const movieLiNode: HTMLLIElement = document.createElement('li')
      movieLiNode.setAttribute('data-movie-id', movie.id?.toString() || '')
      movieLiNode.setAttribute('data-movie-link', 'true')
      movieLiNode.innerHTML =
        `<div class="movie-column">
          <img class="responsive" loading="lazy" width="500" height="750" src="${configObj}w500/${movie.poster_path}" />
           </div>
           <div class="movie-column">
           <h1 class="movie-title">${movie.title}<span class="movie-date">(${utils._getYear(
          movie.release_date
        )})</span><span class="movie-more">...more</span></h1><span class="movie-genres">${utils._getGenreTitle(
          movie.genre_ids,
          genres
        )}</span><p>${movie.overview}</p><p class="movie-stars">${utils._getStars(movie.vote_average)}</p></div>` || 'No Info'
      moviesNode.appendChild(movieLiNode)
    }
  }

  const _getMoreMovies = async () => {
    moviesNowPromise = await theApp.getMoviesNow(moviesNowCurentRequest)
    moviesNow = moviesNowPromise.results
    if (moviesNow) {
      _buildDOMwithResults(moviesNow)
    }
  }

  const _getMoreSearchedMovies = async () => {
    moviesNowPromise = await theApp.getMoviesSearch(moviesSearchRequest)
    moviesNow = moviesNowPromise.results
    if (moviesNow) {
      _buildDOMwithResults(moviesNow)
    }
  }

  const _showMoreDetails = async (evt: Event) => {
    const _el = evt.target as HTMLElement
    const _desired = _el.closest('[data-movie-link]')
    const _movieId = _desired?.getAttribute('data-movie-id')
    movieMoreDetails.movieId = _movieId || ''
    const _movieData = await theApp.getMovieMore(movieMoreDetails)
    console.log(_movieData)
    return _movieData
  }
  moviesNode.addEventListener('click', _showMoreDetails)

  document.addEventListener('movieDataLoaded', ((event: CustomEvent) => {
    console.log(event.detail)
  }) as EventListener)

  const _getSearchedMovies = async (searchString: string) => {
    moviesSearchRequest.query = searchString
    moviesSearchRequest.pageNo = 1
    moviesNowPromise = await theApp.getMoviesSearch(moviesSearchRequest)
    moviesNow = moviesNowPromise.results
    if (moviesNow) {
      moviesNode.innerHTML = ''
      _buildDOMwithResults(moviesNow)
    }
  }

  const _searchDebounced = utils.debounce(function (evt: Event) {
    // allow only searches with at least 3 chars, although this will exclude some, ie 'IT', 'ET'
    // but can mitigated by pressing enter thouggh this might be somewhat confusing.. i ll see
    if (searchBtnNode.value.match(/\w{3}/)) {
      // sanitise input
      _getSearchedMovies(searchBtnNode.value.trim().replace(/[\.'"\*\+-@#]/g, ''))
    }
  }, 250)
  searchBtnNode.addEventListener('keyup', _searchDebounced)

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      /**
       * this will evaluate to true when the page first loads - see below
       */
      if (entry.intersectionRatio > 0) {
        setTimeout(() => {
          console.log(searchBtnNode.value)
          if (moviesSearchRequest.query == '') {
            _getMoreMovies()
          } else {
            _getMoreSearchedMovies()
          }
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
