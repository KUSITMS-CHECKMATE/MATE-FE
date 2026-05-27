import { useEffect, useState } from 'react'
import { appLogin } from '@apps-in-toss/web-framework'
import { loginWithToss } from '@/shared/api/generated/auth'
import { setToken, setRefreshToken } from '@/shared/api/client'

type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [status, setStatus] = useState<AuthStatus>('pending')

  useEffect(() => {
    async function login() {
      try {
        const { authorizationCode, referrer } = await appLogin()
        const { data: body } = await loginWithToss({ authorizationCode, referrer })
        const token = body.data?.accessToken
        const refreshToken = body.data?.refreshToken
        if (!token) throw new Error('토큰을 받지 못했습니다.')
        setToken(token)
        if (refreshToken) setRefreshToken(refreshToken)
        setStatus('authenticated')
      } catch {
        setStatus('unauthenticated')
      }
    }
    login()
  }, [])

  if (status === 'pending') return null

  return <>{children}</>
}
