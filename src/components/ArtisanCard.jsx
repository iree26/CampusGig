import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function ArtisanCard({ artisan }) {
  const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ y: -2, shadow: "lg" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/artisan/${artisan.uid}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Photo */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
          {artisan.photoURL ? (
            <img src={artisan.photoURL} alt={artisan.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">🔧</span>
          )}
        </div>

        {/* Name + trade */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm truncate">{artisan.name}</h3>
          <p className="text-blue-700 text-xs font-semibold">{artisan.trade}</p>
        </div>

        {/* Available badge */}
        <div className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0
          ${artisan.available
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-500'}`}>
          {artisan.available ? '● Available' : '● Busy'}
        </div>
      </div>

      {/* Faculty + dept */}
      <p className="text-gray-400 text-xs mb-3">
        {artisan.faculty} — {artisan.department}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">⭐</span>
          <span className="text-gray-700 text-xs font-semibold">
            {artisan.rating > 0 ? artisan.rating.toFixed(1) : 'New'}
          </span>
          {artisan.reviewCount > 0 && (
            <span className="text-gray-400 text-xs">({artisan.reviewCount})</span>
          )}
        </div>

        {/* Price */}
        <p className="text-gray-700 text-xs font-semibold">
          ₦{artisan.priceMin?.toLocaleString()} — ₦{artisan.priceMax?.toLocaleString()}
        </p>
      </div>
    </motion.div>
  )
}

export default ArtisanCard