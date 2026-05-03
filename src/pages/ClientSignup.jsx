import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"
import {db, auth} from "../firebase/firebase"
import { motion, AnimatePresence } from 'framer-motion'


function ClientSignup() {
    const navigate = useNavigate()
  
    const [form, setForm] = useState({
      name: "",
      faculty: "",
      department: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
  
    const faculties = [
      "Engineering",
      "Sciences",
      "Arts",
      "Social Sciences",
      "Law",
      "Education",
      "Medicine",
      "Agriculture",
      "Management Sciences",
      "Environmental Sciences",
    ]

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
      }

      const handleSubmit = async () => {
        if (!form.name || !form.faculty || !form.department) {
          setError("Please fill in all fields.")
          return
        }
        setLoading(true)
        setError("")
        try {
          const user = auth.currentUser
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: form.name,
            phone: user.phoneNumber,
            faculty: form.faculty,
            department: form.department,
            role: 'client',
            createdAt: new Date(),
          })
          navigate('/home')
        } catch (err) {
          setError("Something went wrong. Please try again.")
        }
        setLoading(false)
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-black text-sm">CG</span>
              </div>
              <span className="text-blue-900 font-bold text-xl">CampusGig</span>
            </div>
    
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              Create your account 🎓
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Sign up as a student looking to hire campus artisans
            </p>
    
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Ireoluwa Oyetibo"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
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
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Department
              </label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Electrical & Electronics Engineering"
                value={form.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
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
                  Saving...
                </span>
              ) : "Create Account →"}
            </motion.button>
    
            {/* Already have account */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-blue-900 font-bold hover:underline">
                Sign in
              </a>
            </p>
    
            {/* Artisan link */}
            <p className="text-center text-gray-400 text-xs mt-3">
              Signing up as an artisan?{" "}
              <a href="/artisan-signup" className="text-blue-700 font-semibold hover:underline">
                Artisan sign-up
              </a>
            </p>
    
          </motion.div>
        </div>
      )
    }
    
    export default ClientSignup