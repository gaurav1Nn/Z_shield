"use client"

import { ReactNode, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HolographicCardProps {
    children: ReactNode
    className?: string
    intensity?: number
}

export function HolographicCard({ children, className, intensity = 0.5 }: HolographicCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -10 * intensity
        const rotateY = ((x - centerX) / centerX) * 10 * intensity

        setRotation({ x: rotateX, y: rotateY })
        setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
    }

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 })
        setGlowPosition({ x: 50, y: 50 })
    }

    return (
        <motion.div
            ref={cardRef}
            className={cn("relative rounded-2xl overflow-hidden", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            animate={{
                rotateX: rotation.x,
                rotateY: rotation.y,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
            }}
        >
            {/* Holographic overlay */}
            <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, 
            rgba(251, 191, 36, 0.15) 0%, 
            rgba(249, 115, 22, 0.1) 20%, 
            transparent 60%)`,
                }}
            />

            {/* Iridescent border effect */}
            <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `conic-gradient(from ${rotation.y * 10 + rotation.x * 10}deg at ${glowPosition.x}% ${glowPosition.y}%, 
            transparent 0deg,
            rgba(251, 191, 36, 0.3) 90deg,
            rgba(249, 115, 22, 0.3) 180deg,
            rgba(234, 88, 12, 0.3) 270deg,
            transparent 360deg)`,
                    maskImage: `radial-gradient(circle at center, transparent 98%, black 99%)`,
                    WebkitMaskImage: `radial-gradient(circle at center, transparent 98%, black 99%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>

            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{
                    background: `linear-gradient(${rotation.y * 2 + 45}deg, 
            transparent 30%, 
            rgba(255, 255, 255, 0.1) 50%, 
            transparent 70%)`,
                    transform: `translateX(${rotation.y * 2}%) translateY(${rotation.x * 2}%)`,
                }}
            />
        </motion.div>
    )
}
