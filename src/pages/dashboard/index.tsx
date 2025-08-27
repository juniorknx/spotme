import PrivateRoute from '@/components/PrivateRoute/PrivateRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useLocation } from '@/contexts/LocationContext'
import React from 'react'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { location } = useLocation()

  console.log(location)
  return (
    <>
      <PrivateRoute>
        <div>
          <h1>Dashboard</h1>
          <span>Hello {user?.displayName}</span>
          <span>Você está em: { location.latitude }</span>
          <button onClick={logout}>sair</button>
        </div>
      </PrivateRoute>
    </>
  )
}
