# Changelog

All notable changes to img2css will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Initial project setup with img2css name
- Comprehensive README.md with usage examples for URL, file upload, data URL, and canvas ImageData
- CLAUDE.md project context file for AI assistant integration
- CHANGELOG.md for tracking project changes
- .gitignore file excluding AI assistant files (CLAUDE.md, PROJECT_PROGRESS.md)
- package.json with project metadata and npm scripts (author: Brandon Moore)
- `toCSS()` method for simple usage when source is provided in constructor (no parameters needed, uses constructor config)
- Removed `generateCSS()` method to simplify API - only `toCSS()` method remains
- `toCSS()` now generates and stores detailed stats in `this.stats` property for optional access
- Added support for ImageData objects as `source` in constructor
- Fixed all README examples to use correct API syntax (no parameters to `toCSS()` method)

### Changed
- Renamed project from "Slick Gradient Image" to "img2css"
- Renamed `ImageToGradientConverterCore.js` to `img2css.js`
- Renamed `complete-image-to-css-converter-refactored.html` to `example-ui.html`
- Updated JavaScript class name from `ImageToGradientConverter` to `img2css`
- Updated UI class name from `ImageToGradientConverterUI` to `img2cssUI`
- Moved "Posterization" control to same column as "Details" in UI layout
- Fixed README.md `maxSize` parameter documentation (now correctly documented as string|number|null for file size limits)
- Simplified README.md Basic Usage examples to show proper simple API usage with `toCSS()` method
- Updated file upload examples to show File objects can be passed directly to `source` option

### Updated
- All file references and imports updated to new naming convention
- Documentation files updated with new project name and file paths
- Example code snippets updated with new class names

## [1.0.0] - Production Ready

### Features
- Advanced image-to-CSS gradient conversion with multiple processing modes
- Posterization system with adjustable strength (0-100%)
- Intelligent compression with adaptive blur
- Automatic upscaling for images smaller than 2K resolution
- Multi-directional gradient processing (Auto, Rows, Columns, Hybrid)
- Real-time preview updates with clean CSS output
- Standalone JavaScript class for easy integration
- Browser-based UI for interactive testing

### Processing Capabilities
- 94%+ data reduction from original images
- Non-destructive processing with efficient canvas handling
- Color palette extraction and normalization
- Smart compression with deduplication (6 RGB unit threshold)
- Edge correction cleanup for optimized output