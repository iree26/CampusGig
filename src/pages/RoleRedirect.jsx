import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RoleRedirect() {
  const { userRole, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (userRole === 'artisan') {
        navigate('/artisan-dashboard', { replace: true })
      } else if (userRole === 'client') {
        navigate('/home', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
  }, [userRole, loading])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin w-8 h-8 text-blue-900" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-gray-500 text-sm font-medium">Taking you to your dashboard...</p>
      </div>
    </div>
  )
}

export default RoleRedirect