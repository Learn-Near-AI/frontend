# NEAR by Example

**Learn NEAR Protocol smart contract development through interactive, hands-on coding examples.**

NEAR by Example is a comprehensive, browser-based learning platform designed to teach developers how to build smart contracts on the NEAR Protocol blockchain. Whether you're a complete beginner or an experienced developer looking to explore NEAR, this platform provides an interactive environment where you can write, compile, deploy, and test smart contracts directly in your browser—no local development environment required.

## 🌟 What Makes This Platform Unique

**Interactive Learning**: Unlike traditional documentation, NEAR by Example provides a live code editor where you can modify and experiment with real smart contract code. Each example includes detailed explanations, executable code in both Rust and JavaScript/TypeScript, and instant compilation feedback.

**Progressive Curriculum**: The platform features 60+ carefully curated examples organized into categories that progress from basic concepts to advanced implementations. Each example is tagged with difficulty levels (Beginner, Intermediate, Advanced) to help you follow a structured learning path.

**Real Blockchain Deployment**: Don't just read about smart contracts—deploy them! The platform integrates with NEAR TestNet, allowing you to compile your code and deploy actual contracts to the blockchain using MyNearWallet integration or backend CLI deployment.

**Dual-Language Support**: Learn smart contract development in your preferred language. Examples are available in both Rust (the primary NEAR smart contract language) and JavaScript/TypeScript (using near-sdk-js), allowing you to choose the language that best fits your background.

## 📚 Learning Categories

The platform organizes examples into seven comprehensive categories:

### 1. **Basics** (12 examples)
Foundation concepts including contract structure, view/change methods, storage basics, state management, input validation, error handling, events, and collection types (Vector and Map). Perfect for beginners starting their NEAR journey.

### 2. **Access Control & Security** (6 examples)
Essential security patterns including owner patterns, role-based access control, pausable contracts, multi-signature implementations, upgrade patterns, and reentrancy guards. Learn to build secure, production-ready contracts.

### 3. **Collections & Data** (6 examples)
Data structure implementations covering storage keys, todo lists, user profiles, voting systems, simple marketplaces, and batch operations. Master efficient data management on the blockchain.

### 4. **NFTs** (10 examples)
Complete NFT development from basic transfers to advanced marketplace features. Covers NFT standards (NEP-171), metadata, minting, approval mechanisms, enumeration, royalties, and marketplace integration.

### 5. **Fungible Tokens** (10 examples)
Comprehensive fungible token development following NEP-141 standard. Includes token creation, transfers, allowances, burning, metadata, staking, vesting, and token sale implementations.

### 6. **Cross-Contract Interactions** (8 examples)
Learn to build composable applications through cross-contract calls, callbacks, promise handling, callback data management, oracle integration, token swaps, and multi-step transactions.

### 7. **Advanced Patterns** (9 examples)
Production-level patterns including factory contracts, proxy patterns, iterators, pagination, gas optimization, lazy evaluation, contract migration, event indexing, and DAO implementations.

## 🎯 Key Features

- **Live Code Editor**: Monaco-based editor with syntax highlighting for Rust and TypeScript/JavaScript
- **Instant Compilation**: Backend servers compile your code in real-time with detailed error reporting
- **TestNet Deployment**: Deploy contracts directly to NEAR TestNet using wallet-based or CLI-based deployment
- **Interactive Console**: Real-time compilation and deployment feedback with transaction links to NEAR Explorer
- **AI-Powered Assistance**: Integrated AI assistant to explain code concepts and answer questions (UI ready)
- **Function Testing**: Test deployed contract methods directly from the interface
- **Onboarding Tour**: Guided walkthrough for first-time users to learn the platform features
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS that works on all devices
- **Dark Mode**: Elegant dark theme optimized for extended coding sessions

## 🛠️ Technical Architecture

**Frontend Stack**:
- React 18 with Vite for lightning-fast development and builds
- Tailwind CSS for utility-first styling
- Monaco Editor for professional code editing experience
- NEAR Wallet Selector for seamless wallet integration (MyNearWallet, Meteor Wallet)
- React Router for client-side navigation
- AOS (Animate On Scroll) for smooth animations

**Backend Infrastructure**:
- Express.js servers for contract compilation
- Separate Rust and JavaScript/TypeScript compilation endpoints
- NEAR CLI integration for backend-managed deployments
- CORS-enabled API with proxy support for local development
- Hosted on Fly.io for reliable, low-latency global access

**Blockchain Integration**:
- NEAR API JS for blockchain interactions
- Support for TestNet deployment and transaction verification
- Wallet Selector modal for user-friendly wallet connections
- Contract method invocation and view function calls

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm
- NEAR TestNet wallet (create one at https://testnet.mynearwallet.com/)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd near-frontend

# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build
```

The application will open at `http://localhost:5173`. Click "Launch" to browse examples and start learning!

### Optional: Local Backend Setup

For local contract compilation (optional, as remote backends are configured):

```bash
cd backend
npm install
npm run dev  # Starts on port 3001
```

## 🎓 How to Use

1. **Browse Examples**: Navigate through categories and select an example that interests you
2. **Read Explanations**: Each example includes detailed documentation explaining the concepts
3. **Edit Code**: Modify the code in the editor to experiment and learn
4. **Compile**: Click "Run" to compile the contract and see if it builds successfully
5. **Deploy**: Click "Deploy" to deploy your contract to NEAR TestNet
6. **Test**: Use the function testing tab to interact with your deployed contract
7. **Explore**: Try different examples and build your understanding progressively

## 🔮 Roadmap

- Enhanced AI assistant integration with Gemini API
- Rust contract compilation support (currently JavaScript/TypeScript)
- Contract method execution interface
- User authentication and code snippet saving
- Community-contributed examples
- Multi-language support for documentation
- Video tutorials integration
- Interactive challenges and quizzes

## 📄 License

MIT License - Feel free to use this project for learning and teaching purposes.

---

**Built with ❤️ for the NEAR developer community**

