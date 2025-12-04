"use client"

import { useEffect, useRef } from "react"
import { createNoise2D } from "simplex-noise"

export function NoiseOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

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

        const noise = createNoise2D()
        let animationId: number
        let time = 0

        const animate = () => {
            time += 0.01

            const imageData = ctx.createImageData(canvas.width, canvas.height)
            const data = imageData.data

            // Generate noise pattern
            for (let y = 0; y < canvas.height; y += 2) {
                for (let x = 0; x < canvas.width; x += 2) {
                    const noiseValue = noise(x * 0.05, y * 0.05 + time)
                    const value = (noiseValue + 1) * 0.5 * 255

                    const index = (y * canvas.width + x) * 4

                    // Grayscale noise
                    data[index] = value
                    data[index + 1] = value
                    data[index + 2] = value
                    data[index + 3] = 15 // Low opacity for subtle effect
                }
            }

            ctx.putImageData(imageData, 0, 0)

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", setSize)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[5] mix-blend-overlay opacity-40"
            style={{ background: "transparent" }}
        />
    )
}
