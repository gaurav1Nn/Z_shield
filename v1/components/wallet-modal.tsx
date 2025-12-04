"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldLoader } from "@/components/animations/shield-loader"
import { cn } from "@/lib/utils"

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (wallet: string) => void
}

const wallets = [
  {
    id: "zecwallet",
    name: "ZecWallet",
    icon: "⚡",
    color: "from-amber-500 to-yellow-500",
    description: "Official Zcash wallet",
  },
  {
    id: "nighthawk",
    name: "Nighthawk",
    icon: "🦅",
    color: "from-indigo-500 to-purple-500",
    description: "Mobile-first privacy wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    color: "from-blue-500 to-cyan-500",
    description: "Connect any compatible wallet",
  },
  {
    id: "ledger",
    name: "Ledger",
    icon: "🔐",
    color: "from-gray-600 to-gray-800",
    description: "Hardware wallet security",
  },
]

export function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setConnecting(null)
    onConnect(walletId)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md z-50"
            initial={{ opacity: 0, y: "-40%", x: "-50%", scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, y: "-50%", x: "-50%", scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: "-40%", scale: 0.9, rotateX: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ perspective: "1000px" }}
          >
            <div className="glass-premium rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <h3 className="text-xl font-semibold text-foreground">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Choose your preferred wallet</p>
                </motion.div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Wallet List */}
              <div className="p-4 space-y-3">
                {wallets.map((wallet, index) => (
                  <motion.button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id)}
                    disabled={connecting !== null}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl transition-all border border-border/50 relative overflow-hidden",
                      connecting === wallet.id
                        ? "bg-secondary/70 border-amber-500/50"
                        : "hover:bg-secondary/50 hover:border-amber-500/30",
                      connecting !== null && connecting !== wallet.id && "opacity-50",
                    )}
                  >
                    {/* Animated background on connecting */}
                    {connecting === wallet.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}

                    <motion.div
                      className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg relative",
                        wallet.color,
                      )}
                      animate={connecting === wallet.id ? { rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5, repeat: connecting === wallet.id ? Number.POSITIVE_INFINITY : 0 }}
                    >
                      {wallet.icon}
                    </motion.div>
                    <div className="flex-1 text-left relative">
                      <p className="font-semibold text-foreground">{wallet.name}</p>
                      <p className="text-sm text-muted-foreground">{wallet.description}</p>
                    </div>
                    {connecting === wallet.id && <ShieldLoader size={28} />}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                className="p-4 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-center text-muted-foreground">
                  By connecting, you agree to the{" "}
                  <a href="#" className="text-amber-400 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-amber-400 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
