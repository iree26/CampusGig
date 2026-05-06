import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ArtisanCard from '../components/ArtisanCard'


function Home() {
    const navigate = useNavigate()
    const [artisans, setArtisans] = useState([])
    const [filtered, setFiltered] = useState([])
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")
    const [loading, setLoading] = useState(true)
  
    const categories = [
      "All",
      "Barber / Hair Stylist",
      "Gadget Repairer",
      "Tailor / Fashion Designer",
      "Photographer",
      "Makeup Artist",
      "Handyman / Room Repairs",
      "Fan & Appliance Repairer",
      "Laundry / Dry Cleaning",
      "Graphic Designer",
    ]

    useEffect(() => {
        const fetchArtisans = async () => {
          try {
            const q = query(
              collection(db, 'artisans'),
              where('available', '==', true)
            )
            const snapshot = await getDocs(q)
            const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
            setArtisans(data)
            setFiltered(data)
          } catch (err) {
            console.error("Failed to fetch artisans", err)
          }
          setLoading(false)
        }
        fetchArtisans()
      }, [])


      useEffect(() => {
        let result = artisans
    
        if (activeCategory !== "All") {
          result = result.filter(a => a.trade === activeCategory)
        }
    
        if (search.trim()) {
          const term = search.toLowerCase()
          result = result.filter(a =>
            a.name.toLowerCase().includes(term) ||
            a.trade.toLowerCase().includes(term) ||
            a.department.toLowerCase().includes(term) ||
            a.faculty.toLowerCase().includes(term)
          )
        }
    
        setFiltered(result)
      }, [search, activeCategory, artisans])

      