"use client"

import { ReactNode, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap-config"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
    children: ReactNode
    className?: string
    direction?: "up" | "down" | "left" | "right"
    delay?: number
    stagger?: boolean
}

export function ScrollReveal({
    children,
    className,
    direction = "up",
    delay = 0,
    stagger = false,
}: ScrollRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            const element = containerRef.current
            if (!element) return

            const directionMap = {
                up: { y: 60, x: 0 },
                down: { y: -60, x: 0 },
                left: { y: 0, x: 60 },
                right: { y: 0, x: -60 },
            }

            const offset = directionMap[direction]

            if (stagger && element.children.length > 0) {
                // Stagger children
                gsap.fromTo(
                    element.children,
                    {
                        opacity: 0,
                        y: offset.y,
                        x: offset.x,
                        scale: 0.95,
                        filter: "blur(10px)",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out",
                        delay,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            end: "top 20%",
                            toggleActions: "play none none reverse",
                        },
                    }
                )
            } else {
                // Animate container
                gsap.fromTo(
                    element,
                    {
                        opacity: 0,
                        y: offset.y,
                        x: offset.x,
                        scale: 0.95,
                        filter: "blur(10px)",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.8,
                        ease: "power3.out",
                        delay,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            end: "top 20%",
                            toggleActions: "play none none reverse",
                        },
                    }
                )
            }
        },
        { scope: containerRef }
    )

    return (
        <div ref={containerRef} className={cn(className)}>
            {children}
        </div>
    )
}
