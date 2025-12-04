"use client"

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/Flip"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, ScrollToPlugin)
}

// Custom ease functions for premium animations
export const customEase = {
    premium: "power3.out",
    elastic: "elastic.out(1, 0.5)",
    bounce: "back.out(1.7)",
    smooth: "power2.inOut",
    expo: "expo.out",
}

// GSAP Default settings
gsap.defaults({
    ease: customEase.premium,
    duration: 0.6,
})

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
    markers: false, // Set to true for debugging
})

// Utility function for responsive animations
export const getResponsiveValue = (mobile: number, tablet: number, desktop: number) => {
    if (typeof window === "undefined") return desktop
    const width = window.innerWidth
    if (width < 768) return mobile
    if (width < 1024) return tablet
    return desktop
}

// Prefered reduce motion check
export const prefersReducedMotion = () => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Safe animation wrapper that respects user preferences
export const safeAnimate = (target: gsap.TweenTarget, vars: gsap.TweenVars) => {
    if (prefersReducedMotion()) {
        // Apply final state immediately without animation
        const finalVars = { ...vars }
        delete finalVars.duration
        delete finalVars.ease
        return gsap.set(target, finalVars)
    }
    return gsap.to(target, vars)
}

export { gsap, useGSAP, ScrollTrigger, Flip, ScrollToPlugin }
