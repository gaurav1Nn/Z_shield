"use client"

import { useEffect, useRef } from "react"

export function SpotlightEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mousePosition = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        const setSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        setSize()
        window.addEventListener("resize", setSize)

        let currentX = window.innerWidth / 2
        let currentY = window.innerHeight / 2
        let animationId: number

        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current.x = e.clientX
            mousePosition.current.y = e.clientY
        }

        window.addEventListener("mousemove", handleMouseMove)

        const animate = () => {
            // Smooth follow with lag
            currentX += (mousePosition.current.x - currentX) * 0.1
            currentY += (mousePosition.current.y - currentY) * 0.1

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Create radial gradient spotlight
            const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 400)

            gradient.addColorStop(0, "rgba(251, 191, 36, 0.08)")
            gradient.addColorStop(0.3, "rgba(249, 115, 22, 0.04)")
            gradient.addColorStop(0.6, "rgba(234, 88, 12, 0.02)")
            gradient.addColorStop(1, "transparent")

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Add secondary, larger glow
            const outerGradient = ctx.createRadialGradient(currentX, currentY, 200, currentX, currentY, 800)

            outerGradient.addColorStop(0, "rgba(251, 191, 36, 0.02)")
            outerGradient.addColorStop(0.5, "rgba(249, 115, 22, 0.01)")
            outerGradient.addColorStop(1, "transparent")

            ctx.fillStyle = outerGradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", setSize)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-10 mix-blend-screen"
            style={{ background: "transparent" }}
        />
    )
}
