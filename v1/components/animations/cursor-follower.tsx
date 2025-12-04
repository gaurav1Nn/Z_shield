"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap-config"

export function CursorFollower() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const trailRefs = useRef<HTMLDivElement[]>([])
    const [isVisible, setIsVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        // Only show custom cursor on desktop
        if (window.innerWidth < 768) return

        const cursor = cursorRef.current
        if (!cursor) return

        setIsVisible(true)

        let mouseX = 0
        let mouseY = 0

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY

            // Animate main cursor with lag
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0.3,
                ease: "power2.out",
            })

            // Animate trail elements with increasing lag
            trailRefs.current.forEach((trail, index) => {
                if (trail) {
                    gsap.to(trail, {
                        x: mouseX,
                        y: mouseY,
                        duration: 0.4 + index * 0.15,
                        ease: "power2.out",
                    })
                }
            })
        }

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a")
            ) {
                setIsHovering(true)
            }
        }

        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a")
            ) {
                setIsHovering(false)
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseenter", handleMouseEnter, true)
        document.addEventListener("mouseleave", handleMouseLeave, true)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseenter", handleMouseEnter, true)
            document.removeEventListener("mouseleave", handleMouseLeave, true)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div className="cursor-follower pointer-events-none fixed inset-0 z-[9999] hidden md:block">
            {/* Trail elements */}
            {[...Array(3)].map((_, i) => (
                <div
                    key={`trail-${i}`}
                    ref={(el) => {
                        if (el) trailRefs.current[i] = el
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                    style={{
                        width: `${32 - i * 8}px`,
                        height: `${32 - i * 8}px`,
                        background: `radial-gradient(circle, rgba(251, 191, 36, ${0.15 - i * 0.05}) 0%, transparent 70%)`,
                        opacity: 0.6 - i * 0.15,
                    }}
                />
            ))}

            {/* Main cursor */}
            <div
                ref={cursorRef}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isHovering ? "scale-150" : "scale-100"
                    }`}
            >
                <div className="relative">
                    {/* Outer ring */}
                    <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${isHovering
                                ? "border-amber-400 bg-amber-400/10"
                                : "border-amber-400/40 bg-transparent"
                            }`}
                    />
                    {/* Inner dot */}
                    <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${isHovering ? "bg-amber-400 scale-0" : "bg-amber-400 scale-100"
                            }`}
                    />
                </div>
            </div>
        </div>
    )
}
