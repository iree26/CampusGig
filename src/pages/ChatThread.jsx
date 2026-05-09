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

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
    
          {/* ── TOP NAV ── */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              ←
            </motion.button>
    
            {/* Artisan info */}
            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
              {artisan?.photoURL ? (
                <img src={artisan.photoURL} alt={artisan.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">🔧</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{artisan?.name}</p>
              <p className="text-gray-400 text-xs truncate">{artisan?.trade}</p>
            </div>
    
            {/* Call button */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${artisan?.phone}`}
              className="flex items-center gap-1.5 bg-blue-900 text-white px-3 py-2 rounded-xl text-xs font-bold"
            >
              <span>📞</span>
              <span>Call</span>
            </motion.a>
          </div>
    
          {/* ── MESSAGES ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
    
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center flex-1 py-20 text-center"
              >
                <span className="text-4xl mb-3">💬</span>
                <p className="text-gray-500 font-semibold text-sm">Start the conversation</p>
                <p className="text-gray-400 text-xs mt-1">
                  Agree on price and timing before committing
                </p>
              </motion.div>
            )}
    
            {messages.map((msg, i) => {
              const isMe = msg.senderUID === currentUser.uid
              const time = msg.createdAt?.seconds
                ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString('en-NG', {
                    hour: '2-digit', minute: '2-digit'
                  })
                : ""
    
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i < 5 ? i * 0.03 : 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl
                    ${isMe
                      ? 'bg-blue-900 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm shadow-sm'}`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-blue-300' : 'text-gray-400'}`}>
                      {time}
                    </p>
                  </div>
                </motion.div>
              )
            })}
    
            {/* Invisible scroll target */}
            <div ref={bottomRef} />
          </div>
    
          {/* ── INPUT BAR ── */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 sticky bottom-0">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm outline-none resize-none text-gray-900 placeholder-gray-400 max-h-28"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                disabled={!text.trim() || sending}
                className="w-11 h-11 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors"
              >
                {sending ? (
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <span className="text-white text-sm">➤</span>
                )}
              </motion.button>
            </div>
            <p className="text-gray-300 text-xs text-center mt-2">
              Press Enter to send
            </p>
          </div>
    
        </div>
      )
    }
    
    export default ChatThread