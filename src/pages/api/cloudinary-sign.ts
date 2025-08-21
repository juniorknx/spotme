import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

const API_SECRET = process.env.CLOUDINARY_API_SECRET!
const API_KEY = process.env.CLOUDINARY_API_KEY!
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || '' 

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    const timestamp = Math.floor(Date.now() / 1000)

    const toSign = UPLOAD_PRESET
        ? `timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}${API_SECRET}`
        : `timestamp=${timestamp}${API_SECRET}`

    const signature = crypto.createHash('sha1').update(toSign).digest('hex')

    return res.status(200).json({
        timestamp,
        signature,
        cloudName: CLOUD_NAME,
        apiKey: API_KEY,
        uploadPreset: UPLOAD_PRESET || undefined,
    })
}
