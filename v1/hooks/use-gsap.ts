import { useEffect, useRef, MutableRefObject } from "react"
import { gsap } from "@/lib/gsap-config"

interface UseGsapOptions {
    dependencies?: any[]
    revertOnUpdate?: boolean
}

/**
 * Custom hook for GSAP animations with automatic cleanup
 * @param callback - Function containing GSAP animations
 * @param options - Configuration options
 * @returns Ref to attach to animated element
 */
export function useGsap<T extends HTMLElement>(
    callback: (element: T, ctx: gsap.Context) => void | (() => void),
    options: UseGsapOptions = {}
): MutableRefObject<T | null> {
    const ref = useRef<T | null>(null)
    const { dependencies = [], revertOnUpdate = true } = options

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const ctx = gsap.context(() => {
            callback(element, ctx)
        }, element)

        return () => {
            if (revertOnUpdate) {
                ctx.revert()
            }
        }
    }, dependencies)

    return ref
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation<T extends HTMLElement>(
    callback: (element: T) => gsap.core.Tween | gsap.core.Timeline,
    options: ScrollTrigger.Vars = {}
) {
    const ref = useRef<T | null>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const animation = callback(element)
        const trigger = ScrollTrigger.create({
            trigger: element,
            animation,
            ...options,
        })

        return () => {
            trigger.kill()
            animation.kill()
        }
    }, [])

    return ref
}
