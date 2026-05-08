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
