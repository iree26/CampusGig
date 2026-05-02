import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/client-signup" element={<div>Client Signup</div>} />
      <Route path="/artisan-signup" element={<div>Artisan Signup</div>} />
      <Route path="/artisan-dashboard" element={<div>Artisan Dashboard</div>} />
      <Route path="/artisan/:id" element={<div>Artisan Profile</div>} />
      <Route path="/chat/:threadId" element={<div>Chat</div>} />
      <Route path="/inbox" element={<div>Inbox</div>} />
    </Routes>
  )
}

export default App