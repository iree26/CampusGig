import { useState, useEffect, useRef } from 'react'
import {
  doc, collection, addDoc, onSnapshot,
  query, orderBy, getDoc, setDoc, serverTimestamp, updateDoc
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion' 