"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "@/lib/gsap-config"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const counterRef = useRef({ value: 0 })
  const [displayValue, setDisplayValue] = useState("0")
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated && ref.current) {
      setHasAnimated(true)

      // GSAP counter animation
      gsap.to(counterRef.current, {
        value: value,
        duration: duration,
        ease: "power3.out",
        onUpdate: () => {
          const current = counterRef.current.value

          // Format display value
          let formatted = ""
          if (value >= 1000000) {
            formatted = `${(current / 1000000).toFixed(1)}M`
          } else if (value >= 1000) {
            formatted = `${(current / 1000).toFixed(current >= value ? 0 : 1)}K`
          } else {
            formatted = Math.round(current).toString()
          }

          setDisplayValue(formatted)
        },
      })

      // Particle burst effect
      createParticleBurst(ref.current)
    }
  }, [isInView, hasAnimated, value, duration])

  const createParticleBurst = (element: HTMLElement) => {
    const particles = 12
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement("div")
      particle.className = "fixed w-2 h-2 rounded-full bg-amber-400 pointer-events-none z-50"
      particle.style.left = `${centerX}px`
      particle.style.top = `${centerY}px`
      document.body.appendChild(particle)

      const angle = (i / particles) * Math.PI * 2
      const distance = 50 + Math.random() * 50

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => {
          particle.remove()
        },
      })
    }
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span
        initial={{ scale: 1 }}
        animate={{ scale: isInView ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3, delay: duration * 0.8 }}
      >
        {displayValue}
      </motion.span>
      {suffix}
    </span>
  )
}
