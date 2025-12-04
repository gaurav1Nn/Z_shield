"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useWallet } from "@/components/providers/wallet-provider"
import { Background3D } from "@/components/animations/3d-background"
import { MeshGradient } from "@/components/animations/mesh-gradient"
import { NoiseOverlay } from "@/components/animations/noise-overlay"
import { TrendingUp, TrendingDown, Activity, BarChart3, Lock, Users, Zap, Shield, ArrowUpRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const stats = [
  {
    label: "Total Volume (24h)",
    value: "$12.4M",
    change: "+12.5%",
    trend: "up",
    icon: BarChart3,
    color: "amber",
  },
  {
    label: "Total Swaps (24h)",
    value: "2,847",
    change: "+8.2%",
    trend: "up",
    icon: Activity,
    color: "orange",
  },
  {
    label: "Total Value Locked",
    value: "$48.2M",
    change: "+3.1%",
    trend: "up",
    icon: Lock,
    color: "emerald",
  },
  {
    label: "Active Users",
    value: "1,249",
    change: "+5.4%",
    trend: "up",
    icon: Users,
    color: "blue",
  },
]

const topPairs = [
  { pair: "ZEC/ETH", volume: "$4.2M", trades: 892, change: "+15.2%", icon: "⚡/◆" },
  { pair: "ZEC/USDC", volume: "$3.8M", trades: 756, change: "+8.7%", icon: "⚡/$" },
  { pair: "ZEC/BTC", volume: "$2.1M", trades: 445, change: "-2.1%", icon: "⚡/₿" },
  { pair: "ETH/USDC", volume: "$1.4M", trades: 312, change: "+4.3%", icon: "◆/$" },
  { pair: "BTC/ETH", volume: "$980K", trades: 198, change: "+11.2%", icon: "₿/◆" },
]

// 7-day volume data
const volumeData = [
  { day: "Mon", volume: 8.2, swaps: 1850 },
  { day: "Tue", volume: 6.5, swaps: 1420 },
  { day: "Wed", volume: 11.8, swaps: 2650 },
  { day: "Thu", volume: 9.4, swaps: 2100 },
  { day: "Fri", volume: 14.2, swaps: 3200 },
  { day: "Sat", volume: 10.8, swaps: 2400 },
  { day: "Sun", volume: 12.4, swaps: 2847 },
]

// Recent activity
const recentSwaps = [
  { id: 1, pair: "ZEC → ETH", amount: "125 ZEC", value: "$4,375", time: "2m ago", status: "completed" },
  { id: 2, pair: "BTC → ZEC", amount: "0.15 BTC", value: "$9,750", time: "5m ago", status: "completed" },
  { id: 3, pair: "ETH → USDC", amount: "2.5 ETH", value: "$8,750", time: "8m ago", status: "completed" },
  { id: 4, pair: "ZEC → USDC", amount: "80 ZEC", value: "$2,800", time: "12m ago", status: "completed" },
  { id: 5, pair: "USDC → ZEC", amount: "5,000 USDC", value: "$5,000", time: "15m ago", status: "pending" },
]

// Privacy metrics
const privacyStats = [
  { label: "Shielded Transactions", value: "99.2%", icon: Shield },
  { label: "Average Swap Time", value: "45s", icon: Clock },
  { label: "Success Rate", value: "99.8%", icon: Zap },
]

const maxVolume = Math.max(...volumeData.map(d => d.volume))

export default function AnalyticsPage() {
  const { connectedWallet } = useWallet()
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      amber: { bg: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/30", text: "text-amber-400" },
      orange: { bg: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30", text: "text-orange-400" },
      emerald: { bg: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
      blue: { bg: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    }
    return colors[color] || colors.amber
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background - matching home page */}
      <MeshGradient />
      <Background3D />
      <NoiseOverlay />

      <Navbar />

      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Platform <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real-time insights into ZShield protocol activity and performance.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const colorClasses = getColorClasses(stat.color)
              return (
                <motion.div
                  key={stat.label}
                  className="glass-premium rounded-2xl p-6 border border-white/10 hover:border-amber-500/20 transition-all group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center border",
                        colorClasses.bg,
                        colorClasses.border
                      )}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <stat.icon className={cn("w-6 h-6", colorClasses.text)} />
                    </motion.div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                        stat.trend === "up" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10",
                      )}
                    >
                      {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Volume Chart - Takes 2 columns */}
            <motion.div
              className="lg:col-span-2 glass-premium rounded-3xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Volume (7 Days)</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                  Volume in millions
                </div>
              </div>

              <div className="h-72 flex items-end justify-between gap-3 px-2 pt-8">
                {volumeData.map((data, i) => {
                  const heightPercent = (data.volume / maxVolume) * 100
                  const isHovered = hoveredBar === i

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center relative h-full"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <motion.div
                          className="absolute -top-2 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10 border border-white/10"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <p className="text-amber-400 font-semibold">${data.volume}M</p>
                          <p className="text-muted-foreground">{data.swaps.toLocaleString()} swaps</p>
                        </motion.div>
                      )}

                      {/* Bar Container */}
                      <div className="flex-1 w-full flex items-end">
                        <motion.div
                          className="w-full rounded-t-xl cursor-pointer relative overflow-hidden bg-gradient-to-t from-amber-500 via-orange-500 to-orange-400"
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                          whileHover={{
                            boxShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
                          }}
                          style={{ minHeight: "8px" }}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                          {/* Hover overlay */}
                          {isHovered && (
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Label */}
                      <span className={cn(
                        "text-xs font-medium mt-2 transition-colors",
                        isHovered ? "text-amber-400" : "text-muted-foreground"
                      )}>
                        {data.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Privacy Stats */}
            <motion.div
              className="glass-premium rounded-3xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">Privacy Metrics</h2>
              <div className="space-y-6">
                {privacyStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Privacy Badge */}
              <motion.div
                className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">100% Shielded</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All transactions on ZShield are fully private and untraceable.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pairs */}
            <motion.div
              className="glass-premium rounded-3xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Top Trading Pairs</h2>
                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">24h</span>
              </div>
              <div className="space-y-3">
                {topPairs.map((pair, index) => (
                  <motion.div
                    key={pair.pair}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground group-hover:text-amber-400 transition-colors">{pair.pair}</p>
                      <p className="text-xs text-muted-foreground">{pair.trades} trades</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{pair.volume}</p>
                      <p className={cn(
                        "text-xs font-medium",
                        pair.change.startsWith("+") ? "text-emerald-400" : "text-red-400"
                      )}>
                        {pair.change}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Swaps */}
            <motion.div
              className="glass-premium rounded-3xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
                <motion.div
                  className="flex items-center gap-1 text-xs text-emerald-400"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Live
                </motion.div>
              </div>
              <div className="space-y-3">
                {recentSwaps.map((swap, index) => (
                  <motion.div
                    key={swap.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      swap.status === "completed" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                    )} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{swap.pair}</p>
                      <p className="text-xs text-muted-foreground">{swap.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{swap.value}</p>
                      <p className="text-xs text-muted-foreground">{swap.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

    </main>
  )
}
