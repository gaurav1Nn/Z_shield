"use client"

import { ReactNode, useRef, useState } from "react"
import { gsap } from "@/lib/gsap-config"
import { cn } from "@/lib/utils"

interface LiquidButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
}

export function LiquidButton({ children, onClick, className, disabled = false }: LiquidButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const liquidRef = useRef<SVGPathElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseEnter = () => {
        if (disabled) return
        setIsHovering(true)

        if (liquidRef.current) {
            gsap.to(liquidRef.current, {
                attr: {
                    d: "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
                },
                duration: 0.6,
                ease: "elastic.out(1, 0.5)",
            })
        }
    }

    const handleMouseLeave = () => {
        if (disabled) return
        setIsHovering(false)

        if (liquidRef.current) {
            gsap.to(liquidRef.current, {
                attr: {
                    d: "M0,100 Q25,100 50,100 T100,100 L100,100 L0,100 Z",
                },
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
            })
        }
    }

    const handleClick = () => {
        if (disabled) return

        // Ripple effect
        if (buttonRef.current && liquidRef.current) {
            gsap.fromTo(
                liquidRef.current,
                {
                    attr: {
                        d: "M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z",
                    },
                },
                {
                    attr: {
                        d: "M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z",
                    },
                    duration: 0.4,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1,
                }
            )
        }

        onClick?.()
    }

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={cn(
                "relative overflow-hidden px-8 py-4 rounded-xl font-semibold transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
        >
            {/* Liquid SVG background */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity={isHovering ? "0.3" : "0.1"} />
                        <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity={isHovering ? "0.4" : "0.15"} />
                    </linearGradient>
                </defs>
                <path
                    ref={liquidRef}
                    d="M0,100 Q25,100 50,100 T100,100 L100,100 L0,100 Z"
                    fill="url(#liquidGradient)"
                    className="transition-all duration-300"
                />
            </svg>

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

            {/* Glow effect */}
            <div
                className={cn(
                    "absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none",
                    isHovering ? "opacity-100" : "opacity-0"
                )}
                style={{
                    background: "radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
                    filter: "blur(20px)",
                }}
            />
        </button>
    )
}
