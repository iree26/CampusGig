import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ArtisanCard from '../components/ArtisanCard'


function Home() {
    const navigate = useNavigate()
    const [artisans, setArtisans] = useState([])
    const [filtered, setFiltered] = useState([])
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")
    const [loading, setLoading] = useState(true)
  
    const categories = [
      "All",
      "Barber / Hair Stylist",
      "Gadget Repairer",
      "Tailor / Fashion Designer",
      "Photographer",
      "Makeup Artist",
      "Handyman / Room Repairs",
      "Fan & Appliance Repairer",
      "Laundry / Dry Cleaning",
      "Graphic Designer",
    ]

    useEffect(() => {
        const fetchArtisans = async () => {
          try {
            const q = query(
              collection(db, 'artisans'),
              where('available', '==', true)
            )
            const snapshot = await getDocs(q)
            const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
            setArtisans(data)
            setFiltered(data)
          } catch (err) {
            console.error("Failed to fetch artisans", err)
          }
          setLoading(false)
        }
        fetchArtisans()
      }, [])


      useEffect(() => {
        let result = artisans
    
        if (activeCategory !== "All") {
          result = result.filter(a => a.trade === activeCategory)
        }
    
        if (search.trim()) {
          const term = search.toLowerCase()
          result = result.filter(a =>
            a.name.toLowerCase().includes(term) ||
            a.trade.toLowerCase().includes(term) ||
            a.department.toLowerCase().includes(term) ||
            a.faculty.toLowerCase().includes(term)
          )
        }
    
        setFiltered(result)
      }, [search, activeCategory, artisans])

      return (
        <div className="min-h-screen bg-gray-50">
    
          {/* ── TOP BAR ── */}
          <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-4 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 font-black text-xs">CG</span>
                  </div>
                  <span className="text-blue-900 font-bold">CampusGig</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Find a campus artisan</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => auth.signOut()}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Sign out
              </motion.button>
            </div>
    
            {/* Search bar */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <span className="text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by name, skill, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
    
          {/* ── CATEGORY CHIPS ── */}
          <div className="px-6 py-4 overflow-x-auto">
            <div className="flex gap-2 w-max">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors
                    ${activeCategory === cat
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
    
          {/* ── RESULTS ── */}
          <div className="px-6 pb-24">
    
            {/* Result count */}
            {!loading && (
              <p className="text-gray-400 text-xs mb-4 font-medium">
                {filtered.length} artisan{filtered.length !== 1 ? 's' : ''} found
              </p>
            )}
    
            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="flex justify-between">
                      <div className="h-2 bg-gray-200 rounded w-1/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
    
            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="font-bold text-gray-900 mb-1">No artisans found</h3>
                <p className="text-gray-400 text-sm">
                  Try a different search or category
                </p>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("All") }}
                  className="mt-4 text-blue-900 text-sm font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
    
            {/* Artisan grid */}
            {!loading && filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-4"
              >
                {filtered.map((artisan, i) => (
                  <motion.div
                    key={artisan.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ArtisanCard artisan={artisan} />
                  </motion.div>
                ))}
              </motion.div>
            )}
    
          </div>
        </div>
      )
    }
    
    export default Home