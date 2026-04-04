import ky from 'ky'

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
})
