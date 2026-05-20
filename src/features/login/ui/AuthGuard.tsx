import { useEffect, useState } from 'react'
import { appLogin } from '@apps-in-toss/web-framework'
import { Button, Text } from '@toss/tds-mobile'
import { adaptive } from '@toss/tds-colors'
import { loginWithToss, type ApiResponseTossLoginResponse } from '@/shared/api/generated/auth'
import { setToken } from '@/shared/api/client'

type AuthStatus = 'pending' | 'authenticated' | 'error'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [status, setStatus] = useState<AuthStatus>('pending')
  const [error, setError] = useState<string | null>(null)

  async function login() {
    setStatus('pending')
    setError(null)
    try {
      const { authorizationCode, referrer } = await appLogin()
      const res = await loginWithToss({ authorizationCode, referrer })
      const body = res as unknown as ApiResponseTossLoginResponse
      const token = body.data?.accessToken
      if (!token) throw new Error('토큰을 받지 못했습니다.')
      setToken(token)
      setStatus('authenticated')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  useEffect(() => {
    login()
  }, [])

  if (status === 'authenticated') return <>{children}</>

  if (status === 'error') {
    return (
      <div className="flex flex-col gap-5 px-5 pt-20">
        <Text display="block" color="#D6293E" typography="t6" fontWeight="bold">
          로그인 실패
        </Text>
        <Text display="block" color={adaptive.grey700} typography="t7" fontWeight="regular">
          {error}
        </Text>
        <Button size="medium" display="block" color="primary" onClick={login}>
          다시 시도
        </Button>
      </div>
    )
  }

  // pending: appLogin() 호출 중 — Toss 동의 화면이 네이티브로 뜨므로 빈 화면 유지
  return null
}
