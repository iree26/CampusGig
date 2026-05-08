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
