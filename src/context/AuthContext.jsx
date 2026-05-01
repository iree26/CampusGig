import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if they are a client or artisan in Firestore
        const clientDoc = await getDoc(doc(db, 'users', user.uid))
        const artisanDoc = await getDoc(doc(db, 'artisans', user.uid))

        if (clientDoc.exists()) {
          setUserRole('client')
          setCurrentUser({ ...user, ...clientDoc.data() })
        } else if (artisanDoc.exists()) {
          setUserRole('artisan')
          setCurrentUser({ ...user, ...artisanDoc.data() })
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
