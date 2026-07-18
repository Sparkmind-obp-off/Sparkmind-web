export type GatewayRequest = {
  prompt: string
  type: 'text'
}

export type GatewaySuccess = {
  ok: true
  result: string
}

export type GatewayFailure = {
  ok: false
  error: string
}

export type GatewayResponse = GatewaySuccess | GatewayFailure

export interface Provider {
  readonly name: string
  generate(request: GatewayRequest): Promise<string>
}

export type GatewayErrorStatus = 400 | 413 | 502 | 503

export class GatewayError extends Error {
  readonly status: GatewayErrorStatus

  constructor(message: string, status: GatewayErrorStatus) {
    super(message)
    this.name = 'GatewayError'
    this.status = status
  }
}
