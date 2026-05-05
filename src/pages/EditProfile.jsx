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


      const handleSave = async () => {
        if (!form.name || !form.trade || !form.faculty || !form.department) {
          setError("Please fill in all required fields.")
          return
        }
        setSaving(true)
        setError("")
        setSuccess(false)
        try {
          let photoURL = photoPreview
    
          // Only upload if a new photo was selected
          if (photo) {
            const photoRef = ref(storage, `artisans/${currentUser.uid}/photo`)
            await uploadBytes(photoRef, photo)
            photoURL = await getDownloadURL(photoRef)
          }
    
          await updateDoc(doc(db, 'artisans', currentUser.uid), {
            name: form.name,
            trade: form.trade,
            faculty: form.faculty,
            department: form.department,
            experience: Number(form.experience),
            priceMin: Number(form.priceMin),
            priceMax: Number(form.priceMax),
            matricNumber: form.matricNumber,
            photoURL,
          })
          setSuccess(true)
          setTimeout(() => navigate('/artisan-dashboard'), 1500)
        } catch (err) {
          setError("Something went wrong. Please try again.")
        }
        setSaving(false)
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
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/artisan-dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back
            </motion.button>
            <h1 className="text-gray-900 font-bold text-lg">Edit Profile</h1>
          </div>
    
          <div className="max-w-lg mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
    
              {/* Photo upload */}
              <div className="flex flex-col items-center mb-8">
                <div
                  onClick={() => document.getElementById('photoInput').click()}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center cursor-pointer overflow-hidden bg-blue-50 hover:bg-blue-100 transition-colors mb-2"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📷</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {photoPreview ? "Tap to change photo" : "Tap to upload photo"}
                </p>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />
              </div>
    
              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
    
              {/* Trade */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Skill / Trade
                </label>
                <select
                  name="trade"
                  value={form.trade}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select your skill</option>
                  {trades.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
    
              {/* Faculty */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Faculty
                </label>
                <select
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select faculty</option>
                  {faculties.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
    
              {/* Department */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
    
              {/* Experience */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
    
              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Price Range (₦)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="priceMin"
                    placeholder="Min"
                    value={form.priceMin}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <input
                    type="number"
                    name="priceMax"
                    placeholder="Max"
                    value={form.priceMax}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
    
              {/* Matric Number */}
              <div className="mb-8">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Matric Number{" "}
                  <span className="text-gray-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="matricNumber"
                  value={form.matricNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
    
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                  >
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
    
              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
                  >
                    <p className="text-green-700 text-sm text-center font-semibold">
                      ✅ Profile updated! Taking you back...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
    
              {/* Save button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-colors"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Saving...
                  </span>
                ) : "Save Changes →"}
              </motion.button>
    
            </motion.div>
          </div>
        </div>
      )
    }
    
    export default EditProfile      