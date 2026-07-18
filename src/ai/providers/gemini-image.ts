import { GatewayError } from '../types'

// Current stable Nano Banana 2 model documented by Google AI on 18 July 2026.
const GEMINI_IMAGE_MODEL = 'gemini-3.1-flash-image'
const GEMINI_INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions'

type InteractionImageContent = {
  type?: string
  data?: string
  mime_type?: string
}

type InteractionResponse = {
  status?: string
  steps?: Array<{
    type?: string
    content?: InteractionImageContent[]
  }>
}

export type GeneratedImage = {
  imageBase64: string
  mimeType: string
}

const extractLastImage = (payload: InteractionResponse): GeneratedImage | null => {
  const images = payload.steps
    ?.filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content ?? [])
    .filter((content) => content.type === 'image' && typeof content.data === 'string') ?? []

  const image = images.at(-1)
  if (!image?.data) return null

  return {
    imageBase64: image.data,
    mimeType: image.mime_type?.startsWith('image/') ? image.mime_type : 'image/png'
  }
}

export const generateImageWithGemini = async (
  apiKey: string | undefined,
  prompt: string
): Promise<GeneratedImage> => {
  const credential = apiKey?.trim()
  if (!credential) throw new GatewayError('Layanan AI belum dikonfigurasi.', 503)

  let response: Response

  try {
    response = await fetch(GEMINI_INTERACTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': credential
      },
      body: JSON.stringify({
        model: GEMINI_IMAGE_MODEL,
        input: [{ type: 'text', text: prompt }],
        response_format: {
          type: 'image',
          mime_type: 'image/png',
          aspect_ratio: '1:1',
          image_size: '1K'
        },
        store: false
      })
    })
  } catch {
    throw new GatewayError('Layanan pembuatan gambar sedang tidak dapat dihubungi.', 503)
  }

  if (!response.ok) {
    if (response.status === 429 || response.status >= 500) {
      throw new GatewayError('Layanan pembuatan gambar sedang sibuk. Silakan coba lagi.', 503)
    }
    if (response.status === 401 || response.status === 403) {
      throw new GatewayError('Akses ke model pembuatan gambar ditolak. Periksa izin Gemini API key.', 502)
    }
    if (response.status === 400) {
      throw new GatewayError('Permintaan gambar ditolak oleh Gemini. Periksa prompt lalu coba lagi.', 502)
    }
    throw new GatewayError('Gambar tidak dapat dibuat oleh layanan AI.', 502)
  }

  let payload: InteractionResponse

  try {
    payload = await response.json<InteractionResponse>()
  } catch {
    throw new GatewayError('Layanan pembuatan gambar mengembalikan respons yang tidak valid.', 502)
  }

  const image = extractLastImage(payload)
  if (!image) {
    throw new GatewayError('Layanan AI tidak menghasilkan gambar. Coba ubah prompt Anda.', 502)
  }

  return image
}
