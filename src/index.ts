import 'regenerator-runtime/runtime'
import { App } from './app'
import { ConfigurationResponse, MoviesSearchResponse, NowPlayingResponse } from './shared/model/model-results'
import { APIToken, Movie, Genre, MovieDetailsMoreCollection } from './shared/model/model-common'
import { MoviesMoreRequest, MoviesNowRequest, MoviesSearchRequest } from './shared/model/model-requests'
import { Utils } from './shared/services/utils-service'

async function init() {
  // loadDOM()
  const theApp = new App()
  const utils = new Utils()

  const theApiToken: APIToken = {
    apiKey: 'bc50218d91157b1ba4f142ef7baaa6a0',
  }

  // define query objects
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

  // get references to dom nodes
  const moviesParentNode: HTMLElement = document.getElementById('movies') as HTMLElement
  const searchBtnNode: HTMLInputElement = document.getElementById('movies-search') as HTMLInputElement
  const moviesNowhBtnNode: HTMLButtonElement = document.getElementById('movies-now') as HTMLButtonElement
  const observerNode: HTMLElement = document.getElementById('infinite-scroll-trigger') as HTMLElement
  const moviesNode: HTMLUListElement = document.createElement('ul')
  let observer: IntersectionObserver

  let moviesDataPromise: NowPlayingResponse | MoviesSearchResponse
  let moviesDataResults: Movie[] | undefined

  // the dynamic part of the page, append it to it's parent element
  moviesParentNode.appendChild(moviesNode)

  /**
   ** get the configuration data which might be needed. #todo: store in localstorage, as suggested
   */
  const configObjPromise: ConfigurationResponse = await theApp.getConfig(theApiToken)
  const configObj: string = configObjPromise.images.base_url

  /**
   * get the genres to lookup
   */
  const genres: Genre[] = (await theApp.getGenres(theApiToken)).genres

  /**
   *
   * @param _movies the result list from the queries
   * this builds the DOM initially and everytime there is a new search
   */
  const _buildDOMwithResults = (_movies: Movie[]): void => {
    // document.dispatchEvent(new CustomEvent('movieDataLoaded', { detail: moviesDataResults }))
    if (moviesSearchRequest.query == '') {
      utils._updatePageRequest(moviesNowCurentRequest)
    } else {
      utils._updatePageRequest(moviesSearchRequest)
    }

    // could use a template - #TODO
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
        )}</span><p>${movie.overview}</p><p class="movie-stars">${utils._getStars(movie.vote_average)}</p></div>
        <div class="movie-column"></div>
        ` || 'No Info'
      moviesNode.appendChild(movieLiNode)
    }
  }

  const _getMoreMovies = async () => {
    moviesDataPromise = await theApp.getMoviesNow(moviesNowCurentRequest)
    moviesDataResults = moviesDataPromise.results
    if (moviesDataResults) {
      _buildDOMwithResults(moviesDataResults)
    }
  }

  const _getMoreSearchedMovies = async () => {
    moviesDataPromise = await theApp.getMoviesSearch(moviesSearchRequest)
    moviesDataResults = moviesDataPromise.results
    if (moviesDataResults) {
      _buildDOMwithResults(moviesDataResults)
    }
  }

  const _addModalContent = (_data: MovieDetailsMoreCollection): string => {
    let _innerHTML = ''
    const { reviews, similar, videos } = _data
    if (videos.results && videos.results.length > 0) {
      for (const video of videos.results) {
        _innerHTML += `<iframe width="420" height="315" src="https://www.${video.site}.com/embed/${video.key}"></iframe>`
      }
    }
    return _innerHTML
  }
  /**
   *
   * @param evt
   * @returns the selected movie details. we will be adding a single event listener which will delegate the event
   * instead of adding one for every movie which will have a performance penalty. as an eastern egg, you can
   * click anywhere on the movie and get the results but this will not be indicated
   *
   */
  const _showMoreDetails = async (evt: Event): Promise<MovieDetailsMoreCollection | null> => {
    const _el = evt.target as HTMLElement
    const _desired = _el.closest('[data-movie-link]')
    const _movieId = _desired?.getAttribute('data-movie-id')
    movieMoreDetails.movieId = _movieId || ''
    if (_desired?.classList.contains('show-more')) {
      _desired.querySelectorAll('.movie-column')[2].innerHTML = ''
      _desired.classList.remove('show-more')
      return null
    } else {
      const _movieData = await theApp.getMovieMore(movieMoreDetails)
      _desired?.classList.toggle('show-more')
      //@ts-expect-error
      _desired.querySelectorAll('.movie-column')[2].innerHTML = _addModalContent(_movieData)
      console.log(_movieData)
      return _movieData
    }
  }
  moviesNode.addEventListener('click', _showMoreDetails)

  // document.addEventListener('movieDataLoaded', ((event: CustomEvent) => {
  //   console.log(event.detail)
  // }) as EventListener)

  const _getSearchedMovies = async (searchString: string): Promise<void> => {
    moviesSearchRequest.query = searchString
    moviesSearchRequest.pageNo = 1
    moviesDataPromise = await theApp.getMoviesSearch(moviesSearchRequest)
    moviesDataResults = moviesDataPromise.results
    if (moviesDataResults && moviesDataResults.length > 0) {
      moviesNode.innerHTML = ''
      _buildDOMwithResults(moviesDataResults)
    } else {
      moviesSearchRequest.query = ''
      moviesSearchRequest.pageNo = 1
      alert('no results')
    }
  }

  /**
   * we will allow the user some time between keypresses and actually activating the search
   */
  const _searchDebounced = utils.debounce(function (evt: Event): void {
    // allow only searches with at least 3 chars, although this will exclude some, ie 'IT', 'ET'
    // but can mitigated by pressing enter thouggh this might be somewhat confusing.. i ll see
    if (searchBtnNode.value.match(/\w{3}/)) {
      // sanitise input
      _getSearchedMovies(searchBtnNode.value.trim().replace(/[\.'"\*\+-@#]/g, ''))
    }
  }, 250)
  searchBtnNode.addEventListener('keyup', _searchDebounced)

  /**
   * need to have a way to go back to original results
   */
  moviesNowhBtnNode.addEventListener('click', () => {
    if (moviesSearchRequest.query !== '') {
      moviesSearchRequest.query = ''
      moviesSearchRequest.pageNo = 1
      moviesNowCurentRequest.pageNo = 1
      moviesNode.innerHTML = ''
    }
  })
  /**
   * use the observer native API for the infinit scrolling
   */
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      /**
       * this will evaluate to true when the page first loads - see below
       */
      if (entry.intersectionRatio > 0) {
        setTimeout(() => {
          // you can either load more now playing or more searched
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
