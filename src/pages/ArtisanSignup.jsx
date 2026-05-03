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

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-black text-sm">CG</span>
              </div>
              <span className="text-blue-900 font-bold text-xl">CampusGig</span>
            </div>
    
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              Artisan Sign Up 🔧
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Create your artisan profile and start getting discovered on campus
            </p>
    
            {/* Photo Upload */}
            <div className="mb-6 flex flex-col items-center">
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
                {photoPreview ? "Tap to change photo" : "Tap to upload profile photo"}
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
                placeholder="e.g. Akin Adeyemi"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
    
            {/* Trade */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Your Skill / Trade
              </label>
              <select
                name="trade"
                value={form.trade}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-700"
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-700"
              >
                <option value="">Select your faculty</option>
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
                placeholder="e.g. Botany"
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
                placeholder="e.g. 2"
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
                  placeholder="Min e.g. 1000"
                  value={form.priceMin}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <input
                  type="number"
                  name="priceMax"
                  placeholder="Max e.g. 5000"
                  value={form.priceMax}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
    
            {/* Matric Number (optional) */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Matric Number{" "}
                <span className="text-gray-400 normal-case font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="matricNumber"
                placeholder="e.g. 190404001"
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
    
            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating Profile...
                </span>
              ) : "Create Artisan Profile →"}
            </motion.button>
    
            {/* Links */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-blue-900 font-bold hover:underline">Sign in</a>
            </p>
            <p className="text-center text-gray-400 text-xs mt-3">
              Signing up as a client?{" "}
              <a href="/client-signup" className="text-blue-700 font-semibold hover:underline">
                Client sign-up
              </a>
            </p>
    
          </motion.div>
        </div>
      )
    }
    
    export default ArtisanSignup