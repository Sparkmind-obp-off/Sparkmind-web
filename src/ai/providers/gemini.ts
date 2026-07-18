import { GatewayError, type GatewayRequest, type Provider } from '../types'

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

const extractText = (payload: GeminiResponse): string => {
  return payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim() ?? ''
}

export const createGeminiProvider = (apiKey: string | undefined): Provider => ({
  name: 'gemini',

  async generate(request: GatewayRequest): Promise<string> {
    const credential = apiKey?.trim()
    if (!credential) {
      throw new GatewayError('Layanan AI belum dikonfigurasi.', 503)
    }

    let response: Response

    try {
      response = await fetch(
        `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': credential
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: request.prompt }] }],
            generationConfig: { responseMimeType: 'text/plain' }
          })
        }
      )
    } catch {
      throw new GatewayError('Layanan AI sedang tidak dapat dihubungi.', 503)
    }

    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) {
        throw new GatewayError('Layanan AI sedang sibuk. Silakan coba lagi.', 503)
      }

      throw new GatewayError('Permintaan tidak dapat diproses oleh layanan AI.', 502)
    }

    let payload: GeminiResponse

    try {
      payload = await response.json<GeminiResponse>()
    } catch {
      throw new GatewayError('Layanan AI mengembalikan respons yang tidak valid.', 502)
    }

    const result = extractText(payload)
    if (!result) {
      throw new GatewayError('Layanan AI tidak menghasilkan jawaban.', 502)
    }

    return result
  }
})
