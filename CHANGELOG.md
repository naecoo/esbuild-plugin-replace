# Changelog

## [2.0.0](https://github.com/naecoo/esbuild-plugin-replace/compare/v1.5.0...v2.0.0) (2026-08-22)

### ⚠ BREAKING CHANGES

- Minimum Node.js version is now 18
- Source code rewritten in TypeScript
- Build output format changed (ESM/CJS)

### Features

- Support latest esbuild version (0.28.x)
- Add TypeScript support with auto-generated type definitions
- Add VitePress documentation site
- Add GitHub Pages deployment workflow
- Add comprehensive test suite

### Bug Fixes

- Fix `include` option now properly takes precedence over `exclude`
- Fix regex escaping for special characters

### Dependencies

- Upgrade esbuild from ^0.17.19 to ^0.28.2
- Upgrade magic-string from ^0.25.7 to ^0.30.17
- Upgrade typescript from ^4.2.3 to ^5.7.3
- Upgrade vitest from ^0.31.1 to ^3.2.7

## [1.5.0](https://github.com/naecoo/esbuild-plugin-replace/releases/tag/v1.5.0) (2023-10-15)

### Features

- Initial release
- Basic string replacement
- Custom delimiters
- Include/exclude filters
