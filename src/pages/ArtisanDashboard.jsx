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


    s