import 'regenerator-runtime/runtime'
import { MovieData } from '@/shared/model/model-requests'
import { APIToken } from '@/shared/model/model-common'

async function getMoviesNow(apiToken: APIToken): Promise<MovieData> {
  console.log('test')
  console.log(apiToken)
  const fetchUrl = `https://api.themoviedb.org/3/movie/76341?api_key=${apiToken.apiKey}`
  const res: Response = await fetch(fetchUrl)
  if (res) {
    const data: Promise<MovieData> = res.json()
    return data
  } else {
    throw new Error()
  }
}

async function loadDOM(): Promise<void> {
  const DOMData: MovieData = await getMoviesNow({ apiKey: 'bc50218d91157b1ba4f142ef7baaa6a0' })
  const appEntryPoint: HTMLElement = document.getElementById('app') as HTMLElement
  appEntryPoint.innerText = DOMData.id
  console.log(DOMData.id)
}

loadDOM()
