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

      