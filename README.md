# NEAR by Example

**Learn NEAR Protocol smart contract development through interactive, hands-on coding examples.**

NEAR by Example is a comprehensive, browser-based learning platform designed to teach developers how to build smart contracts on the NEAR Protocol blockchain. Whether you're a complete beginner or an experienced developer looking to explore NEAR, this platform provides an interactive environment where you can write, compile, deploy, and test smart contracts directly in your browser—no local development environment required.

---

## Table of Contents

- [Features](#-features)
- [Learning Categories](#-learning-categories)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [License](#-license)

---

## 🌟 Features

- **Live Code Editor**: CodeMirror-based editor with syntax highlighting for Rust and TypeScript/JavaScript
- **Instant Compilation**: Backend servers compile your code in real-time with detailed error reporting
- **TestNet Deployment**: Deploy contracts directly to NEAR TestNet using wallet-based or CLI-based deployment
- **Interactive Console**: Real-time compilation and deployment feedback with transaction links to NEAR Explorer
- **AI-Powered Assistance**: Integrated AI assistant to explain code concepts (requires `VITE_GEMINI_API_KEY`)
- **Function Testing**: Test deployed contract methods directly from the interface
- **Onboarding Tour**: Guided walkthrough for first-time users
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Dark Mode**: Optimized for extended coding sessions

---

## 📚 Learning Categories

| Category | Examples | Focus |
|----------|----------|-------|
| **Basics** | 12 | Contract structure, view/change methods, storage, state management |
| **Access Control & Security** | 6 | Owner patterns, RBAC, pausable contracts, upgrades |
| **Collections & Data** | 6 | Todo lists, profiles, voting, marketplaces |
| **NFTs** | 10 | NEP-171, metadata, minting, royalties, marketplace |
| **Fungible Tokens** | 10 | NEP-141, transfers, allowances, staking, vesting |
| **Cross-Contract** | 8 | Callbacks, oracles, token swaps |
| **Advanced Patterns** | 9 | Factory, proxy, pagination, DAO |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- [NEAR TestNet wallet](https://testnet.mynearwallet.com/)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Learn-Near-AI/near-by-example.git
cd near-by-example

# Install dependencies
npm install

# Copy environment template (see Environment Variables below)
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click "Get started" to browse examples.

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

### Environment Variables & Security

1. Copy `.env.example` to `.env`: `cp .env.example .env`
2. **Never commit `.env`**—it is in `.gitignore`. Never add API keys or secrets to the repo.
3. Use `.env.example` as the template; it documents all optional variables without real values.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | No | Gemini API key for AI assistant. Omit to disable AI features. |
| `VITE_RUST_COMPILE_URL` | No | Override Rust compilation backend URL |
| `VITE_JS_COMPILE_URL` | No | Override JS/TS compilation backend URL |
| `VITE_DEPLOY_URL` | No | Override deployment backend URL |

---

## 📁 Project Structure

```
src/
├── components/     # Reusable UI (Nav, Footer, dialogs, etc.)
├── config/         # Centralized configuration (URLs, links)
├── data/           # Static data (examples, constants)
├── features/       # Feature-specific modules
│   ├── examples/   # Examples browser, code editor, deployment
│   └── landing/    # Landing page sections
├── hooks/          # Custom React hooks
├── lib/            # Utilities, API clients, logger
├── near/           # NEAR blockchain integration
├── routes/         # Route definitions
└── test/           # Test setup
```

### Architecture Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Centralized config** | `src/config/` | All URLs, env values—single source of truth |
| **Feature modules** | `src/features/` | Entry points for features (landing, examples) |
| **Route definitions** | `src/routes/` | All routes in one place for maintainability |
| **API layer** | `src/near/` | NEAR wallet, contract calls, RPC |
| **Logging** | `src/lib/logger.js` | Use instead of `console.*` (debug suppressed in prod) |

### Component Design

- **components/**: Reusable UI (Nav, Footer, dialogs, patterns)
- **features/**: Composes components into feature entry points
- Single responsibility: each component does one thing

---

## 🛠️ Development

### Code Quality

```bash
# Lint
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Run tests
npm run test
```

### Adding New Examples

1. Add example metadata to `src/data/examplesData.js`
2. Add code samples to `src/data/exampleCode/`
3. Add to `WORKING_EXAMPLES` in `src/data/exampleCode/index.js` if fully implemented

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository and create a feature branch
2. **Make changes** with clear, focused commits
3. **Ensure quality**:
   - Run `npm run lint` and `npm run format`
   - Run `npm run test`
4. **Submit a PR** with a descriptive title and summary

### Pull Request Checklist

- [ ] Code follows project style (lint passes)
- [ ] Code is formatted (Prettier)
- [ ] Tests pass
- [ ] Documentation updated if needed

### Questions?

Open an [issue](https://github.com/Learn-Near-AI/near-by-example/issues) for questions or discussions.

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. By participating, you agree to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

Instances of abusive or harassing behavior may be reported to project maintainers and will be reviewed promptly.

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 2.0.

---

## 📄 License

MIT License — feel free to use this project for learning and teaching.

---

**Built with ❤️ for the NEAR developer community**
