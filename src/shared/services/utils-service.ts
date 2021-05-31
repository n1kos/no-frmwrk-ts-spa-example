import { MoviesNowRequest, MoviesSearchRequest } from '@/shared/model/model-requests'
import { Genre } from '@/shared/model/model-common'
export class Utils {
  public debounce = (func: Function, wait: number) => {
    return function executedFunction(...args: []) {
      let timeout: ReturnType<typeof setTimeout>
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      //@ts-expect-error use-before-assign
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  public _updatePageRequest = (_moviesCurrentRequest: MoviesNowRequest | MoviesSearchRequest): void => {
    _moviesCurrentRequest.pageNo++
  }

  public _getGenreTitle = (_ids: number[] = [], _genres: Genre[]): string => {
    return _ids
      .map((theId: number) => _genres.filter((element: Genre) => element.id == theId))
      .map((element: Genre[]) => element[0].name)
      .toString()
  }

  public _getStars = (rating: number = 0): string => {
    // rating is on 1-10 scale, we are using a 1 - 5 and round to nearest half
    rating = Math.round((rating / 2) * 2) / 2
    const output: string[] = []
    // Append all the filled whole stars
    for (var i = rating; i >= 1; i--) output.push('<span class="star on" aria-hidden="true"></span>')
    // If there is a half a star, append it
    if (i == 0.5) output.push('<span class="star half" aria-hidden="true"></span>')
    // Fill the empty stars
    for (let i = 5 - rating; i >= 1; i--) output.push('<span class="star off" aria-hidden="true"></span>')
    return output.join('')
  }

  public _getYear = (_date: Date = new Date(1, 1, 1)): string => {
    const _dateRelease: string = new Date(_date.toString()).getFullYear().toString()
    return _dateRelease.toUpperCase() == 'NAN' ? '-' : _dateRelease
  }
}
