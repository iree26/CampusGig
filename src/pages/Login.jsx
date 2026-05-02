import { useState } from 'react'
import { auth } from '../firebase/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

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

      {/* ── LEFT PANEL (decorative) ── */}
      <div className="hidden md:flex w-1/2 bg-blue-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-800 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-800 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-400 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-black text-sm">CG</span>
            </div>
            <span className="text-white font-bold text-xl">CampusGig</span>
          </div>
        </div>

        {/* Centre text */}
        <div className="relative z-10">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Your campus.<br />
            Your skills.<br />
            <span className="text-yellow-400">Your market.</span>
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Connect with skilled artisans on your campus — 
            barbers, gadget repairers, tailors and more. 
            Verified reviews, real-time availability, one-tap contact.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8">
          {[["🔧", "Artisans"], ["⭐", "Reviews"], ["💬", "Chat"]].map(([icon, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-blue-200 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400 font-black text-sm">CG</span>
            </div>
            <span className="text-blue-900 font-bold text-xl">CampusGig</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {step === "phone" ? "Welcome back 👋" : "Check your phone 📱"}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === "phone"
                ? "Enter your phone number to sign in or create an account"
                : `We sent a 6-digit code to ${phone}`}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold">
                1
              </div>
              <span className={`text-xs font-medium ${step === "phone" ? "text-blue-900" : "text-gray-400"}`}>
                Phone Number
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold
                ${step === "otp" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-400"}`}>
                2
              </div>
              <span className={`text-xs font-medium ${step === "otp" ? "text-blue-900" : "text-gray-400"}`}>
                Verify OTP
              </span>
            </div>
          </div>

          {/* Phone step */}
          {step === "phone" && (
            <div>
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
              <button
                onClick={sendOTP}
                disabled={loading || !phone}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors"
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
              </button>
            </div>
          )}

          {/* OTP step */}
          {step === "otp" && (
            <div>
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
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors mb-3"
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
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-gray-500 text-sm hover:text-blue-900 transition-colors"
              >
                ← Change phone number
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Sign up link */}
          <p className="text-center text-gray-500 text-sm mt-8">
            New to CampusGig?{" "}
            <a href="/client-signup" className="text-blue-900 font-semibold hover:underline">
              Create an account
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login