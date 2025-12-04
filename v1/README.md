# 🛡️ ZShield - Privacy-First DeFi Swap Platform

<div align="center">

![ZShield Banner](https://img.shields.io/badge/ZShield-Privacy%20First-orange?style=for-the-badge&logo=shield)

**The most private way to swap crypto assets using Zcash's shielded transactions.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [API](#api-documentation) • [Tech Stack](#tech-stack)

</div>

---

## 🌟 Overview

ZShield is a cutting-edge decentralized exchange (DEX) interface that leverages Zcash's shielded transaction technology to provide **100% private swaps**. Unlike traditional DEXs, ZShield ensures:

- 🔒 **Hidden Sender** - Your identity stays anonymous
- 🔒 **Hidden Receiver** - Recipient addresses are encrypted
- 🔒 **Hidden Amount** - Transaction values are completely private

## ✨ Features

### 🎨 Premium UI/UX
- **3D Particle Background** - Immersive WebGL particle system with 3000+ particles
- **Holographic Cards** - Mouse-tracked 3D tilt effects with iridescent borders
- **Liquid Morphing Buttons** - SVG path animations for fluid interactions
- **Custom Cursor System** - Animated cursor with spotlight effect
- **GSAP Animations** - Professional-grade entrance and scroll animations

### 💱 Swap Functionality
- **Multi-Token Support** - ZEC, ETH, BTC, USDC
- **Real-Time Quotes** - Dynamic exchange rate calculations
- **Shielded Transactions** - All swaps are fully private
- **Transaction History** - Track all your swaps in the Orders page

### 🔐 Wallet Integration
- **Global State Management** - Persistent wallet connection across pages
- **Session-Based Auth** - Secure session tokens for API authentication
- **LocalStorage Persistence** - Wallet stays connected on refresh

### 📊 Analytics Dashboard
- **Platform Statistics** - Total volume, swaps, TVL, active users
- **Interactive Charts** - 7-day volume visualization
- **Live Activity Feed** - Real-time transaction updates
- **Privacy Metrics** - Shielded transaction statistics

---

## 🚀 Demo

### Live Features
1. **Connect Wallet** - Click the connect button to simulate wallet connection
2. **Perform Swap** - Enter amount and click "Swap Privately"
3. **View Orders** - Navigate to Orders page to see transaction history
4. **Explore Analytics** - Check platform stats on Analytics page

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/zshield.git
cd zshield/v1

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
v1/
├── app/                      # Next.js App Router pages
│   ├── api/                  # Backend API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── swap/            # Swap endpoints (quote, execute, history)
│   │   ├── wallet/          # Wallet validation endpoints
│   │   ├── price/           # Token price endpoints
│   │   └── stats/           # Platform statistics
│   ├── analytics/           # Analytics page
│   ├── orders/              # Orders/History page
│   ├── pool/                # Pool management page
│   └── page.tsx             # Home page with swap interface
│
├── components/               # React components
│   ├── animations/          # Advanced animation components
│   │   ├── 3d-background.tsx
│   │   ├── holographic-card.tsx
│   │   ├── liquid-button.tsx
│   │   ├── mesh-gradient.tsx
│   │   └── ...
│   ├── providers/           # Context providers
│   │   └── wallet-provider.tsx
│   ├── ui/                  # shadcn/ui components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── swap-card.tsx
│   └── ...
│
├── lib/                     # Backend logic
│   ├── data/               # Mock database
│   ├── errors/             # Custom error classes
│   ├── middleware/         # API middleware (auth, rate-limit)
│   ├── providers/          # External integrations (Zcash, SideShift)
│   ├── repositories/       # Data access layer
│   ├── services/           # Business logic
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utilities (logger, response helpers)
│   └── validators/         # Zod validation schemas
│
├── hooks/                   # Custom React hooks
│   ├── use-gsap.ts
│   ├── use-wallet.ts
│   └── ...
│
└── public/                  # Static assets
```

---

## 🔌 API Documentation

### Authentication

#### `POST /api/auth/connect`
Connect a wallet and create a session.

```json
// Request
{
  "address": "zs1q8x...7k3m",
  "walletType": "mock"
}

// Response
{
  "success": true,
  "data": {
    "sessionId": "uuid-here",
    "address": "zs1q8x...7k3m",
    "expiresAt": "2024-12-05T..."
  }
}
```

#### `POST /api/auth/disconnect`
End the current session.

### Swap Operations

#### `POST /api/swap/quote`
Get a swap quote.

```json
// Request
{
  "fromToken": "ZEC",
  "toToken": "ETH",
  "fromAmount": "10"
}

// Response
{
  "success": true,
  "data": {
    "quoteId": "uuid",
    "fromAmount": "10",
    "toAmount": "0.195",
    "rate": "0.0195",
    "fee": "0.005",
    "expiresAt": "..."
  }
}
```

#### `POST /api/swap/execute`
Execute a swap (requires auth).

```json
// Headers
Authorization: Bearer <sessionId>

// Request
{
  "quoteId": "uuid",
  "fromAddress": "zs1...",
  "toAddress": "0x...",
  "fromToken": "ZEC",
  "toToken": "ETH",
  "fromAmount": "10"
}
```

#### `GET /api/swap/history`
Get user's swap history (requires auth).

### Price & Stats

#### `GET /api/price`
Get all token prices.

#### `GET /api/stats`
Get platform statistics.

---

## 🎨 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | React animations |
| **GSAP** | Advanced animations |
| **Three.js** | 3D particle effects |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless API |
| **Zod** | Request validation |
| **UUID** | ID generation |
| **In-Memory DB** | Mock data storage |

### Animation Libraries
| Library | Use Case |
|---------|----------|
| **GSAP + ScrollTrigger** | Scroll animations |
| **React Three Fiber** | 3D rendering |
| **simplex-noise** | Gradient animations |

---

## 🎯 Key Components

### WalletProvider
Global state management for wallet connection with localStorage persistence.

```tsx
const { connectedWallet, sessionId, connect, disconnect } = useWallet()
```

### SwapCard
Main swap interface with:
- Token selection
- Amount input with percentage buttons
- Real-time quote fetching
- API-backed swap execution

### HolographicCard
Premium 3D card effect with:
- Mouse-tracked tilt
- Iridescent border
- Holographic overlay

---

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Optional - for real price data
COINGECKO_API_KEY=your_api_key

# Development
NODE_ENV=development
```

---

## 📱 Responsive Design

ZShield is fully responsive:
- **Desktop** - Full 3D effects, custom cursor
- **Tablet** - Adapted layouts, touch-friendly
- **Mobile** - Simplified animations, native cursor

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Zcash](https://z.cash/) - Privacy-focused cryptocurrency
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">

**Built with ❤️ for the privacy-conscious DeFi community**

[⬆ Back to Top](#-zshield---privacy-first-defi-swap-platform)

</div>