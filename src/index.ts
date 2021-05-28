import 'regenerator-runtime/runtime'
import { App } from './app'

async function init() {
  const theApp = new App({ apiKey: 'bc50218d91157b1ba4f142ef7baaa6a0' })

  let observer: IntersectionObserver
  /**
   * we will allow the user some time between keypresses and actually activating the search
   */
  const _searchDebounced = theApp.utils.debounce(function (evt: Event): void {
    // allow only searches with at least 3 chars, although this will exclude some, ie 'IT', 'ET'
    // but can mitigated by pressing enter thouggh this might be somewhat confusing.. i ll see
    if (theApp.searchBtnNode.value.match(/\w{3}/)) {
      // sanitise input
      theApp._getSearchedMovies(theApp.searchBtnNode.value.trim().replace(/[\.'"\*\+-@#]/g, ''))
    }
  }, 250)

  theApp.moviesNode.addEventListener('click', theApp._showMoreDetails)
  theApp.searchBtnNode.addEventListener('keyup', _searchDebounced)

  /**
   * need to have a way to go back to original results
   */
  theApp.moviesNowhBtnNode.addEventListener('click', () => {
    if (theApp.moviesSearch.query !== '') {
      theApp.moviesSearch.query = ''
      theApp.moviesSearch.pageNo = 1
      theApp.moviesNowCurent.pageNo = 1
      theApp.moviesNode.innerHTML = ''
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
          if (theApp.moviesSearch.query == '') {
            theApp._getMoreMovies()
          } else {
            theApp._getMoreSearchedMovies()
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

  observer.observe(theApp.observerNode)
  theApp._getConfig()
  theApp._getGenres()
}

init()
