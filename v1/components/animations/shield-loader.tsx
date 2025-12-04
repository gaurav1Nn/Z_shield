"use client"

import { motion } from "framer-motion"

interface ShieldLoaderProps {
  size?: number
  className?: string
}

export function ShieldLoader({ size = 48, className = "" }: ShieldLoaderProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer Ring */}
      <motion.svg viewBox="0 0 50 50" className="absolute inset-0" style={{ width: size, height: size }}>
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, rotate: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            rotate: 360,
          }}
          transition={{
            pathLength: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
            rotate: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Shield Icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500"
          style={{ width: size * 0.4, height: size * 0.4 }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </motion.div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400 rounded-full"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [0, Math.cos((i * 60 * Math.PI) / 180) * 25],
            y: [0, Math.sin((i * 60 * Math.PI) / 180) * 25],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.15,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
