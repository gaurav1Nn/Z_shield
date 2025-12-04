"use client"

import { useState, useEffect, type RefObject } from "react"

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(ref?: RefObject<HTMLElement>) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref?.current || window

    const handleMouseMove = (event: MouseEvent) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect()
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      } else {
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
        })
      }
    }

    if (ref?.current) {
      ref.current.addEventListener("mousemove", handleMouseMove)
    } else {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (ref?.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove)
      } else {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [ref])

  return mousePosition
}
