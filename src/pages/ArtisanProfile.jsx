import { useState, useEffect } from 'react'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase/firebase'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function ArtisanProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
  
    const [artisan, setArtisan] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch artisan document
            const artisanSnap = await getDoc(doc(db, 'artisans', id))
            if (!artisanSnap.exists()) {
              setNotFound(true)
              setLoading(false)
              return
            }
            setArtisan({ id: artisanSnap.id, ...artisanSnap.data() })
    
            // Fetch their reviews subcollection
            const reviewsSnap = await getDocs(
              collection(db, 'artisans', id, 'reviews')
            )
            const reviewList = reviewsSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            // Sort by newest first
            reviewList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
            setReviews(reviewList)
          } catch (err) {
            console.error("Failed to fetch artisan", err)
          }
          setLoading(false)
        }
        fetchData()
      }, [id])

      const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}>
            ★
          </span>
        ))
      }

      const handleMessage = async () => {
        navigate(`/chat/${id}`)
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
    
      if (notFound) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
            <span className="text-5xl">🔍</span>
            <h2 className="font-bold text-gray-900">Artisan not found</h2>
            <button
              onClick={() => navigate('/home')}
              className="text-blue-900 font-semibold text-sm hover:underline"
            >
              ← Back to search
            </button>
          </div>
        )
      }

      return (
        <div className="min-h-screen bg-gray-50">
    
          {/* ── TOP NAV ── */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="text-gray-400 hover:text-gray-600 transition-colors font-medium"
            >
              ←
            </motion.button>
            <h1 className="font-bold text-gray-900 text-lg flex-1 truncate">
              {artisan.name}
            </h1>
          </div>
    
          <div className="max-w-2xl mx-auto px-6 py-6">
    
            {/* ── PROFILE HEADER ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4"
            >
              <div className="flex items-start gap-4">
                {/* Photo */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {artisan.photoURL ? (
                    <img src={artisan.photoURL} alt={artisan.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🔧</span>
                  )}
                </div>
    
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-extrabold text-gray-900 text-xl">{artisan.name}</h2>
                      <p className="text-blue-700 font-semibold text-sm">{artisan.trade}</p>
                    </div>
                    {/* Availability badge */}
                    <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full
                      ${artisan.available
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-600 border border-red-200'}`}
                    >
                      {artisan.available ? '🟢 Available' : '🔴 Busy'}
                    </span>
                  </div>
    
                  <p className="text-gray-400 text-xs mt-1">
                    {artisan.faculty} — {artisan.department}
                  </p>
    
                  {/* Stars */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-sm">
                      {renderStars(artisan.rating || 0)}
                    </div>
                    <span className="text-gray-600 text-xs font-medium">
                      {artisan.rating > 0 ? artisan.rating.toFixed(1) : "No ratings yet"}
                    </span>
                    {artisan.reviewCount > 0 && (
                      <span className="text-gray-400 text-xs">
                        ({artisan.reviewCount} review{artisan.reviewCount > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                </div>
              </div>
    
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">Price Range</p>
                  <p className="font-bold text-gray-900 text-sm">
                    ₦{artisan.priceMin?.toLocaleString()} — ₦{artisan.priceMax?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">Experience</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {artisan.experience} year{artisan.experience !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </motion.div>
    
            {/* ── ACTION BUTTONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-2 gap-3 mb-4"
            >
              {/* Message */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMessage}
                className="bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>💬</span>
                <span>Message</span>
              </motion.button>
    
              {/* Call */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href={`tel:${artisan.phone}`}
                className="bg-white hover:bg-gray-50 text-blue-900 border-2 border-blue-900 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>📞</span>
                <span>Call</span>
              </motion.a>
            </motion.div>
    
            {/* ── REVIEWS ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">
                Reviews ({reviews.length})
              </h3>
    
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-3xl">⭐</span>
                  <p className="text-gray-400 text-sm mt-2">No reviews yet</p>
                  <p className="text-gray-300 text-xs mt-1">
                    Be the first to leave a review after your job
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`pb-4 ${i < reviews.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {review.authorName}
                        </p>
                        <div className="flex text-xs">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                      {review.createdAt && (
                        <p className="text-gray-300 text-xs mt-1">
                          {new Date(review.createdAt.seconds * 1000).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
    
          </div>
        </div>
      )
    }
    
    export default ArtisanProfile
