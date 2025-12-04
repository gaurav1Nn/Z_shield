"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

function ParticleField() {
    const ref = useRef<THREE.Points>(null!)
    const mousePosition = useRef({ x: 0, y: 0 })

    // Generate particle positions
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(3000 * 3)
        for (let i = 0; i < 3000; i++) {
            const i3 = i * 3
            // Create a sphere distribution
            const radius = 15
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(Math.random() * 2 - 1)

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i3 + 2] = radius * Math.cos(phi)
        }
        return positions
    }, [])

    // Mouse movement handler
    useFrame((state) => {
        if (!ref.current) return

        const time = state.clock.getElapsedTime()

        // Rotate particle field slowly
        ref.current.rotation.y = time * 0.05
        ref.current.rotation.x = Math.sin(time * 0.1) * 0.1

        // React to mouse position
        ref.current.rotation.x += mousePosition.current.y * 0.0001
        ref.current.rotation.y += mousePosition.current.x * 0.0001
    })

    // Track mouse position
    if (typeof window !== "undefined") {
        window.addEventListener("mousemove", (e) => {
            mousePosition.current.x = e.clientX - window.innerWidth / 2
            mousePosition.current.y = e.clientY - window.innerHeight / 2
        })
    }

    return (
        <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#fbbf24"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    )
}

export function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: "transparent" }}
            >
                <ParticleField />
                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    )
}
