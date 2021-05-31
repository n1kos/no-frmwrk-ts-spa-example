import { APIToken, Genre, Movie, MovieDetailsMoreCollection, ReviewsDetails } from '@/shared/model/model-common'
import {
  ConfigurationResponse,
  GenreResponse,
  MovieDetailsResponse,
  MoviesSearchResponse,
  NowPlayingResponse,
} from '@/shared/model/model-results'
import { MoviesMoreRequest, MoviesNowRequest, MoviesSearchRequest } from '@/shared/model/model-requests'
import { ApiRequestService as ApiService } from './shared/services/request-service'
import { Utils } from './shared/services/utils-service'

export class App {
  private apiService = new ApiService()
  private myApiToken: APIToken
  private moviesNowCurentRequest: MoviesNowRequest
  private moviesSearchRequest: MoviesSearchRequest
  private movieMoreDetails: MoviesMoreRequest
  moviesParentNode: HTMLElement
  searchBtnNode: HTMLInputElement
  moviesNowhBtnNode: HTMLButtonElement
  observerNode: HTMLElement
  moviesNode: HTMLUListElement
  genres: Genre[]
  configObj: string

  utils = new Utils()

  constructor(theApitoken: APIToken) {
    this.myApiToken = theApitoken
    this.moviesNowCurentRequest = {
      apiKey: this.myApiToken.apiKey,
      pageNo: 1,
    }
    this.moviesSearchRequest = {
      apiKey: this.myApiToken.apiKey,
      pageNo: 1,
      query: '',
    }
    this.movieMoreDetails = {
      apiKey: this.myApiToken.apiKey,
      movieId: '',
    }

    // get references to dom nodes
    this.moviesParentNode = document.getElementById('movies') as HTMLElement
    this.searchBtnNode = document.getElementById('movies-search') as HTMLInputElement
    this.moviesNowhBtnNode = document.getElementById('movies-now') as HTMLButtonElement
    this.observerNode = document.getElementById('infinite-scroll-trigger') as HTMLElement
    this.moviesNode = document.createElement('ul')
    // the dynamic part of the page, append it to it's parent element
    this.moviesParentNode.appendChild(this.moviesNode)
    /**
     ** get the configuration data which might be needed. #todo: store in localstorage, as suggested
     */
    // this.configObjPromise = configObjPromise//await this.getConfig(this.anApiToken)
    // this.configObj = this.configObjPromise.images.base_url
    /**
     * get the genres to lookup
     */
    this.configObj = ''
    this.genres = []
  }

  public get anApiToken(): APIToken {
    return this.myApiToken
  }

  public get moviesNowCurent(): MoviesNowRequest {
    return this.moviesNowCurentRequest
  }

  public get moviesSearch(): MoviesSearchRequest {
    return this.moviesSearchRequest
  }

  public get moviesMoreDetails(): MoviesMoreRequest {
    return this.movieMoreDetails
  }

  /**
   *
   * @param params the provided user API token
   * @returns the configuration of the site
   */
  public async getConfig(params: APIToken): Promise<ConfigurationResponse> {
    return await this.apiService.getConfig(params)
  }
  public async getGenres(params: APIToken): Promise<GenreResponse> {
    return await this.apiService.getGenres(params)
  }

  public async getMoviesNow(params: MoviesNowRequest): Promise<NowPlayingResponse> {
    return await this.apiService.getMoviesNow(params)
  }

  public async getMoviesSearch(params: MoviesSearchRequest): Promise<MoviesSearchResponse> {
    return await this.apiService.getMoviesSearch(params)
  }

  public async getMovieDetails(params: MoviesMoreRequest): Promise<MovieDetailsResponse> {
    return await this.apiService.getMovieDetails(params)
  }

  public setmovieMoreDetails(_id: string = '') {
    this.movieMoreDetails.movieId = _id
  }

  public _getConfig = async () => {
    const configObjPromise: ConfigurationResponse = await this.getConfig(this.anApiToken)
    this.configObj = configObjPromise.images.base_url
  }

  public _getGenres = async () => {
    this.genres = (await this.getGenres(this.anApiToken)).genres
  }

  public async getMovieMore(params: MoviesMoreRequest): Promise<MovieDetailsMoreCollection> {
    const [_reviews, _similar, _videos] = await Promise.all([
      this.apiService.getMovieDetailsReviews(params),
      this.apiService.getMovieDetailsSimilar(params),
      this.apiService.getMovieDetailsVideos(params),
    ])
    return {
      reviews: _reviews,
      similar: _similar,
      videos: _videos,
    }
  }

  /**
   *
   * @param _movies the result list from the queries
   * this builds the DOM initially and everytime there is a new search
   */
  private _buildDOMwithResults = (_movies: Movie[]): void => {
    // document.dispatchEvent(new CustomEvent('movieDataLoaded', { detail: moviesDataResults }))
    if (this.moviesSearch.query == '') {
      this.utils._updatePageRequest(this.moviesNowCurent)
    } else {
      this.utils._updatePageRequest(this.moviesSearch)
    }

    // could use a template - #TODO
    for (const movie of _movies) {
      const movieLiNode: HTMLLIElement = document.createElement('li')
      movieLiNode.setAttribute('data-movie-id', movie.id?.toString() || '')
      movieLiNode.setAttribute('data-movie-link', 'true')
      this.moviesNode.appendChild(movieLiNode)

      const fragment: DocumentFragment = document.createDocumentFragment()
      const childDiv1: HTMLElement = document.createElement('div')
      const childDiv2: HTMLElement = document.createElement('div')
      const childDiv3: HTMLElement = document.createElement('div')

      childDiv1.setAttribute('class', 'movie-column with-poster')
      childDiv1.innerHTML = `<img class="movie-poster responsive" loading="lazy" width="500" height="750" src="${this.configObj}w500/${movie.poster_path}"/>`
      fragment.appendChild(childDiv1)

      childDiv2.setAttribute('class', 'movie-column with-info')
      childDiv2.innerHTML = `<h1 class="movie-title"><a class="override-link" target="blank" href="https://www.themoviedb.org/movie/${
        movie.id
      }">${movie.title?.trim()}</a><span class="movie-date">(${this.utils._getYear(
        movie.release_date
      )})</span><span class="movie-more">...more</span></h1><span class="movie-genres">${this.utils._getGenreTitle(
        movie.genre_ids,
        this.genres
      )}</span><p>${movie.overview}</p><p class="movie-stars">${this.utils._getStars(movie.vote_average)}</p>`
      fragment.appendChild(childDiv2)

      childDiv3.setAttribute('class', 'movie-column with-more-info')
      fragment.appendChild(childDiv3)

      movieLiNode.appendChild(fragment)
    }
  }

  _getMoreMovies = async () => {
    const moviesDataPromise = await this.getMoviesNow(this.moviesNowCurent)
    const moviesDataResults = moviesDataPromise.results
    if (moviesDataResults) {
      this._buildDOMwithResults(moviesDataResults)
    }
  }

  _getMoreSearchedMovies = async () => {
    const moviesDataPromise = await this.getMoviesSearch(this.moviesSearch)
    const moviesDataResults = moviesDataPromise.results
    if (moviesDataResults) {
      this._buildDOMwithResults(moviesDataResults)
    }
  }

  _addMovieMoreContent = (_data: MovieDetailsMoreCollection, _desired: HTMLElement): void => {
    let _innerHTML = ''
    const fragment: DocumentFragment = document.createDocumentFragment()
    const childDiv: HTMLElement = document.createElement('div')
    childDiv.setAttribute('class', 'more-info-panel')
    const { reviews, similar, videos } = _data
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
        _innerHTML += `<h3><a target="_blank" href="https://www.themoviedb.org/movie/${simil.id}"> ${simil.title}</a> </h3>`
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
  _showMoreDetails = async (evt: Event): Promise<void | null> => {
    const _el = evt.target as HTMLElement
    const _desired: HTMLElement = _el.closest('[data-movie-link]') as HTMLElement
    const _movieId = _desired?.getAttribute('data-movie-id')
    let _movieData: MovieDetailsMoreCollection
    this.setmovieMoreDetails(_movieId || '')
    if (_desired?.classList.contains('show-more')) {
      _desired.classList.remove('show-more')
      return null
    } else {
      if (_desired.querySelector('.with-more-info')?.innerHTML == '') {
        _movieData = await this.getMovieMore(this.moviesMoreDetails)
        console.log(_movieData)
        this._addMovieMoreContent(_movieData, _desired)
      }
      _desired?.classList.toggle('show-more')
    }
  }

  _getSearchedMovies = async (searchString: string): Promise<void> => {
    this.moviesSearch.query = searchString
    this.moviesSearch.pageNo = 1
    const moviesDataPromise = await this.getMoviesSearch(this.moviesSearch)
    const moviesDataResults = moviesDataPromise.results
    if (moviesDataResults && moviesDataResults.length > 0) {
      this.moviesNode.innerHTML = ''
      this._buildDOMwithResults(moviesDataResults)
    } else {
      this.moviesSearch.query = ''
      this.moviesSearch.pageNo = 1
      alert('no results')
    }
  }
}
