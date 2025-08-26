import PrivateRoute from '@/components/PrivateRoute/PrivateRoute'
import { useAuth } from '@/contexts/AuthContext'
import React from 'react'

export default function Dashboard() {
  const { user } = useAuth()

  console.log(user)
  return (
    <>
      <PrivateRoute>
        <div>
          <h1>Dashboard</h1>
        </div>
      </PrivateRoute>
    </>
  )
}
