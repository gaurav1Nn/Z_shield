"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Settings, ChevronDown, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { WalletModal } from "@/components/wallet-modal"
import { useWallet } from "@/components/providers/wallet-provider"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "@/lib/gsap-config"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Swap" },
  { href: "/pool", label: "Pool" },
  { href: "/orders", label: "Orders" },
  { href: "/analytics", label: "Analytics" },
]

export function Navbar() {
  const { connectedWallet, disconnect, openWalletModal, isWalletModalOpen, closeWalletModal, connect } = useWallet()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    // GSAP logo entrance animation
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        rotation: -360,
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.2,
      })
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-white/10 backdrop-blur-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                ref={logoRef}
                className="relative"
                whileHover={{ scale: 1.1, rotate: 15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Shield className="w-8 h-8 text-primary animate-glow-pulse" />
                <motion.div
                  className="absolute inset-0 bg-primary/30 blur-xl rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>
              <motion.span
                className="text-xl font-bold tracking-tight"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-foreground">Z</span>
                <span className="gradient-text-animated">Shield</span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 relative">
              {navLinks.map((link, index) => {
                const active = isActive(link.href)
                const hovered = hoveredLink === link.href

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                    onHoverStart={() => setHoveredLink(link.href)}
                    onHoverEnd={() => setHoveredLink(null)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {/* Background highlight */}
                      {active && (
                        <motion.div
                          className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                          layoutId="activeNavBg"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* Hover glow effect */}
                      <AnimatePresence>
                        {hovered && !active && (
                          <motion.div
                            className="absolute inset-0 bg-white/5 rounded-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Label */}
                      <span className="relative z-10">{link.label}</span>

                      {/* Active indicator dot */}
                      {active && (
                        <motion.span
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                          layoutId="activeNavDot"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* Underline animation on hover */}
                      <motion.span
                        className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Settings */}
              <motion.div
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-white/10"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Wallet Button */}
              {connectedWallet ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all rounded-xl"
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full bg-emerald-400"
                          animate={{
                            scale: [1, 1.3, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(52, 211, 153, 0.4)",
                              "0 0 0 4px rgba(52, 211, 153, 0)",
                              "0 0 0 0 rgba(52, 211, 153, 0)",
                            ]
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                        <span className="font-mono text-sm">{connectedWallet}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-premium border-white/10">
                    <DropdownMenuItem onClick={disconnect} className="text-destructive cursor-pointer hover:bg-white/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <MagneticButton
                  onClick={openWalletModal}
                  className="btn-gradient-animated text-primary-foreground font-semibold shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40 px-4 py-2 rounded-xl"
                  strength={0.2}
                >
                  Connect Wallet
                </MagneticButton>
              )}

              {/* Mobile Menu Button */}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden py-4 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="space-y-1">
                  {navLinks.map((link, index) => {
                    const active = isActive(link.href)

                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                            active
                              ? "bg-white/10 text-foreground border border-white/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {active && (
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                              layoutId="mobileActiveIndicator"
                            />
                          )}
                          {link.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
      <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} onConnect={connect} />
    </>
  )
}
