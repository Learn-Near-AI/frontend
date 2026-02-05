# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Consolidated documentation: single README with Contributing, Code of Conduct, env/security

### Removed

- Unused components: CTABanner, ExampleCategories, Features, HowItWorks, OurMission, WhySection
- Commented-out CTABanner from App
- Duplicate vitest.config.js (test config in vite.config.js)
- Duplicate transactionHashes logic from ExamplesBrowser and ExampleDetail
- 100ms path polling interval from ExamplesBrowser
- Unused assets: agency.png, near-logo.svg
- Unused imports: Code2, DotsPattern (ThreeColumnFeatures), SheetHeader, SheetTitle (ExamplesBrowser)

### Changed

- Replaced custom history routing with react-router-dom
- Consolidated duplicated transactionHashes handling
- Consolidated hardcoded URLs into config
- Replaced console statements with logger
- Fixed broken GitHub links to point to Learn-Near-AI/near-by-example
- Split oversized Nav component into smaller modules
