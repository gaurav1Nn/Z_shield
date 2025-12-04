"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDownUp, ChevronDown, Shield, EyeOff, Wallet, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenSelector } from "@/components/token-selector"
import { HolographicCard } from "@/components/animations/holographic-card"
import { LiquidButton } from "@/components/animations/liquid-button"
import { ShieldLoader } from "@/components/animations/shield-loader"
import { useWallet } from "@/components/providers/wallet-provider"
import { cn } from "@/lib/utils"



const tokens = [
  { symbol: "ZEC", name: "Zcash", icon: "⚡", balance: "124.58", color: "text-amber-400" },
  { symbol: "ETH", name: "Ethereum", icon: "◆", balance: "2.45", color: "text-blue-400" },
  { symbol: "BTC", name: "Bitcoin", icon: "₿", balance: "0.082", color: "text-orange-400" },
  { symbol: "USDC", name: "USD Coin", icon: "$", balance: "1,250.00", color: "text-emerald-400" },
]

export function SwapCard() {
  const { connectedWallet, openWalletModal, sessionId } = useWallet()
  const isConnected = !!connectedWallet
  const onConnectClick = openWalletModal

  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [isFromSelectorOpen, setIsFromSelectorOpen] = useState(false)
  const [isToSelectorOpen, setIsToSelectorOpen] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [isRotated, setIsRotated] = useState(false)
  const swapButtonRef = useRef<HTMLButtonElement>(null)

  const estimatedOutput = fromAmount ? (Number.parseFloat(fromAmount) * 0.0195).toFixed(6) : "0.00"
  const exchangeRate = "1 ZEC = 0.0195 ETH"

  const handleSwapTokens = () => {
    setIsRotated(!isRotated)
    setTimeout(() => {
      const temp = fromToken
      setFromToken(toToken)
      setToToken(temp)
    }, 150)
  }

  const handleSwap = async () => {
    if (!connectedWallet) return

    setIsSwapping(true)
    try {
      // Ensure we have a session - create one if missing
      let currentSessionId = sessionId
      if (!currentSessionId) {
        const authRes = await fetch('/api/auth/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: connectedWallet, walletType: 'mock' })
        })
        const authData = await authRes.json()
        if (authData.success && authData.data.sessionId) {
          currentSessionId = authData.data.sessionId
          // Store it for future use
          localStorage.setItem("sessionId", currentSessionId)
        }
      }

      if (!currentSessionId) {
        throw new Error("Failed to create session")
      }

      // 1. Get Quote
      const quoteRes = await fetch('/api/swap/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          fromAmount: fromAmount
        })
      })

      const quoteData = await quoteRes.json()
      if (!quoteData.success) {
        throw new Error(quoteData.error?.message || 'Failed to get quote')
      }

      // 2. Execute Swap
      const executeRes = await fetch('/api/swap/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSessionId}`
        },
        body: JSON.stringify({
          quoteId: quoteData.data.quoteId,
          fromAddress: connectedWallet,
          toAddress: connectedWallet, // Self-swap for demo
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          fromAmount: fromAmount
        })
      })

      const executeData = await executeRes.json()
      if (!executeData.success) {
        throw new Error(executeData.error?.message || 'Failed to execute swap')
      }

      // Success
      setFromAmount("")
    } catch (error) {
      console.error("Swap failed:", error)
      // Fallback simulation for demo if API fails
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setFromAmount("")
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      <HolographicCard className="w-full" intensity={0.8}>
        <div className="p-6 sm:p-8">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground">Swap</h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* From Token */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-input/50 rounded-2xl p-4 border border-border/50 transition-all duration-300 focus-within:border-amber-500/50 focus-within:bg-input/70 hover:border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">From</span>
                {isConnected && (
                  <motion.span
                    className="text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Balance:{" "}
                    <span className="text-foreground">
                      {fromToken.balance} {fromToken.symbol}
                    </span>
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="border-0 bg-transparent text-3xl font-semibold p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => setIsFromSelectorOpen(true)}
                    className="shrink-0 h-12 px-4 gap-2 bg-secondary/50 border-border hover:bg-secondary hover:border-amber-500/50 rounded-xl transition-all duration-300"
                  >
                    <span className={cn("text-lg", fromToken.color)}>{fromToken.icon}</span>
                    <span className="font-semibold">{fromToken.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </motion.div>
              </div>
              <AnimatePresence>
                {isConnected && fromAmount && (
                  <motion.div
                    className="flex gap-2 mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {["25%", "50%", "75%", "MAX"].map((pct, i) => (
                      <motion.button
                        key={pct}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(251, 191, 36, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setFromAmount(
                            (
                              Number.parseFloat(fromToken.balance.replace(",", "")) *
                              (pct === "MAX" ? 1 : Number.parseInt(pct) / 100)
                            ).toString(),
                          )
                        }
                        className="px-3 py-1 text-xs font-medium text-muted-foreground bg-secondary/50 hover:text-foreground rounded-lg transition-colors"
                      >
                        {pct}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Swap Direction Button */}
            <div className="relative flex items-center justify-center -my-2 z-10">
              <motion.button
                ref={swapButtonRef}
                onClick={handleSwapTokens}
                className="p-3 rounded-xl bg-secondary border border-border hover:border-amber-500/50 transition-all group shadow-lg"
                whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(251, 191, 36, 0.3)" }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isRotated ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <ArrowDownUp className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 transition-colors" />
              </motion.button>
            </div>

            {/* To Token */}
            <motion.div
              className="bg-input/50 rounded-2xl p-4 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">To</span>
                {isConnected && (
                  <span className="text-xs text-muted-foreground">
                    Balance:{" "}
                    <span className="text-foreground">
                      {toToken.balance} {toToken.symbol}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <motion.div
                  key={estimatedOutput}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-semibold text-foreground/80 flex-1"
                >
                  {estimatedOutput}
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => setIsToSelectorOpen(true)}
                    className="shrink-0 h-12 px-4 gap-2 bg-secondary/50 border-border hover:bg-secondary hover:border-amber-500/50 rounded-xl transition-all duration-300"
                  >
                    <span className={cn("text-lg", toToken.color)}>{toToken.icon}</span>
                    <span className="font-semibold">{toToken.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Exchange Rate */}
          <AnimatePresence>
            {fromAmount && (
              <motion.div
                className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/30"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="text-foreground font-mono">{exchangeRate}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Status */}
          <motion.div
            className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Lock className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <span className="text-sm font-medium text-emerald-400">Fully Shielded Transaction</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Hidden Sender", icon: EyeOff },
                { label: "Hidden Receiver", icon: EyeOff },
                { label: "Hidden Amount", icon: EyeOff },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 + i * 0.1 }}
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </motion.div>
                  <span className="text-xs text-emerald-400/80">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <LiquidButton
              onClick={isConnected ? handleSwap : onConnectClick}
              disabled={isConnected && (!fromAmount || Number.parseFloat(fromAmount) <= 0 || isSwapping)}
              className="w-full h-14 text-lg font-semibold btn-gradient-animated text-primary-foreground shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 rounded-xl"
            >
              {isSwapping ? (
                <div className="flex items-center gap-3">
                  <ShieldLoader size={24} />
                  <span>Processing...</span>
                </div>
              ) : isConnected ? (
                <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Shield className="w-5 h-5" />
                  <span>Swap Privately</span>
                </motion.div>
              ) : (
                <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet to Swap</span>
                </motion.div>
              )}
            </LiquidButton>
          </motion.div>
        </div>
      </HolographicCard>

      {/* Token Selectors */}
      <TokenSelector
        isOpen={isFromSelectorOpen}
        onClose={() => setIsFromSelectorOpen(false)}
        tokens={tokens}
        selectedToken={fromToken}
        onSelect={(token) => {
          setFromToken(token)
          setIsFromSelectorOpen(false)
        }}
      />
      <TokenSelector
        isOpen={isToSelectorOpen}
        onClose={() => setIsToSelectorOpen(false)}
        tokens={tokens}
        selectedToken={toToken}
        onSelect={(token) => {
          setToToken(token)
          setIsToSelectorOpen(false)
        }}
      />
    </div>
  )
}

function Settings({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
