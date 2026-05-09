import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ClientSignup from './pages/ClientSignup'
import ArtisanSignup from './pages/ArtisanSignup'
import RoleRedirect from './pages/RoleRedirect'
import ProtectedRoute from './components/ProtectedRoute'
import ArtisanDashboard from './pages/ArtisanDashboard'
import EditProfile from './pages/EditProfile'
import Home from './pages/Home'
import ArtisanProfile from './pages/ArtisanProfile'
import ChatThread from './pages/ChatThread'





function App() {
  return (
    <Routes>
      {/* Public routes — anyone can visit */}
      <Route path="/login" element={<Login />} />
      <Route path="/client-signup" element={<ClientSignup />} />
      <Route path="/artisan-signup" element={<ArtisanSignup />} />

      {/* After login, figure out where to send the user */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Protected — only clients */}
      <Route path="/home" element={
        <ProtectedRoute allowedRole="client">
          <div className="p-8 text-2xl font-bold text-blue-900">Home Screen — coming soon</div>
        </ProtectedRoute>
      } />

      <Route path="/artisan/:id" element={
        <ProtectedRoute>
          <ArtisanProfile />
        </ProtectedRoute>
      } />

      <Route path="/chat/:id" element={
        <ProtectedRoute>
          <ChatThread />
        </ProtectedRoute>
      } />


      <Route path="/home" element={
        <ProtectedRoute allowedRole="client">
          <Home />
        </ProtectedRoute>
      } />

      {/* Protected — only artisans */}
      <Route path="/artisan-dashboard" element={
        <ProtectedRoute allowedRole="artisan">
          <div className="p-8 text-2xl font-bold text-blue-900">Artisan Dashboard — coming soon</div>
        </ProtectedRoute>
      } />

      {/* Protected — both roles */}
      <Route path="/artisan-dashboard" element={
        <ProtectedRoute allowedRole="artisan">
          <ArtisanDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/edit-profile" element={
        <ProtectedRoute allowedRole="artisan">
          <EditProfile />
        </ProtectedRoute>
      } />

      <Route path="/chat/:threadId" element={
        <ProtectedRoute>
          <div className="p-8">Chat — coming soon</div>
        </ProtectedRoute>
      } />
      <Route path="/inbox" element={
        <ProtectedRoute>
          <div className="p-8">Inbox — coming soon</div>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App