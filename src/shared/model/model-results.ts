export interface AutheticateResponse {
  success: boolean
  expires_at: Date
  request_token: string
}

export interface JSONPromisResponse {
  data?: {}
  errors?: Array<{ message: string }>
}
