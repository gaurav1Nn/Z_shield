"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useWallet } from "@/components/providers/wallet-provider"
import { Background3D } from "@/components/animations/3d-background"
import { MeshGradient } from "@/components/animations/mesh-gradient"
import { NoiseOverlay } from "@/components/animations/noise-overlay"
import { Plus, ChevronDown, Droplets, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const tokens = [
  { symbol: "ZEC", name: "Zcash", icon: "⚡", balance: "124.58", color: "text-amber-400" },
  { symbol: "ETH", name: "Ethereum", icon: "◆", balance: "2.45", color: "text-blue-400" },
  { symbol: "BTC", name: "Bitcoin", icon: "₿", balance: "0.082", color: "text-orange-400" },
  { symbol: "USDC", name: "USD Coin", icon: "$", balance: "1,250.00", color: "text-emerald-400" },
]

const liquidityPositions = [
  {
    pair: "ZEC/ETH",
    tokens: [tokens[0], tokens[1]],
    liquidity: "$12,450.00",
    share: "0.42%",
    apy: "24.5%",
  },
  {
    pair: "ZEC/USDC",
    tokens: [tokens[0], tokens[3]],
    liquidity: "$8,200.00",
    share: "0.18%",
    apy: "18.2%",
  },
]

export default function PoolPage() {
  const { connectedWallet, openWalletModal } = useWallet()
  const [token1, setToken1] = useState(tokens[0])
  const [token2, setToken2] = useState(tokens[1])
  const [amount1, setAmount1] = useState("")
  const [amount2, setAmount2] = useState("")

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background - matching home page */}
      <MeshGradient />
      <Background3D />
      <NoiseOverlay />

      <Navbar />

      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Liquidity <span className="gradient-text">Pools</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Provide liquidity to earn fees from every trade. All positions remain fully shielded.
            </p>
          </motion.div>

          {/* Add Liquidity Card */}
          <motion.div
            className="glass-premium rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-5 h-5 text-primary" />
                </motion.div>
                Add Liquidity
              </h2>
            </div>

            <div className="space-y-4">
              {/* Token 1 */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Token 1</span>
                  {connectedWallet && (
                    <span className="text-xs text-muted-foreground">
                      Balance: <span className="text-foreground">{token1.balance}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    className="border-0 bg-transparent text-2xl font-semibold p-0 h-auto focus-visible:ring-0"
                  />
                  <Button
                    variant="outline"
                    className="shrink-0 h-12 px-4 gap-2 bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:border-amber-500/30 transition-all"
                  >
                    <span className={cn("text-lg", token1.color)}>{token1.icon}</span>
                    <span className="font-semibold">{token1.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* Plus Icon */}
              <div className="flex items-center justify-center">
                <motion.div
                  className="p-2 rounded-lg bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </div>

              {/* Token 2 */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Token 2</span>
                  {connectedWallet && (
                    <span className="text-xs text-muted-foreground">
                      Balance: <span className="text-foreground">{token2.balance}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount2}
                    onChange={(e) => setAmount2(e.target.value)}
                    className="border-0 bg-transparent text-2xl font-semibold p-0 h-auto focus-visible:ring-0"
                  />
                  <Button
                    variant="outline"
                    className="shrink-0 h-12 px-4 gap-2 bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:border-amber-500/30 transition-all"
                  >
                    <span className={cn("text-lg", token2.color)}>{token2.icon}</span>
                    <span className="font-semibold">{token2.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* Pool Info */}
              {amount1 && amount2 && (
                <motion.div
                  className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool Share</span>
                    <span className="text-foreground">0.0012%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected APY</span>
                    <span className="text-emerald-400">~22.4%</span>
                  </div>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => !connectedWallet && openWalletModal()}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:via-orange-400 hover:to-orange-500 text-primary-foreground rounded-xl shadow-lg shadow-orange-500/25"
                >
                  {connectedWallet ? "Supply Liquidity" : "Connect Wallet"}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Your Positions */}
          {connectedWallet && (
            <motion.div
              className="glass-premium rounded-3xl p-6 sm:p-8 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Your Liquidity Positions
              </h2>

              <div className="space-y-4">
                {liquidityPositions.map((position, index) => (
                  <motion.div
                    key={position.pair}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {position.tokens.map((token, i) => (
                            <div
                              key={token.symbol}
                              className={cn(
                                "w-10 h-10 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-lg",
                                token.color,
                              )}
                            >
                              {token.icon}
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{position.pair}</p>
                          <p className="text-sm text-muted-foreground">{position.liquidity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-semibold">{position.apy}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{position.share} share</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
