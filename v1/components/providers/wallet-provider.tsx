"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface WalletContextType {
    connectedWallet: string | null
    sessionId: string | null
    isWalletModalOpen: boolean
    connect: (wallet: string) => void
    disconnect: () => void
    openWalletModal: () => void
    closeWalletModal: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
    const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

    // Persist wallet connection on mount
    useEffect(() => {
        const savedWallet = localStorage.getItem("connectedWallet")
        const savedSessionId = localStorage.getItem("sessionId")
        if (savedWallet) {
            setConnectedWallet(savedWallet)
        }
        if (savedSessionId) {
            setSessionId(savedSessionId)
        }
    }, [])

    const connect = async (wallet: string) => {
        try {
            // Call API to create session
            const response = await fetch('/api/auth/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: wallet, walletType: 'mock' })
            })

            const data = await response.json()

            if (data.success && data.data.sessionId) {
                const newSessionId = data.data.sessionId
                setSessionId(newSessionId)
                localStorage.setItem("sessionId", newSessionId)
            }

            // For demo purposes, we'll use a fixed address if one isn't provided or if it's just a wallet name
            const address = wallet.startsWith("zs1") ? wallet : "zs1q8x...7k3m"
            setConnectedWallet(address)
            localStorage.setItem("connectedWallet", address)
            setIsWalletModalOpen(false)
        } catch (error) {
            console.error("Failed to connect wallet:", error)
            // Fallback for demo if API fails
            const address = wallet.startsWith("zs1") ? wallet : "zs1q8x...7k3m"
            setConnectedWallet(address)
            localStorage.setItem("connectedWallet", address)
            setIsWalletModalOpen(false)
        }
    }

    const disconnect = async () => {
        try {
            if (sessionId) {
                await fetch('/api/auth/disconnect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionId}`
                    }
                })
            }
        } catch (error) {
            console.error("Failed to disconnect session:", error)
        }

        setConnectedWallet(null)
        setSessionId(null)
        localStorage.removeItem("connectedWallet")
        localStorage.removeItem("sessionId")
    }

    const openWalletModal = () => setIsWalletModalOpen(true)
    const closeWalletModal = () => setIsWalletModalOpen(false)

    return (
        <WalletContext.Provider
            value={{
                connectedWallet,
                sessionId,
                isWalletModalOpen,
                connect,
                disconnect,
                openWalletModal,
                closeWalletModal,
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const context = useContext(WalletContext)
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider")
    }
    return context
}
