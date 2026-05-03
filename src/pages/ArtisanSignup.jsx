import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, auth, storage } from '../firebase/firebase'
import { motion, AnimatePresence } from 'framer-motion'


function ArtisanSignup() {
    const navigate = useNavigate()
  
    const [form, setForm] = useState({
      name: "",
      faculty: "",
      department: "",
      trade: "",
      experience: "",
      priceMin: "",
      priceMax: "",
      matricNumber: "",
    })
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
  
    const faculties = [
      "Engineering", "Sciences", "Arts", "Social Sciences",
      "Law", "Education", "Medicine", "Agriculture",
      "Management Sciences", "Environmental Sciences",
    ]
  
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
      }

      const handlePhoto = (e) => {
        const file = e.target.files[0]
        if (file) {
          setPhoto(file)
          setPhotoPreview(URL.createObjectURL(file))
        }
      }
    
      const handleSubmit = async () => {
        if (!form.name || !form.faculty || !form.department || !form.trade || !form.experience || !form.priceMin || !form.priceMax) {
          setError("Please fill in all required fields.")
          return
        }
        setLoading(true)
        setError("")
        try {
          const user = auth.currentUser
    
          // Upload photo if one was selected
          let photoURL = ""
          if (photo) {
            const photoRef = ref(storage, `artisans/${user.uid}/photo`)
            await uploadBytes(photoRef, photo)
            photoURL = await getDownloadURL(photoRef)
          }
    
          // Save artisan document to Firestore
          await setDoc(doc(db, 'artisans', user.uid), {
            uid: user.uid,
            name: form.name,
            phone: user.phoneNumber,
            faculty: form.faculty,
            department: form.department,
            trade: form.trade,
            experience: Number(form.experience),
            priceMin: Number(form.priceMin),
            priceMax: Number(form.priceMax),
            matricNumber: form.matricNumber,
            photoURL,
            available: true,
            rating: 0,
            reviewCount: 0,
            role: 'artisan',
            createdAt: new Date(),
          })
          navigate('/artisan-dashboard')
        } catch (err) {
          setError("Something went wrong. Please try again.")
        }
        setLoading(false)
      }