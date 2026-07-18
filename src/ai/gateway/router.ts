import { createGeminiProvider } from '../providers/gemini'
import { GatewayError, type GatewayRequest, type GatewaySuccess, type Provider } from '../types'

export type GatewayEnvironment = {
  geminiApiKey?: string
}

const selectProvider = (environment: GatewayEnvironment): Provider => {
  return createGeminiProvider(environment.geminiApiKey)
}

export const routeGatewayRequest = async (
  request: GatewayRequest,
  environment: GatewayEnvironment
): Promise<GatewaySuccess> => {
  if (request.type !== 'text') {
    throw new GatewayError('Tipe permintaan tidak didukung.', 400)
  }

  const prompt = request.prompt.trim()
  if (!prompt) {
    throw new GatewayError('Prompt wajib diisi.', 400)
  }

  if (prompt.length > 20_000) {
    throw new GatewayError('Prompt terlalu panjang. Maksimum 20.000 karakter.', 413)
  }

  const provider = selectProvider(environment)
  const result = await provider.generate({ ...request, prompt })

  return { ok: true, result }
}
