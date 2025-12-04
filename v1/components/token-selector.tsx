"use client"

import { X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  color: string
}

interface TokenSelectorProps {
  isOpen: boolean
  onClose: () => void
  tokens: Token[]
  selectedToken: Token
  onSelect: (token: Token) => void
}

export function TokenSelector({ isOpen, onClose, tokens, selectedToken, onSelect }: TokenSelectorProps) {
  const [search, setSearch] = useState("")

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md z-50"
            initial={{ opacity: 0, y: "-40%", x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: "-50%", x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: "-40%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glass-premium rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-foreground">Select Token</h3>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="p-4">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or symbol"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-12 bg-input border-border rounded-xl focus:border-amber-500/50 transition-colors"
                  />
                </motion.div>
              </div>

              {/* Token List */}
              <div className="max-h-80 overflow-y-auto px-2 pb-4">
                {filteredTokens.map((token, index) => (
                  <motion.button
                    key={token.symbol}
                    onClick={() => onSelect(token)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-xl transition-all relative overflow-hidden",
                      selectedToken.symbol === token.symbol
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-secondary/50",
                    )}
                  >
                    {/* Shine effect on selected */}
                    {selectedToken.symbol === token.symbol && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                      />
                    )}

                    <motion.div
                      className={cn(
                        "w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl relative",
                        token.color,
                      )}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      {token.icon}
                    </motion.div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-foreground">{token.balance}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
