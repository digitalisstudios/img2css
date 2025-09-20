# Changelog

All notable changes to img2css will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2025-09-20

### 🚀 Major Release - Stable API

**New Features:**
- **New API Structure**: Added `className` parameter for custom CSS class names
- **Processing Object**: Organized filter options under `processing` object for future extensibility
- **Future-Ready Architecture**: Designed for plugin system in v2.0.0

**Enhancements:**
- **Responsive UI**: Complete responsive design for example-ui.html
- **Improved Documentation**: Updated all examples to use new API structure
- **Better Mobile Experience**: Optimized for all screen sizes from mobile to 4K

**Backward Compatibility:**
- ✅ **Full backward compatibility** maintained with existing flat config structure
- ✅ **No breaking changes** - all existing code continues to work

**API Structure:**
```javascript
// New recommended structure
new img2css({
  source: '/path/to/image.jpg',
  className: 'my-gradient',
  processing: {
    details: 80,
    compression: 15,
    mode: 'auto'
  }
});

// Old structure still works
new img2css({
  source: '/path/to/image.jpg',
  details: 80,
  compression: 15,
  processingMode: 'auto'
});
```

### Technical Improvements
- Updated UI to use new API structure internally
- Enhanced responsive design with clamp() CSS functions
- Improved error handling and validation
- Comprehensive test suite for new features

## [0.2.2] - 2025-09-20

### Added
- Live demo link in README
- CDN installation option using JSDelivr
- Comprehensive README.md with usage examples for URL, file upload, data URL, and canvas ImageData
- `toCSS()` method for simple usage when source is provided in constructor
- Support for ImageData objects as `source` in constructor
- `stats` property for accessing detailed conversion information

### Changed
- Renamed project from "Slick Gradient Image" to "img2css"
- Renamed `ImageToGradientConverterCore.js` to `img2css.js`
- Renamed `complete-image-to-css-converter-refactored.html` to `example-ui.html`
- Updated JavaScript class name from `ImageToGradientConverter` to `img2css`
- Simplified API to single `toCSS()` method (removed `generateCSS()`)
- Fixed README examples to use correct parameter-less API
- Updated documentation to focus on developer usage

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