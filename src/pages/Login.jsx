import { useState } from 'react'
import { auth } from '../firebase/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { motion, AnimatePresence } from 'framer-motion'

function Login() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState("phone")
  const [confirmObj, setConfirmObj] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const sendOTP = async () => {
    setLoading(true)
    setError("")
    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      })
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha)
      setConfirmObj(confirmation)
      setStep("otp")
    } catch (err) {
      setError("Failed to send OTP. Check the number and try again.")
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    setLoading(true)
    setError("")
    try {
      await confirmObj.confirm(otp)
    } catch (err) {
      setError("Wrong code. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex w-1/2 bg-blue-900 flex-col justify-between p-12 relative overflow-hidden"
      >
        {/* Background circles */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-72 h-72 bg-blue-800 rounded-full -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-800 rounded-full translate-y-1/2 -translate-x-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-10 flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-blue-900 font-black text-sm">CG</span>
          </div>
          <span className="text-white font-bold text-xl">CampusGig</span>
        </motion.div>

        {/* Centre text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10"
        >
          <h2 className="text-white text-4xl font-extrabold leading-tight mb-4">
            Your campus.<br />
            Your skills.<br />
            <span className="text-yellow-400">Your market.</span>
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Connect with skilled artisans on your campus —
            barbers, gadget repairers, tailors and more.
            Verified reviews, real-time availability, one-tap contact.
          </p>
        </motion.div>

        {/* Bottom icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="relative z-10 flex gap-8"
        >
          {[["🔧", "Artisans"], ["⭐", "Reviews"], ["💬", "Chat"]].map(([icon, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-blue-200 text-xs">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center bg-gray-50 p-6"
      >
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-8 md:hidden"
          >
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400 font-black text-sm">CG</span>
            </div>
            <span className="text-blue-900 font-bold text-xl">CampusGig</span>
          </motion.div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                {step === "phone" ? "Welcome back 👋" : "Check your phone 📱"}
              </h1>
              <p className="text-gray-500 text-sm">
                {step === "phone"
                  ? "Enter your phone number to sign in or create an account"
                  : `We sent a 6-digit code to ${phone}`}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold">
                1
              </div>
              <span className={`text-xs font-semibold ${step === "phone" ? "text-blue-900" : "text-gray-400"}`}>
                Phone Number
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ backgroundColor: step === "otp" ? "#1e3a8a" : "#e5e7eb" }}
                transition={{ duration: 0.3 }}
                className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ color: step === "otp" ? "#fff" : "#9ca3af" }}
              >
                2
              </motion.div>
              <span className={`text-xs font-semibold ${step === "otp" ? "text-blue-900" : "text-gray-400"}`}>
                Verify OTP
              </span>
            </div>
          </div>

          {/* Form steps */}
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white mb-4 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <div className="bg-gray-50 border-r border-gray-300 px-3 py-3 text-sm text-gray-500 font-medium">
                    🇳🇬 +234
                  </div>
                  <input
                    type="tel"
                    placeholder="800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 py-3 text-sm outline-none bg-white"
                  />
                </div>
                <div id="recaptcha-container" />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={sendOTP}
                  disabled={loading || !phone}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : "Send OTP →"}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  6-Digit Code
                </label>
                <input
                  type="number"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-center tracking-widest text-lg bg-white"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={verifyOTP}
                  disabled={loading || otp.length < 6}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors mb-3"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Verifying...
                    </span>
                  ) : "Verify & Sign In →"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("phone")}
                  className="w-full text-gray-500 text-sm hover:text-blue-900 transition-colors"
                >
                  ← Change phone number
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <p className="text-red-600 text-sm text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign up link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            New to CampusGig?{" "}
            <a href="/client-signup" className="text-blue-900 font-bold hover:underline">
              Create an account
            </a>
          </motion.p>

        </div>
      </motion.div>
    </div>
  )
}

export default Login