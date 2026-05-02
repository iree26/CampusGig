import { useState } from "react"
import { auth } from "../firebase/firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"

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
        <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
    
            <h1 className="text-2xl font-bold text-blue-900 mb-1">CampusGig</h1>
            <p className="text-gray-500 text-sm mb-6">
              {step === "phone" ? "Enter your phone number to continue" : "Enter the OTP sent to your phone"}
            </p>
    
            {step === "phone" ? (
              <>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:border-blue-600"
                />
                <div id="recaptcha-container"></div>
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-800"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="number"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:border-blue-600"
                />
                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-800"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
    
            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}
    
          </div>
        </div>
      )
    }
    
    export default Login 

    
      

    
