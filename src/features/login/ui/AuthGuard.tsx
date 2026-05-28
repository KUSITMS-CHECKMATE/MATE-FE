import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getToken } from '@/shared/api/client'
import { ROUTES } from '@/shared/constants/routes'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!getToken()) {
      navigate({ to: ROUTES.HOME })
    }
  }, [navigate])

  if (!getToken()) return null

  return <>{children}</>
}
