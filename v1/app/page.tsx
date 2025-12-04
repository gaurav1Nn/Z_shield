"use client"

import { Navbar } from "@/components/navbar"
import { SwapCard } from "@/components/swap-card"
import { Footer } from "@/components/footer"
import { WalletModal } from "@/components/wallet-modal"
import { Background3D } from "@/components/animations/3d-background"
import { MeshGradient } from "@/components/animations/mesh-gradient"
import { NoiseOverlay } from "@/components/animations/noise-overlay"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { TextReveal } from "@/components/animations/text-reveal"
import { AnimatedCounter } from "@/components/animations/animated-counter"
import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Wallet, ArrowLeftRight, ShieldCheck, ChevronRight } from "lucide-react"

export default function Home() {
  // Parallax scroll effect
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background Layers */}
      <MeshGradient />
      <Background3D />
      <NoiseOverlay />

      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <ScrollReveal>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(52, 211, 153, 0.4)",
                    "0 0 0 8px rgba(52, 211, 153, 0)",
                    "0 0 0 0 rgba(52, 211, 153, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <span className="text-sm text-muted-foreground">
                Network Status: <span className="text-emerald-400 font-medium">Operational</span>
              </span>
            </motion.div>
          </ScrollReveal>

          {/* Main Heading with Parallax */}
          <motion.div style={{ y: parallaxY1, opacity: parallaxOpacity }}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              {/* Private Swaps - with hover glow */}
              <motion.span
                className="text-foreground block cursor-default relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{
                  scale: 1.02,
                  textShadow: "0 0 40px rgba(255,255,255,0.3)",
                }}
              >
                <TextReveal text="Private Swaps." className="inline-block" delay={0.2} />
              </motion.span>

              {/* Zero Exposure - with shimmer hover effect */}
              <motion.span
                className="block mt-2 cursor-default group"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.0,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.span
                  className="inline-block relative"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ea580c 65%, #dc2626 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  whileHover={{
                    textShadow: "0 0 60px rgba(251, 191, 36, 0.8), 0 0 120px rgba(249, 115, 22, 0.4)",
                  }}
                >
                  Zero Exposure.
                  {/* Shimmer overlay on hover */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      backgroundSize: '200% 100%',
                    }}
                    initial={{ backgroundPosition: '-200% 0' }}
                    whileHover={{
                      backgroundPosition: '200% 0',
                      transition: { duration: 1, repeat: Infinity, ease: "linear" }
                    }}
                  />
                </motion.span>
              </motion.span>
            </h1>
          </motion.div>

          <ScrollReveal direction="up" delay={0.2}>
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              The most secure decentralized exchange built on Zcash. Trade with complete privacy—your identity, amounts,
              and transactions remain fully shielded.
            </motion.p>
          </ScrollReveal>

          {/* Stats Row */}
          <ScrollReveal stagger direction="up" delay={0.3}>
            <motion.div
              className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <motion.div
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-3xl sm:text-4xl font-bold gradient-text">
                  <AnimatedCounter value={2400000000} prefix="$" suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Volume</p>
              </motion.div>
              <motion.div
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={150000} suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Private Swaps</p>
              </motion.div>
              <motion.div
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={100} suffix="%" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Shielded</p>
              </motion.div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Swap Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <ScrollReveal direction="up" delay={0.2}>
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <SwapCard />
          </motion.div>
        </ScrollReveal>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to complete your first private swap
            </p>
          </motion.div>

          {/* Steps Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Step 1: Connect Wallet */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="glass-premium rounded-2xl p-8 h-full border border-white/10 hover:border-amber-500/30 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-amber-500/10">
                {/* Step Number */}
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-6 border border-amber-500/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Wallet className="w-8 h-8 text-amber-400" />
                </motion.div>

                {/* Step Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                  <span className="text-amber-400 text-sm font-medium">Step 1</span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">
                  Connect Wallet
                </h3>
                <p className="text-muted-foreground">
                  Connect your Zcash wallet securely. We support Zashi, YWallet, and other shielded wallets.
                </p>

                {/* Arrow indicator */}
                <motion.div
                  className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-8 h-8 text-amber-500/50" />
                </motion.div>
              </div>
            </motion.div>

            {/* Step 2: Swap Privately */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="glass-premium rounded-2xl p-8 h-full border border-white/10 hover:border-orange-500/30 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-500/10">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/10 flex items-center justify-center mb-6 border border-orange-500/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <ArrowLeftRight className="w-8 h-8 text-orange-400" />
                </motion.div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                  <span className="text-orange-400 text-sm font-medium">Step 2</span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-orange-400 transition-colors">
                  Swap Privately
                </h3>
                <p className="text-muted-foreground">
                  Enter your amount and destination. All transactions are fully shielded and untraceable.
                </p>

                <motion.div
                  className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <ChevronRight className="w-8 h-8 text-orange-500/50" />
                </motion.div>
              </div>
            </motion.div>

            {/* Step 3: Receive Assets */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="glass-premium rounded-2xl p-8 h-full border border-white/10 hover:border-emerald-500/30 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center mb-6 border border-emerald-500/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </motion.div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <span className="text-emerald-400 text-sm font-medium">Step 3</span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors">
                  Receive Assets
                </h3>
                <p className="text-muted-foreground">
                  Your swapped assets arrive privately at your destination address. Zero exposure, guaranteed.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}



