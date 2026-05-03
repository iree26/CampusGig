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