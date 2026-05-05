import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/firebase'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'


function ArtisanDashboard() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [artisan, setArtisan] = useState(null)
    const [loading, setLoading] = useState(true)
    const [toggling, setToggling] = useState(false)

    useEffect(() => {
        if (!currentUser) return
    
        const artisanRef = doc(db, 'artisans', currentUser.uid)
        const unsubscribe = onSnapshot(artisanRef, (snapshot) => {
          if (snapshot.exists()) {
            setArtisan(snapshot.data())
          }
          setLoading(false)
        })
    
        return () => unsubscribe()
      }, [currentUser])


      const toggleAvailability = async () => {
        if (!artisan || toggling) return
        setToggling(true)
        try {
          await updateDoc(doc(db, 'artisans', currentUser.uid), {
            available: !artisan.available
          })
        } catch (err) {
          console.error("Failed to update availability", err)
        }
        setToggling(false)
      }

      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <svg className="animate-spin w-8 h-8 text-blue-900" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )
      }

      return (
        <div className="min-h-screen bg-gray-50">
    
          {/* ── TOP NAV ── */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-black text-sm">CG</span>
              </div>
              <span className="text-blue-900 font-bold text-lg">CampusGig</span>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              Sign out
            </button>
          </div>
    
          <div className="max-w-2xl mx-auto px-6 py-8">
    
            {/* ── GREETING ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-extrabold text-gray-900">
                Hi, {artisan?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Here's your artisan overview
              </p>
            </motion.div>
    
            {/* ── PROFILE CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4"
            >
              <div className="flex items-center gap-4">
                {/* Photo */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {artisan?.photoURL ? (
                    <img src={artisan.photoURL} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🔧</span>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 text-lg">{artisan?.name}</h2>
                  <p className="text-blue-700 text-sm font-semibold">{artisan?.trade}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {artisan?.faculty} — {artisan?.department}
                  </p>
                </div>
                {/* Edit button */}
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="text-xs text-blue-900 font-semibold border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            </motion.div>
    
            {/* ── AVAILABILITY TOGGLE ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Availability</h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {artisan?.available
                      ? "You are visible to students right now"
                      : "You are hidden from search results"}
                  </p>
                </div>
                {/* Toggle switch */}
                <motion.button
                  onClick={toggleAvailability}
                  disabled={toggling}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none
                    ${artisan?.available ? 'bg-blue-900' : 'bg-gray-300'}`}
                >
                  <motion.div
                    animate={{ x: artisan?.available ? 28 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                  />
                </motion.button>
              </div>
    
              {/* Status badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={artisan?.available ? 'available' : 'busy'}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`mt-4 rounded-xl px-4 py-2 text-xs font-semibold text-center
                    ${artisan?.available
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-600 border border-red-200'}`}
                >
                  {artisan?.available ? '🟢 Available — students can find and message you' : '🔴 Busy — you are hidden from all searches'}
                </motion.div>
              </AnimatePresence>
            </motion.div>
    
            {/* ── STATS ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 mb-4"
            >
              {[
                { label: "Rating", value: artisan?.rating > 0 ? `${artisan.rating.toFixed(1)} ⭐` : "No ratings yet", },
                { label: "Reviews", value: artisan?.reviewCount ?? 0 },
                { label: "Price", value: `₦${artisan?.priceMin?.toLocaleString()} — ₦${artisan?.priceMax?.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className="text-gray-900 font-bold text-sm">{value}</p>
                </div>
              ))}
            </motion.div>
    
            {/* ── QUICK LINKS ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {[
                { icon: "💬", label: "Messages", sub: "View your chat inbox", path: "/inbox" },
                { icon: "✏️", label: "Edit Profile", sub: "Update your trade, price, photo", path: "/edit-profile" },
              ].map(({ icon, label, sub, path }, i) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left
                    ${i > 0 ? 'border-t border-gray-100' : ''}`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                    <p className="text-gray-400 text-xs">{sub}</p>
                  </div>
                  <span className="text-gray-300 text-lg">›</span>
                </motion.button>
              ))}
            </motion.div>
    
          </div>
        </div>
      )
    }
    
    export default ArtisanDashboard  