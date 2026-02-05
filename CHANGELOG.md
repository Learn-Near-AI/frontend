# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Consolidated documentation: single README with Contributing, Code of Conduct, env/security

### Removed

- Unused components: CTABanner, ExampleCategories, Features, HowItWorks, OurMission, WhySection
- Duplicate vitest.config.js (test config in vite.config.js)
- Unused assets: agency.png, near-logo.svg
- Unused imports: Code2, DotsPattern (ThreeColumnFeatures), SheetHeader, SheetTitle (ExamplesBrowser)
- `src/features/` structure: landing and examples feature modules
- `src/routes/` for centralized route definitions
- `.env.example` template for environment variables
- ESLint and Prettier for code quality
- Centralized configuration (`src/config/`)
- Logging abstraction (`src/lib/logger.js`) - suppresses debug logs in production
- React Router for proper client-side routing
- Custom hooks: `useStreak`, `useWalletBalance`
- Extracted components: `NavWallet`, `StreakModal`
- Unit tests for utils, config, and transactionHashes
- CONTRIBUTING.md, CODE_OF_CONDUCT.md
- GitHub issue and PR templates

### Changed

- Replaced custom history routing with react-router-dom
- Consolidated duplicated transactionHashes handling
- Consolidated hardcoded URLs into config
- Replaced console statements with logger
- Fixed broken GitHub links to point to Learn-Near-AI/near-by-example
- Split oversized Nav component into smaller modules

### Removed

- Commented-out CTABanner from App
- Duplicate transactionHashes logic from ExamplesBrowser and ExampleDetail
- 100ms path polling interval from ExamplesBrowser
