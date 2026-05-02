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

    
}