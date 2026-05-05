import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, auth, storage } from '../firebase/firebase'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function EditProfile() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
  
    const [form, setForm] = useState({
      name: "",
      trade: "",
      faculty: "",
      department: "",
      experience: "",
      priceMin: "",
      priceMax: "",
      matricNumber: "",
    })
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
  
    const trades = [
      "Barber / Hair Stylist",
      "Gadget Repairer",
      "Tailor / Fashion Designer",
      "Photographer",
      "Makeup Artist",
      "Handyman / Room Repairs",
      "Fan & Appliance Repairer",
      "Laundry / Dry Cleaning",
      "Graphic Designer",
      "Caricature / Artist",
      "Other",
    ]
  
    const faculties = [
      "Engineering", "Sciences", "Arts", "Social Sciences",
      "Law", "Education", "Medicine", "Agriculture",
      "Management Sciences", "Environmental Sciences",
    ]

    useEffect(() => {
        const fetchData = async () => {
          if (!currentUser) return
          const snap = await getDoc(doc(db, 'artisans', currentUser.uid))
          if (snap.exists()) {
            const data = snap.data()
            setForm({
              name: data.name || "",
              trade: data.trade || "",
              faculty: data.faculty || "",
              department: data.department || "",
              experience: data.experience || "",
              priceMin: data.priceMin || "",
              priceMax: data.priceMax || "",
              matricNumber: data.matricNumber || "",
            })
            setPhotoPreview(data.photoURL || null)
          }
          setLoading(false)
        }
        fetchData()
      }, [currentUser])
      
        