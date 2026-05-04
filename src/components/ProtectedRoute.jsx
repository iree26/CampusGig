import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, userRole, loading } = useAuth()

  // Still checking who is logged in — show nothing yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-blue-900" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in — send to login
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role — send to login
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />
  }

  // All good — show the page
  return children
}

export default ProtectedRoute