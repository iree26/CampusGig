import { useState, useEffect, useRef } from 'react'
import {
  doc, collection, addDoc, onSnapshot,
  query, orderBy, getDoc, setDoc, serverTimestamp, updateDoc
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion' 

function ChatThread() {
    const { id } = useParams()       // artisan's uid from the URL
    const { currentUser } = useAuth()
    const navigate = useNavigate()
  
    const [messages, setMessages] = useState([])
    const [artisan, setArtisan] = useState(null)
    const [chatId, setChatId] = useState(null)
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        if (!currentUser || !id) return
    
        const setup = async () => {
          try {
            // 1. Fetch artisan details (for name and phone)
            const artisanSnap = await getDoc(doc(db, 'artisans', id))
            if (artisanSnap.exists()) {
              setArtisan({ id: artisanSnap.id, ...artisanSnap.data() })
            }
    
            // 2. Create a deterministic chat ID from both UIDs
            //    Same two people always get the same chat ID
            const generatedChatId = [currentUser.uid, id].sort().join('_')
            setChatId(generatedChatId)
    
            // 3. Create the chat document if it doesn't exist yet
            const chatRef = doc(db, 'chats', generatedChatId)
            const chatSnap = await getDoc(chatRef)
            if (!chatSnap.exists()) {
              await setDoc(chatRef, {
                clientUID: currentUser.uid,
                artisanUID: id,
                createdAt: serverTimestamp(),
                lastMessageAt: serverTimestamp(),
                lastMessage: "",
              })
            }
    
            setLoading(false)
          } catch (err) {
            console.error("Chat setup failed", err)
            setLoading(false)
          }
        }
    
        setup()
      }, [currentUser, id])

      useEffect(() => {
        if (!chatId) return
    
        const messagesRef = collection(db, 'chats', chatId, 'messages')
        const q = query(messagesRef, orderBy('createdAt', 'asc'))
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setMessages(msgs)
        })
    
        return () => unsubscribe()
      }, [chatId])

      useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, [messages])

      const sendMessage = async () => {
        if (!text.trim() || sending || !chatId) return
        setSending(true)
        const messageText = text.trim()
        setText("")
    
        try {
          // Add the message to the subcollection
          await addDoc(collection(db, 'chats', chatId, 'messages'), {
            senderUID: currentUser.uid,
            text: messageText,
            createdAt: serverTimestamp(),
          })
    
          // Update the thread's last message preview
          await updateDoc(doc(db, 'chats', chatId), {
            lastMessage: messageText,
            lastMessageAt: serverTimestamp(),
          })
        } catch (err) {
          console.error("Failed to send message", err)
          setText(messageText)
        }
        setSending(false)
      }
    
      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          sendMessage()
        }
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