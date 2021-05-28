import 'regenerator-runtime/runtime'
import { App } from './app'
import {
  ConfigurationResponse,
  MoviesSearchResponse,
  NowPlayingResponse,
  MovieDetailsReviewsResponse,
} from './shared/model/model-results'
import { APIToken, Movie, Genre, MovieDetailsMoreCollection, ReviewsDetails } from './shared/model/model-common'
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
      moviesNode.appendChild(movieLiNode)

      const fragment: DocumentFragment = document.createDocumentFragment()
      const childDiv1: HTMLElement = document.createElement('div')
      const childDiv2: HTMLElement = document.createElement('div')
      const childDiv3: HTMLElement = document.createElement('div')

      childDiv1.setAttribute('class', 'movie-column with-poster')
      childDiv1.innerHTML = `<img class="movie-poster responsive" loading="lazy" width="500" height="750" src="${configObj}w500/${movie.poster_path}"/>`
      fragment.appendChild(childDiv1)

      childDiv2.setAttribute('class', 'movie-column with-info')
      childDiv2.innerHTML = `<h1 class="movie-title"><a class="override-link" href="https://www.themoviedb.org/movie/${
        movie.id
      }">${movie.title?.trim()}</a><span class="movie-date">(${utils._getYear(
        movie.release_date
      )})</span><span class="movie-more">...more</span></h1><span class="movie-genres">${utils._getGenreTitle(
        movie.genre_ids,
        genres
      )}</span><p>${movie.overview}</p><p class="movie-stars">${utils._getStars(movie.vote_average)}</p>`
      fragment.appendChild(childDiv2)

      childDiv3.setAttribute('class', 'movie-column with-more-info')
      fragment.appendChild(childDiv3)

      movieLiNode.appendChild(fragment)
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

  const _addMovieMoreContent = (_data: MovieDetailsMoreCollection, _desired: HTMLElement): void => {
    let _innerHTML = ''
    const fragment: DocumentFragment = document.createDocumentFragment()
    const childDiv: HTMLElement = document.createElement('div')
    childDiv.setAttribute('class', 'more-info-panel')
    const { reviews, similar, videos } = _data

    // childDiv.innerHTML = _addMovieMoreContent(_data)
    // _desired.querySelector('.with-more-info').innerHTML = _addMovieMoreContent(_movieData)

    if (videos.results && videos.results.length > 0) {
      for (const video of videos.results) {
        _innerHTML += `<iframe width="420" height="315" src="https://www.${video.site}.com/embed/${video.key}"></iframe>`
      }
    }
    if (reviews.results && reviews.results.length > 0) {
      _innerHTML += '<div>'
      _innerHTML += '<h1>Reviews</h1>'
      const limitedReviews: ReviewsDetails[] = []
      limitedReviews.push(reviews.results[0])
      if (reviews.results[1]) limitedReviews.push(reviews.results[1])
      for (const review of limitedReviews) {
        _innerHTML += `<h3>from ${review.author} </h3><p>${review.content}</p>`
      }
      _innerHTML += '</div>'
    }
    if (similar.results && similar.results.length > 0) {
      _innerHTML += '<div>'
      _innerHTML += '<h1>Similar movies</h1>'
      for (const simil of similar.results) {
        _innerHTML += `<h3><a href="https://www.themoviedb.org/movie/${simil.id}"> ${simil.title}</a> </h3>`
      }
      _innerHTML += '</div>'
    }

    childDiv.innerHTML = _innerHTML
    fragment.appendChild(childDiv)
    _desired?.querySelector('.with-more-info')?.appendChild(fragment)
  }
  /**
   *
   * @param evt
   * @returns the selected movie details. we will be adding a single event listener which will delegate the event
   * instead of adding one for every movie which will have a performance penalty. as an eastern egg, you can
   * click anywhere on the movie and get the results but this will not be indicated
   *
   */
  const _showMoreDetails = async (evt: Event): Promise<void | null> => {
    const _el = evt.target as HTMLElement
    const _desired: HTMLElement = _el.closest('[data-movie-link]') as HTMLElement
    const _movieId = _desired?.getAttribute('data-movie-id')
    let _movieData: MovieDetailsMoreCollection
    movieMoreDetails.movieId = _movieId || ''
    if (_desired?.classList.contains('show-more')) {
      _desired.classList.remove('show-more')
      return null
    } else {
      if (_desired.querySelector('.with-more-info')?.innerHTML == '') {
        _movieData = await theApp.getMovieMore(movieMoreDetails)
        console.log(_movieData)
        _addMovieMoreContent(_movieData, _desired)
      }
      _desired?.classList.toggle('show-more')
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
