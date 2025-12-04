"use client"

import { useEffect, useRef } from "react"
import { createNoise3D } from "simplex-noise"

export function MeshGradient() {
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

        const noise = createNoise3D()
        let animationId: number
        let time = 0

        const colors = [
            { r: 15, g: 15, b: 30 },    // Deep purple-black
            { r: 20, g: 20, b: 40 },    // Dark blue-purple
            { r: 30, g: 25, b: 50 },    // Purple
            { r: 40, g: 30, b: 60 },    // Lighter purple
        ]

        const animate = () => {
            time += 0.0005

            // Create gradient mesh
            const gradient = ctx.createRadialGradient(
                canvas.width * 0.5 + Math.sin(time * 2) * 200,
                canvas.height * 0.5 + Math.cos(time * 1.5) * 200,
                0,
                canvas.width * 0.5,
                canvas.height * 0.5,
                Math.max(canvas.width, canvas.height) * 0.8
            )

            // Animate colors with noise
            const color1 = colors[0]
            const color2 = colors[1]
            const color3 = colors[2]
            const color4 = colors[3]

            const noiseVal1 = noise(time, 0, 0) * 20
            const noiseVal2 = noise(time, 1, 0) * 20
            const noiseVal3 = noise(time, 2, 0) * 20

            gradient.addColorStop(0, `rgb(${color1.r + noiseVal1}, ${color1.g + noiseVal1}, ${color1.b + noiseVal1 + 20})`)
            gradient.addColorStop(0.3, `rgb(${color2.r + noiseVal2}, ${color2.g + noiseVal2}, ${color2.b + noiseVal2 + 15})`)
            gradient.addColorStop(0.6, `rgb(${color3.r + noiseVal3}, ${color3.g + noiseVal3}, ${color3.b + noiseVal3 + 10})`)
            gradient.addColorStop(1, `rgb(${color4.r}, ${color4.g}, ${color4.b})`)

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Add subtle overlay blobs
            for (let i = 0; i < 3; i++) {
                const blobGradient = ctx.createRadialGradient(
                    canvas.width * (0.3 + i * 0.2) + Math.sin(time * (1 + i * 0.5)) * 150,
                    canvas.height * (0.4 + i * 0.15) + Math.cos(time * (1.2 + i * 0.3)) * 150,
                    0,
                    canvas.width * (0.3 + i * 0.2),
                    canvas.height * (0.4 + i * 0.15),
                    300
                )

                blobGradient.addColorStop(0, `rgba(251, 191, 36, ${0.03 + noise(time + i, 0, 0) * 0.02})`)
                blobGradient.addColorStop(0.5, `rgba(249, 115, 22, ${0.02 + noise(time + i, 1, 0) * 0.01})`)
                blobGradient.addColorStop(1, "rgba(249, 115, 22, 0)")

                ctx.fillStyle = blobGradient
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

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
            className="fixed inset-0 -z-20 pointer-events-none"
            style={{ background: "transparent" }}
        />
    )
}
