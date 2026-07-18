import type { GatewayRequest, GatewaySuccess } from '../types'
import { routeGatewayRequest, type GatewayEnvironment } from './router'

export const runGateway = (
  request: GatewayRequest,
  environment: GatewayEnvironment
): Promise<GatewaySuccess> => routeGatewayRequest(request, environment)

export type { GatewayEnvironment } from './router'
