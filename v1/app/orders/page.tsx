"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useWallet } from "@/components/providers/wallet-provider"
import { Background3D } from "@/components/animations/3d-background"
import { MeshGradient } from "@/components/animations/mesh-gradient"
import { NoiseOverlay } from "@/components/animations/noise-overlay"
import { Clock, History, CheckCircle, XCircle, AlertCircle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const mockOrders = [
  {
    id: "1",
    pair: "ZEC/ETH",
    type: "Swap",
    fromAmount: "50.00 ZEC",
    toAmount: "0.975 ETH",
    status: "completed",
    time: "2 mins ago",
  },
  {
    id: "2",
    pair: "ZEC/USDC",
    type: "Swap",
    fromAmount: "25.00 ZEC",
    toAmount: "612.50 USDC",
    status: "pending",
    time: "5 mins ago",
  },
  {
    id: "3",
    pair: "BTC/ZEC",
    type: "Swap",
    fromAmount: "0.05 BTC",
    toAmount: "125.80 ZEC",
    status: "completed",
    time: "1 hour ago",
  },
  {
    id: "4",
    pair: "ETH/ZEC",
    type: "Swap",
    fromAmount: "1.00 ETH",
    toAmount: "51.28 ZEC",
    status: "failed",
    time: "2 hours ago",
  },
]

export default function OrdersPage() {
  const { connectedWallet, openWalletModal, sessionId } = useWallet()
  const [activeTab, setActiveTab] = useState<"open" | "history">("open")
  const [orders, setOrders] = useState<any[]>(mockOrders)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchOrders()
    }
  }, [sessionId])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/swap/history', {
        headers: { 'Authorization': `Bearer ${sessionId}` }
      })
      const data = await res.json()

      if (data.success && data.data.swaps) {
        // Map API response to UI format
        const mappedOrders = data.data.swaps.map((swap: any) => ({
          id: swap.swapId,
          pair: `${swap.fromToken}/${swap.toToken}`,
          type: "Swap",
          fromAmount: `${swap.fromAmount} ${swap.fromToken}`,
          toAmount: `${swap.toAmount} ${swap.toToken}`,
          status: swap.status,
          time: new Date(swap.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }))

        // Merge with mock orders, avoiding duplicates if any
        setOrders(prev => {
          const newOrders = [...mappedOrders, ...mockOrders]
          // Simple dedup by ID if needed, but mock IDs are "1", "2" etc.
          return newOrders
        })
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400"
      case "pending":
        return "text-amber-400"
      case "failed":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

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
              Your <span className="gradient-text">Orders</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Track your swap orders and transaction history.
            </p>
          </motion.div>

          {/* Orders Card */}
          <motion.div
            className="glass-premium rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("open")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative",
                  activeTab === "open"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Clock className="w-4 h-4" />
                Open Orders
                {activeTab === "open" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative",
                  activeTab === "history"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <History className="w-4 h-4" />
                Order History
                {activeTab === "history" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
                    layoutId="activeTab"
                  />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {!connectedWallet ? (
                  <motion.div
                    key="not-connected"
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Inbox className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Wallet</h3>
                    <p className="text-muted-foreground mb-6">Connect your wallet to view your orders</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => openWalletModal()}
                        className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:via-orange-400 hover:to-orange-500 text-primary-foreground shadow-lg shadow-orange-500/25"
                      >
                        Connect Wallet
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : activeTab === "open" && orders.filter((o) => o.status === "pending").length === 0 ? (
                  <motion.div
                    key="no-orders"
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Inbox className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Open Orders</h3>
                    <p className="text-muted-foreground">Your open orders will appear here</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="orders-list"
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {orders
                      .filter((order) => (activeTab === "open" ? order.status === "pending" : true))
                      .map((order, index) => (
                        <motion.div
                          key={order.id}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 10 }}
                              >
                                {getStatusIcon(order.status)}
                              </motion.div>
                              <div>
                                <p className="font-semibold text-foreground">{order.pair}</p>
                                <p className="text-sm text-muted-foreground">{order.type}</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">{order.fromAmount}</p>
                              <p className="text-xs text-muted-foreground">→</p>
                              <p className="text-sm text-foreground">{order.toAmount}</p>
                            </div>
                            <div className="text-right">
                              <p className={cn("text-sm font-medium capitalize", getStatusColor(order.status))}>
                                {order.status}
                              </p>
                              <p className="text-xs text-muted-foreground">{order.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
