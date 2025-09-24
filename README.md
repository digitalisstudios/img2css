# img2css v2

A powerful JavaScript library for converting images into pure CSS gradients with an advanced plugin system for lighting effects, map extraction, and sophisticated processing options.

## 🌟 [**Try The Live Demo**](https://codepen.io/digitalisstudios/full/OPMPPaZ)

---

## 📚 Table of Contents

### Getting Started
- [✨ What's New in v2](#-whats-new-in-v2)
- [🎯 Why Convert Images to CSS?](#-why-convert-images-to-css)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)

### Core Features
- [🔌 Plugin System](#-plugin-system)
  - [🌟 Lighting Plugin](#-lighting-plugin)
  - [🗺️ Map Extractor Plugin](#️-map-extractor-plugin)
  - [⚙️ Plugin Configuration Methods](#️-plugin-configuration-methods)
- [🪝 Hooks System](#-hooks-system)
  - [🔧 Hook Configuration](#-hook-configuration)
  - [🎯 Available Hooks](#-available-hooks)
  - [🚀 Advanced Hook Examples](#-advanced-hook-examples)
  - [⚡ Hooks Best Practices](#-hooks-best-practices)
- [📊 Enhanced Stats System](#-enhanced-stats-system)
- [⚡ Headless Operation](#-headless-operation)
- [🔧 Processing Configuration](#-processing-configuration)

### Developer Reference
- [📖 API Reference](#-api-reference)
  - [Constructor Options](#constructor-options)
  - [Methods](#methods)
  - [Plugin Results Structure](#plugin-results-structure)
- [🌐 Browser Support](#-browser-support)
- [📝 Examples](#-examples)
- [⚡ Performance Tips](#-performance-tips)
- [🔄 Migration from v1](#-migration-from-v1)

### Advanced Topics
- [🔮 Future Roadmap](#-future-roadmap)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)
- [🆘 Support](#-support)

---

## ✨ What's New in v2

### 🔌 **Plugin Architecture**
- **Lighting System**: Advanced lighting effects with clearcoat, chrome, water presets
- **Map Extraction**: Generate normal, roughness, and material maps from images  
- **Extensible Design**: Clean plugin API for custom processing effects

### 🛠️ **Enhanced Developer Experience**
- **Plugin Configuration Shorthand**: Configure plugins directly in constructor
- **Memory-Safe Stats**: Configurable collection of plugin results and processing data
- **Headless Operation**: Full functionality in Node.js, Web Workers, Service Workers
- **Auto-Loading**: Automatic plugin discovery and loading (UI environments)

### ⚡ **Performance Improvements**
- **Intelligent Caching**: Plugin results cached to prevent re-computation
- **Selective Updates**: UI changes don't trigger unnecessary re-renders
- **Memory Management**: Conservative defaults prevent memory leaks in production

---

## 🎯 Why Convert Images to CSS?

Beyond just a cool effect, img2css v2 offers powerful advantages:

### 🎨 **Creative Control & Advanced Effects**
- **Sophisticated Lighting**: Realistic surface lighting with clearcoat, chrome, water effects
- **Material Properties**: Extract and apply normal maps, roughness, and surface details
- **CSS Animations**: Unlimited filter effects, blend modes, and transitions
- **Tiny File Sizes**: Often 95%+ smaller than original images
- **Fast Loading**: No image requests, just CSS

### 🔒 **Copyright Protection**
Perfect for protecting copyrighted images while maintaining visual appeal:

- **No Downloadable Files**: Images become pure CSS, can't be right-clicked and saved
- **Server-Side Processing**: Original images never leave your backend  
- **Reverse-Engineering Proof**: Impossible to recreate original from CSS gradients
- **Better Than Watermarks**: Clean visual presentation maintained
- **Ideal For**: Photo galleries, stock previews, artist portfolios, premium content

---

## 📦 Installation

### Browser (CDN)
```html
<!-- Core library -->
<script src="https://cdn.jsdelivr.net/gh/digitalisstudios/img2css@v2/src/img2css.js"></script>

<!-- Optional: Plugins -->
<script src="https://cdn.jsdelivr.net/gh/digitalisstudios/img2css@v2/src/plugins/lighting.global.js"></script>
<script src="https://cdn.jsdelivr.net/gh/digitalisstudios/img2css@v2/src/plugins/map-extractor.global.js"></script>
```

### ES Modules
```javascript
import img2css from './img2css.js';
import './plugins/lighting.global.js';
import './plugins/map-extractor.global.js';
```

### Node.js (Headless)
```javascript
const img2css = require('./img2css.js');
const { Lighting } = require('./plugins/lighting.global.js');
const { MapExtractor } = require('./plugins/map-extractor.global.js');
```

---

## 🚀 Quick Start

### Basic Usage
```javascript
// Simple gradient conversion
const converter = new img2css({
    source: '/path/to/image.jpg',
    selector: '.my-gradient',
    processing: {
        details: 80,
        compression: 15,
        mode: 'auto'
    }
});

const css = await converter.toCSS();
console.log(css); // Ready-to-use CSS
```

### With Lighting Effects (New in v2)
```javascript
// Add realistic lighting effects
const converter = new img2css({
    source: '/path/to/image.jpg',
    selector: '.enhanced-gradient',
    
    // Plugin configuration shorthand
    lighting: {
        enabled: true,
        preset: 'clearcoat',      // Automotive clearcoat finish
        lightAngle: 171,          // Light source angle
        highlightAlpha: 1.0,      // Intensity
        color: '#ffffff'          // Light color
    },
    
    processing: {
        details: 90,
        compression: 8
    }
});

const css = await converter.toCSS();
// CSS includes advanced lighting effects
```

### With Map Extraction (New in v2)
```javascript
// Generate material maps from images
const converter = new img2css({
    source: '/path/to/texture.jpg',
    
    // Extract material properties
    mapExtractor: {
        enabled: true,
        types: ['normal', 'roughness', 'subjectnormal'],
        threshold: 127
    },
    
    // Collect plugin results
    stats: 'standard'
});

const css = await converter.toCSS();

// Access extracted maps
const { mapExtractor } = converter.stats.plugins;
console.log('Normal map CSS:', mapExtractor.maps.normal.css);
console.log('Roughness map CSS:', mapExtractor.maps.roughness.css);
```

---

## 🔌 Plugin System

### Available Plugins

### 🌟 Lighting Plugin
Advanced lighting effects for realistic surface appearance:

```javascript
const converter = new img2css({
    source: 'image.jpg',
    lighting: {
        enabled: true,
        
        // Presets: 'clearcoat', 'chrome', 'water', 'marble', etc.
        preset: 'clearcoat',
        
        // Manual configuration
        lightAngle: 171,
        blendMode: 'screen',
        highlightAlpha: 1.0,
        color: '#ffffff',
        
        // Advanced banding controls
        bandGap: 110,
        bandWidth: 50,
        softEdge: 4,
        bandPhase: 2
    }
});
```

**Lighting Presets:**
- `clearcoat`: Automotive clearcoat finish
- `chrome`: Polished metal surface  
- `water`: Liquid surface effects
- `marble`: Natural stone appearance
- `ceramic`: Glossy ceramic finish
- `satin`: Soft fabric texture

### 🗺️ Map Extractor Plugin  
Generate material maps for advanced graphics:

```javascript
const converter = new img2css({
    source: 'texture.jpg',
    mapExtractor: {
        enabled: true,
        
        // Map types to generate
        types: ['normal', 'roughness', 'subjectnormal', 'albedo'],
        
        // Processing options
        threshold: 127,
        normalFactor: 1.0,
        roughnessFactor: 1.0,
        
        // Output selectors
        selectors: {
            normal: '.normal-map',
            roughness: '.roughness-map'
        }
    }
});
```

**Map Types:**
- `normal`: Surface normal map for lighting calculations
- `roughness`: Surface roughness/specular map
- `subjectnormal`: Subject-specific normal map
- `albedo`: Base color/diffuse map
- `depth`: Depth/displacement map

### ⚙️ Plugin Configuration Methods

#### Method 1: Shorthand (Recommended)
```javascript
const converter = new img2css({
    source: 'image.jpg',
    
    // Direct plugin configuration
    lighting: { enabled: true, preset: 'chrome' },
    mapExtractor: { enabled: true, types: ['normal', 'roughness'] }
});
```

#### Method 2: Manual Plugin Instances
```javascript
// Pre-instantiate plugins
const lightingPlugin = Lighting({ 
    enabled: true, 
    lightAngle: 45,
    blendMode: 'screen' 
});

const converter = new img2css({
    source: 'image.jpg',
    plugins: [lightingPlugin]
});
```

#### Method 3: Mixed Configuration  
```javascript
const customPlugin = {
    hooks: {
        afterBuildCSS: (ctx) => {
            console.log('Custom processing complete');
            return ctx;
        }
    }
};

const converter = new img2css({
    source: 'image.jpg',
    
    // Shorthand plugins
    lighting: { enabled: true, preset: 'water' },
    
    // Manual plugins  
    plugins: [customPlugin],
    
    // Direct hooks
    hooks: {
        onError: (ctx) => console.error('Error:', ctx.error)
    }
});
```

---

## 🪝 Hooks System

The img2css hooks system provides powerful extensibility for customizing processing at every stage. Hooks are the foundation of the plugin architecture and allow for complete control over the image-to-CSS conversion process.

### 📋 Quick Reference: All Available Hooks

| Hook Name | Category | Context Parameters | Return Value | Description |
|-----------|----------|-------------------|--------------|-------------|
| `onInit` | Initialization | `{ config, instance }` | - | Called after converter initialization |
| `beforeLoad` | Loading | `{ source }` | Modified context | Called before image loading |
| `afterLoad` | Loading | `{ imageData, source }` | Modified context | Called after image loading |
| `beforeProcess` | Processing | `{ config, imageData }` | Modified context | Called before main processing starts |
| `afterProcess` | Processing | `{ css, stats }` | Modified context | Called after processing completes |
| `beforeScale` | Processing | `{ imageData, details }` | Modified context | Called before image scaling |
| `afterScale` | Processing | `{ imageData, details }` | Modified context | Called after image scaling |
| `decideProcessingMode` | Processing | `{ imageData, config, defaultMode }` | `{ mode }` | Override processing mode selection |
| `supplyPalette` | Processing | `{ imageData, config }` | `{ palette }` | Provide custom color palette |
| `beforeRowPass` | Processing Pass | `{ width, height, samplingRate, adjustedSamplingRate, compression, blurRadius }` | Modified context | Configure row processing parameters |
| `beforeColumnPass` | Processing Pass | `{ width, height, samplingRate, adjustedSamplingRate, compression, blurRadius }` | Modified context | Configure column processing parameters |
| `shouldProcessLine` | Processing Pass | `{ axis, index, stride, width, height }` | `{ process: boolean }` | Control which lines to process |
| `transformRawStops` | Gradient Transform | `{ stops, axis, index, imageData, config }` | `{ stops }` | Transform raw color stops |
| `transformDedupedStops` | Gradient Transform | `{ stops, axis, index }` | `{ stops }` | Transform deduplicated stops |
| `transformOptimizedStops` | Gradient Transform | `{ stops, axis, index }` | `{ stops }` | Transform optimized stops |
| `addIntermediateStops` | Gradient Transform | `{ stops, axis, index }` | `{ stops }` | Add intermediate stops for transitions |
| `nearestPaletteColor` | Gradient Transform | `{ color, palette }` | `{ color }` | Override palette color selection |
| `buildLayer` | CSS Generation | `layer object` | Modified layer | Transform individual gradient layers |
| `beforeBuildCSS` | CSS Generation | `{ layers, selector, dimensions, minified, layersData }` | Modified context | Called before CSS assembly |
| `afterBuildCSS` | CSS Generation | `{ css, layers, selector, dimensions, minified, layersData, imageData }` | Modified context | Called after CSS generation |
| `beforeHybridSecondary` | Hybrid Processing | `{ primaryMode, secondaryMode, imageData, config }` | `{ secondaryMode }` | Configure secondary processing mode |
| `combineHybrid` | Hybrid Processing | `{ primaryCSS, secondaryData, primaryMode, imageData, config, correctedCSS }` | `{ css }` | Combine hybrid results |
| `onError` | Error Handling | `{ stage, error, ...context }` | Modified context | Global error handler |

**Legend:**
- **Initialization**: Called during converter setup
- **Loading**: Called during image loading process
- **Processing**: Called during main image processing
- **Processing Pass**: Called during row/column gradient generation
- **Gradient Transform**: Called to modify gradient color stops
- **CSS Generation**: Called during CSS assembly and output
- **Hybrid Processing**: Called during hybrid mode processing
- **Error Handling**: Called when errors occur

### 🔧 Hook Configuration

Hooks can be configured in multiple ways:

#### Direct Hook Configuration
```javascript
const converter = new img2css({
    source: 'image.jpg',
    
    // Direct hook configuration
    hooks: {
        onInit: (ctx) => console.log('Converter initialized'),
        beforeProcess: (ctx) => console.log('Starting processing'),
        afterBuildCSS: (ctx) => {
            // Modify final CSS
            ctx.css = ctx.css.replace(/rgba/g, 'rgb');
            return ctx;
        }
    }
});
```

#### Plugin-Based Hooks
```javascript
// Plugins automatically register their hooks
const converter = new img2css({
    source: 'image.jpg',
    lighting: { 
        enabled: true,
        preset: 'clearcoat'
    } // Lighting plugin registers afterBuildCSS hook
});
```

#### Mixed Configuration
```javascript
const customPlugin = {
    hooks: {
        afterBuildCSS: (ctx) => {
            console.log('Plugin processing complete');
            return ctx;
        }
    }
};

const converter = new img2css({
    source: 'image.jpg',
    
    // Plugin shorthand
    lighting: { enabled: true },
    
    // Manual plugins  
    plugins: [customPlugin],
    
    // Direct hooks (executed after plugin hooks)
    hooks: {
        onError: (ctx) => console.error('Error:', ctx.error),
        afterBuildCSS: (ctx) => {
            // This runs after plugin hooks
            ctx.css += '\n/* Post-processed */';
            return ctx;
        }
    }
});
```

### 🎯 Available Hooks

#### Initialization Hooks
```javascript
hooks: {
    // Called after converter initialization
    onInit: (ctx) => {
        // ctx: { config, instance }
        console.log('Converter ready with config:', ctx.config);
        
        // Access converter instance
        console.log('Canvas dimensions:', ctx.instance.canvas?.width, ctx.instance.canvas?.height);
    }
}
```

#### Loading Hooks
```javascript
hooks: {
    // Called before image loading
    beforeLoad: (ctx) => {
        // ctx: { source }
        console.log('Loading image from:', ctx.source);
        
        // Can modify source
        if (ctx.source.includes('placeholder')) {
            ctx.source = '/images/default.jpg';
        }
        return ctx;
    },
    
    // Called after image loading
    afterLoad: (ctx) => {
        // ctx: { imageData, source }
        console.log('Loaded image:', ctx.imageData.width, 'x', ctx.imageData.height);
        
        // Can modify imageData
        if (ctx.imageData.width > 1000) {
            console.log('Large image detected, consider scaling');
        }
        return ctx;
    }
}
```

#### Processing Hooks
```javascript
hooks: {
    // Called before main processing starts
    beforeProcess: (ctx) => {
        // ctx: { config, imageData }
        console.log('Starting processing with config:', ctx.config);
        
        // Can modify processing config
        if (ctx.imageData.width * ctx.imageData.height > 500000) {
            ctx.config.processing.compression = Math.max(ctx.config.processing.compression, 20);
        }
        return ctx;
    },
    
    // Called after processing completes
    afterProcess: (ctx) => {
        // ctx: { css, stats }
        console.log('Processing complete, CSS size:', ctx.css.length);
        return ctx;
    },
    
    // Image scaling hooks
    beforeScale: (ctx) => {
        // ctx: { imageData, details }
        console.log('Scaling image for details level:', ctx.details);
        return ctx;
    },
    
    afterScale: (ctx) => {
        // ctx: { imageData, details }
        const pixels = ctx.imageData.width * ctx.imageData.height;
        console.log('Scaled to', pixels, 'pixels');
        return ctx;
    },
    
    // Processing mode decision override
    decideProcessingMode: (ctx) => {
        // ctx: { imageData, config, defaultMode }
        const { width, height } = ctx.imageData;
        const aspectRatio = width / height;
        
        // Custom logic for processing mode
        if (aspectRatio > 2.5) {
            return { mode: 'rows' }; // Wide images work better as rows
        } else if (aspectRatio < 0.4) {
            return { mode: 'columns' }; // Tall images work better as columns
        }
        
        return { mode: ctx.defaultMode }; // Use default
    },
    
    // Custom palette generation
    supplyPalette: (ctx) => {
        // ctx: { imageData, config }
        if (ctx.config.useCustomPalette) {
            const palette = generateCustomPalette(ctx.imageData);
            return { palette: palette };
        }
        return null; // Use default palette extraction
    }
}
```

#### Processing Pass Hooks
```javascript
hooks: {
    // Row processing parameter override
    beforeRowPass: (ctx) => {
        // ctx: { width, height, samplingRate, adjustedSamplingRate, compression, blurRadius }
        
        // Adjust sampling for performance
        if (ctx.height > 1000) {
            ctx.adjustedSamplingRate = Math.max(ctx.adjustedSamplingRate, 3);
        }
        
        return ctx;
    },
    
    // Control which lines to process
    shouldProcessLine: (ctx) => {
        // ctx: { axis: 'row'|'column', index, stride, width, height }
        
        // Skip every other line for performance in large images
        if (ctx.width * ctx.height > 1000000) {
            return { process: ctx.index % 2 === 0 };
        }
        
        return { process: true };
    },
    
    // Column processing parameter override
    beforeColumnPass: (ctx) => {
        // ctx: { width, height, samplingRate, adjustedSamplingRate, compression, blurRadius }
        
        // Increase blur for wide images
        if (ctx.width > ctx.height * 2) {
            ctx.blurRadius = Math.min(ctx.blurRadius + 1, 5);
        }
        
        return ctx;
    }
}
```

#### Gradient Transformation Hooks
```javascript
hooks: {
    // Transform raw color stops before deduplication
    transformRawStops: (ctx) => {
        // ctx: { stops, axis: 'row'|'column', index, imageData, config }
        
        // Add artistic color shifting
        const shiftedStops = ctx.stops.map(stop => ({
            ...stop,
            r: Math.min(255, stop.r + 10), // Warm up colors slightly
            g: Math.min(255, stop.g + 5),
            b: Math.max(0, stop.b - 5)
        }));
        
        return { stops: shiftedStops };
    },
    
    // Transform deduplicated stops
    transformDedupedStops: (ctx) => {
        // ctx: { stops, axis: 'row'|'column', index }
        
        // Ensure minimum contrast between adjacent stops
        const contrastStops = ensureMinimumContrast(ctx.stops, 15);
        return { stops: contrastStops };
    },
    
    // Transform optimized stops
    transformOptimizedStops: (ctx) => {
        // ctx: { stops, axis: 'row'|'column', index }
        
        // Round color values for smaller CSS
        const roundedStops = ctx.stops.map(stop => ({
            ...stop,
            r: Math.round(stop.r / 5) * 5, // Round to nearest 5
            g: Math.round(stop.g / 5) * 5,
            b: Math.round(stop.b / 5) * 5
        }));
        
        return { stops: roundedStops };
    },
    
    // Add intermediate stops for smooth transitions
    addIntermediateStops: (ctx) => {
        // ctx: { stops, axis: 'row'|'column', index }
        
        // Add extra stops for dramatic color changes
        const enhancedStops = addSmoothingStops(ctx.stops, 40);
        return { stops: enhancedStops };
    },
    
    // Override palette color selection
    nearestPaletteColor: (ctx) => {
        // ctx: { color, palette }
        
        // Custom color matching logic
        const customColor = findBestPaletteMatch(ctx.color, ctx.palette);
        return { color: customColor };
    }
}
```

#### CSS Generation Hooks
```javascript
hooks: {
    // Transform individual gradient layers
    buildLayer: (ctx) => {
        // ctx: layer object with gradient data
        
        // Add CSS custom properties
        const enhanced = {
            ...ctx,
            gradient: ctx.gradient + ' /* Generated gradient */'
        };
        
        return enhanced;
    },
    
    // Called before CSS assembly
    beforeBuildCSS: (ctx) => {
        // ctx: { layers, selector, dimensions: {width, height}, minified, layersData }
        console.log(`Building CSS with ${ctx.layers.length} layers for ${ctx.selector}`);
        
        // Can modify layers before final assembly
        if (ctx.dimensions.width > 1000) {
            // Add performance optimization comment
            ctx.layers.unshift('/* Large image - optimized for performance */');
        }
        
        return ctx;
    },
    
    // Called after CSS generation - perfect for post-processing
    afterBuildCSS: (ctx) => {
        // ctx: { css, layers, selector, dimensions, minified, layersData, imageData }
        
        let modifiedCSS = ctx.css;
        
        // Add vendor prefixes
        modifiedCSS = modifiedCSS.replace(/linear-gradient/g, 
            '-webkit-linear-gradient, -moz-linear-gradient, linear-gradient');
        
        // Add responsive breakpoints
        if (ctx.dimensions.width > 800) {
            modifiedCSS += `\n@media (max-width: 768px) {\n  ${ctx.selector} {\n    background-size: cover;\n  }\n}`;
        }
        
        // Add performance hints
        modifiedCSS += `\n${ctx.selector} {\n  will-change: background;\n  backface-visibility: hidden;\n}`;
        
        return { ...ctx, css: modifiedCSS };
    }
}
```

#### Hybrid Processing Hooks
```javascript
hooks: {
    // Configure secondary processing mode
    beforeHybridSecondary: (ctx) => {
        // ctx: { primaryMode, secondaryMode, imageData, config }
        
        // Override secondary mode based on primary results
        if (ctx.primaryMode === 'rows' && ctx.imageData.width > ctx.imageData.height * 3) {
            return { secondaryMode: 'columns' };
        }
        
        return { secondaryMode: ctx.secondaryMode };
    },
    
    // Combine hybrid results with custom logic
    combineHybrid: (ctx) => {
        // ctx: { primaryCSS, secondaryData, primaryMode, imageData, config, correctedCSS }
        
        // Custom hybrid combination algorithm
        const customCSS = blendHybridResults(ctx.primaryCSS, ctx.secondaryData);
        return { css: customCSS };
    }
}
```

#### Error Handling Hooks
```javascript
hooks: {
    // Global error handler
    onError: (ctx) => {
        // ctx: { stage, error, [additional context] }
        console.error(`Error in ${ctx.stage}:`, ctx.error.message);
        
        // Custom error handling based on stage
        switch (ctx.stage) {
            case 'pluginInit':
                console.log('Plugin failed to initialize, continuing without it');
                break;
            case 'loadFromSource':
                console.log('Image loading failed, trying fallback source');
                // Could trigger alternative loading logic
                break;
            case 'toCSS':
                console.log('CSS generation failed, attempting recovery');
                // Could implement fallback CSS generation
                break;
            default:
                // Log to monitoring service
                logErrorToService(ctx);
        }
        
        return ctx;
    }
}
```

### 🚀 Advanced Hook Examples

#### Performance Monitoring Plugin
```javascript
function PerformanceMonitor() {
    const timings = {};
    
    return {
        hooks: {
            beforeProcess: (ctx) => {
                timings.processStart = performance.now();
                return ctx;
            },
            
            afterProcess: (ctx) => {
                timings.processEnd = performance.now();
                timings.processDuration = timings.processEnd - timings.processStart;
                
                console.log(`Processing took ${timings.processDuration.toFixed(2)}ms`);
                console.log(`Generated ${ctx.css.length} characters of CSS`);
                console.log(`Performance: ${(ctx.css.length / timings.processDuration).toFixed(2)} chars/ms`);
                
                return ctx;
            },
            
            beforeBuildCSS: (ctx) => {
                timings.cssStart = performance.now();
                return ctx;
            },
            
            afterBuildCSS: (ctx) => {
                timings.cssEnd = performance.now();
                timings.cssDuration = timings.cssEnd - timings.cssStart;
                
                console.log(`CSS generation took ${timings.cssDuration.toFixed(2)}ms`);
                
                return ctx;
            }
        }
    };
}

// Usage
const converter = new img2css({
    source: 'image.jpg',
    plugins: [PerformanceMonitor()]
});
```

#### Adaptive Quality Plugin
```javascript
function AdaptiveQuality() {
    return {
        hooks: {
            decideProcessingMode: (ctx) => {
                const pixels = ctx.imageData.width * ctx.imageData.height;
                
                // Adaptive mode selection based on image size
                if (pixels > 1000000) {
                    return { mode: 'rows' }; // Faster for large images
                } else if (pixels < 10000) {
                    return { mode: 'hybrid' }; // Best quality for small images
                }
                
                return { mode: ctx.defaultMode };
            },
            
            beforeProcess: (ctx) => {
                const pixels = ctx.imageData.width * ctx.imageData.height;
                
                // Adaptive compression based on image complexity
                if (pixels > 500000) {
                    ctx.config.processing.compression = Math.max(20, ctx.config.processing.compression);
                } else if (pixels < 50000) {
                    ctx.config.processing.compression = Math.min(5, ctx.config.processing.compression);
                }
                
                return ctx;
            }
        }
    };
}
```

#### CSS Framework Integration Plugin
```javascript
function TailwindIntegration(options = {}) {
    const prefix = options.prefix || 'tw-';
    
    return {
        hooks: {
            afterBuildCSS: (ctx) => {
                let css = ctx.css;
                
                // Convert to Tailwind-compatible utility classes
                const utilityClass = `${prefix}gradient-${generateHashFromCSS(css)}`;
                
                // Wrap in Tailwind layer
                css = `@layer utilities {
    .${utilityClass} {
        ${css.replace(ctx.selector, '').trim()}
    }
}`;
                
                // Add to Tailwind config (conceptual)
                if (options.addToConfig) {
                    addToTailwindConfig(utilityClass, css);
                }
                
                return { ...ctx, css };
            }
        }
    };
}

// Usage
const converter = new img2css({
    source: 'image.jpg',
    plugins: [
        TailwindIntegration({ 
            prefix: 'img2css-',
            addToConfig: true 
        })
    ]
});
```

#### Content Security Policy Plugin
```javascript
function CSPCompliance() {
    return {
        hooks: {
            afterBuildCSS: (ctx) => {
                let css = ctx.css;
                
                // Remove any potential security issues
                css = css.replace(/javascript:/gi, '');
                css = css.replace(/data:/gi, '');
                css = css.replace(/expression\(/gi, '');
                
                // Add CSP-compliant nonce if available
                if (window.CSP_NONCE) {
                    css = `/* nonce-${window.CSP_NONCE} */\n${css}`;
                }
                
                return { ...ctx, css };
            }
        }
    };
}
```

### ⚡ Hooks Best Practices

#### Performance Considerations
```javascript
// ✅ Good: Lightweight hook that returns quickly
hooks: {
    beforeProcess: (ctx) => {
        console.log('Processing started');
        return ctx;
    }
}

// ❌ Avoid: Heavy computation in hooks
hooks: {
    beforeProcess: (ctx) => {
        // Don't do expensive operations in hooks
        for (let i = 0; i < 1000000; i++) {
            Math.random();
        }
        return ctx;
    }
}

// ✅ Good: Async operations handled properly
hooks: {
    afterBuildCSS: async (ctx) => {
        if (shouldLogToAPI) {
            // Use non-blocking async call
            logToAPI(ctx.css).catch(console.warn);
        }
        return ctx;
    }
}
```

#### Error Handling
```javascript
// ✅ Good: Robust error handling
hooks: {
    transformRawStops: (ctx) => {
        try {
            const processed = processStops(ctx.stops);
            return { stops: processed };
        } catch (error) {
            console.warn('Stop transformation failed:', error);
            return { stops: ctx.stops }; // Return original on error
        }
    }
}

// ✅ Good: Safe property access
hooks: {
    afterBuildCSS: (ctx) => {
        if (ctx && ctx.css && typeof ctx.css === 'string') {
            ctx.css = ctx.css.trim();
        }
        return ctx;
    }
}
```

#### Hook Ordering
```javascript
// Hooks execute in this order within each category:
// 1. Plugin hooks (in plugin registration order)
// 2. Direct hooks (from constructor config)

const converter = new img2css({
    source: 'image.jpg',
    
    // Plugin hooks execute first
    lighting: { enabled: true }, // Lighting's afterBuildCSS runs first
    
    plugins: [customPlugin], // Custom plugin's hooks run second
    
    // Direct hooks execute last
    hooks: {
        afterBuildCSS: (ctx) => {
            // This runs after all plugin hooks
            return ctx;
        }
    }
});
```

#### Memory Management
```javascript
// ✅ Good: Clean up resources
hooks: {
    afterProcess: (ctx) => {
        // Clear large temporary data
        if (ctx.tempImageData) {
            ctx.tempImageData = null;
        }
        return ctx;
    }
}

// ✅ Good: Avoid storing references to large objects
const processedImages = new WeakMap(); // Use WeakMap for automatic cleanup

hooks: {
    afterLoad: (ctx) => {
        processedImages.set(ctx.imageData, { processed: true });
        return ctx;
    }
}
```

#### Testing Hooks
```javascript
// ✅ Good: Testable hook functions
function createColorEnhancer(options = {}) {
    const saturationBoost = options.saturationBoost || 1.1;
    
    return {
        transformRawStops: (ctx) => {
            const enhanced = ctx.stops.map(stop => enhanceColor(stop, saturationBoost));
            return { stops: enhanced };
        }
    };
}

// Easy to unit test
const enhancer = createColorEnhancer({ saturationBoost: 1.2 });
const result = enhancer.transformRawStops({ stops: testStops });
```

---

## 📊 Enhanced Stats System

### Memory-Safe Collection
```javascript
// Default: minimal memory usage
const converter = new img2css({
    source: 'image.jpg',
    lighting: { enabled: true }
    // stats: 'minimal' <- default, no plugin results stored
});

const css = await converter.toCSS();
console.log(converter.stats.settings); // Basic info only
```

### Plugin Results Collection
```javascript
// Collect plugin results
const converter = new img2css({
    source: 'image.jpg',
    lighting: { enabled: true, preset: 'clearcoat' },
    mapExtractor: { enabled: true, types: ['normal', 'roughness'] },
    
    stats: 'standard'  // Enable plugin result collection
});

const css = await converter.toCSS();

// Access plugin results
const { plugins } = converter.stats;
console.log('Lighting applied:', plugins.lighting.hasLightingEffects);
console.log('Normal map:', plugins.mapExtractor.maps.normal.css);
console.log('Roughness map:', plugins.mapExtractor.maps.roughness.css);
```

### Selective Collection (Production)
```javascript
// Only collect from specific plugins
const converter = new img2css({
    source: 'image.jpg',
    lighting: { enabled: true },
    mapExtractor: { enabled: true, types: ['normal'] },
    
    stats: {
        level: 'standard',
        plugins: ['mapExtractor']  // Only collect from map extractor
    }
});
```

### Stats Configuration Options
```javascript
// Full configuration
const converter = new img2css({
    source: 'image.jpg',
    
    stats: {
        level: 'standard',           // 'minimal' | 'standard' | 'verbose'
        collectPluginResults: true,  // Include plugin outputs
        collectIntermediates: false, // Skip heavy intermediate data
        plugins: ['lighting']        // Specific plugins to collect from
    }
});
```

---

## ⚡ Headless Operation

img2css v2 works perfectly in headless environments:

### Node.js Server
```javascript
const img2css = require('./img2css.js');
const { Lighting } = require('./plugins/lighting.global.js');

// Full functionality without DOM
const converter = new img2css({
    source: '/path/to/image.jpg',
    lighting: {
        enabled: true,
        preset: 'clearcoat',
        lightAngle: 171
    },
    stats: 'standard'
});

const css = await converter.toCSS();
// Works perfectly in Node.js
```

### Web Worker
```javascript
// Inside worker script
importScripts('img2css.js');
importScripts('plugins/lighting.global.js');

self.onmessage = async function(e) {
    const { imageData, config } = e.data;
    
    const converter = new img2css({
        source: imageData,
        lighting: config.lighting,
        stats: 'minimal'  // Memory-safe for workers
    });
    
    const css = await converter.toCSS();
    self.postMessage({ css, stats: converter.stats });
};
```

### Batch Processing
```javascript
// Memory-safe batch processing
const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
const results = [];

for (const imagePath of images) {
    const converter = new img2css({
        source: imagePath,
        lighting: { enabled: true, preset: 'chrome' },
        stats: 'minimal'  // Prevent memory accumulation
    });
    
    const css = await converter.toCSS();
    results.push({ 
        path: imagePath, 
        css: css,
        dimensions: converter.stats.settings.dimensions 
    });
    
    // Clear reference to prevent memory leak
    converter.stats = null;
}
```

---

## 🔧 Processing Configuration

### Basic Processing Options
```javascript
const converter = new img2css({
    source: 'image.jpg',
    processing: {
        details: 80,        // Quality (0-100, higher = more detail)
        compression: 15,    // Compression (0-100, higher = smaller CSS)
        mode: 'auto',      // 'auto' | 'rows' | 'columns' | 'hybrid'
        posterize: 0,      // Posterization effect (0-100)
        useOriginalPalette: false
    }
});
```

### Processing Modes
- **`auto`**: Automatically chooses best mode for image aspect ratio
- **`rows`**: Horizontal strips → vertical gradients (best for portraits)
- **`columns`**: Vertical strips → horizontal gradients (best for landscapes)  
- **`hybrid`**: Combines both modes for complex images

### Advanced Features
```javascript
const converter = new img2css({
    source: 'image.jpg',
    
    // Output configuration
    selector: '.my-gradient',
    minified: true,
    
    // Performance
    autoOptimize: true,    // Automatically find optimal settings
    maxSize: '500KB',      // Target CSS size limit
    
    // Processing
    processing: {
        details: 85,
        compression: 12,
        mode: 'hybrid',
        posterize: 25,     // Artistic posterization effect
        useOriginalPalette: true
    }
});
```

---

## 📖 API Reference

### Constructor Options
```javascript
new img2css({
    // Required
    source: String | File | ImageData,  // Image source
    
    // Output
    selector: String,                   // CSS selector (default: '.slick-img-gradient')
    minified: Boolean,                  // Minify CSS output (default: false)
    
    // Processing
    processing: {
        details: Number,                // Quality 0-100 (default: 100)
        compression: Number,            // Compression 0-100 (default: 15)
        mode: String,                   // 'auto'|'rows'|'columns'|'hybrid' (default: 'auto')
        posterize: Number,              // Posterization 0-100 (default: 0)
        useOriginalPalette: Boolean     // Use original colors (default: false)
    },
    
    // Performance
    autoOptimize: Boolean,              // Auto-find optimal settings (default: false)
    maxSize: String,                    // Target size '500KB', '2MB' (default: null)
    
    // Plugin Configuration (v2)
    lighting: Object,                   // Lighting plugin config
    mapExtractor: Object,               // Map extractor plugin config
    plugins: Array,                     // Manual plugin instances
    hooks: Object,                      // Direct hook configuration
    
    // Stats Collection (v2)
    stats: String | Object              // 'minimal'|'standard'|'verbose' or config object
});
```

### Methods

#### `toCSS()`
Generates CSS gradient from the image.

```javascript
const css = await converter.toCSS();
// Returns: String (CSS class definition)
```

#### `loadFromSource(source)`
Load image data from various sources.

```javascript
// Load from URL
await converter.loadFromSource('/path/to/image.jpg');

// Load from File object
await converter.loadFromSource(fileInput.files[0]);

// Load from ImageData
await converter.loadFromSource(canvasImageData);
```

#### `loadImageData(source)`
Low-level method to load image data into canvas.

```javascript
const imageData = await converter.loadImageData(source);
// Returns: ImageData object
```

#### `processImageToCSS(imageData, config)`
Process ImageData directly with custom configuration.

```javascript
const css = await converter.processImageToCSS(imageData, {
    details: 85,
    compression: 12,
    mode: 'auto'
});
```

#### `scaleImageByDetails(imageData, details)`
Scale image based on detail level for optimal processing.

```javascript
const scaledImageData = converter.scaleImageByDetails(imageData, 90);
```

#### `extractColorPalette(imageData, maxColors)`
Extract color palette from image for posterization effects.

```javascript
const palette = converter.extractColorPalette(imageData, 256);
// Returns: Array of {r, g, b, a} color objects
```

#### `calculateImageComplexity(data, width, height)`
Analyze image complexity for automatic optimization.

```javascript
const complexity = converter.calculateImageComplexity(data, width, height);
console.log(complexity.isComplex, complexity.score);
```

#### `findOptimalSettingsForImage(preserveParameter)`
Automatically find optimal processing settings.

```javascript
// Find optimal settings while preserving detail level
const optimalConfig = await converter.findOptimalSettingsForImage('details');

// Find overall optimal settings
const optimalConfig = await converter.findOptimalSettingsForImage();
```

#### `stats` Property
Access detailed processing information after calling `toCSS()`:

```javascript
const css = await converter.toCSS();

// Always available
console.log(converter.stats.css);           // Generated CSS
console.log(converter.stats.settings);      // Processing settings used
console.log(converter.stats.dimensions);    // Image dimensions

// Available with stats: 'standard' or 'verbose'
console.log(converter.stats.plugins);       // Plugin results
console.log(converter.stats.plugins.lighting);      // Lighting plugin results
console.log(converter.stats.plugins.mapExtractor);  // Map extraction results

// Available with stats: 'verbose'
console.log(converter.stats.performance);   // Performance metrics
```

### Plugin Results Structure
```javascript
// Example stats.plugins structure
{
    lighting: {
        enhancedCSS: true,
        hasLightingEffects: true,
        timestamp: 1634567890123
    },
    mapExtractor: {
        maps: {
            normal: {
                css: '.normal-map { background: linear-gradient(...); }',
                dimensions: { width: 256, height: 256 },
                timestamp: 1634567890124
            },
            roughness: {
                css: '.roughness-map { background: linear-gradient(...); }',
                dimensions: { width: 256, height: 256 },
                timestamp: 1634567890125
            }
        }
    }
}
```

---

## 🌐 Browser Support

### Full Support (UI + Headless)
- Chrome 60+
- Firefox 55+  
- Safari 11+
- Edge 79+

### Headless Support
- Node.js 12+ (with `canvas` package for image processing)
- Web Workers (all modern browsers)
- Service Workers (limited canvas support)

---

## 📝 Examples

### Real-World Use Cases

#### Photo Gallery with Lighting
```javascript
// Professional photo gallery with realistic lighting
const photos = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];

for (const [index, photo] of photos.entries()) {
    const converter = new img2css({
        source: photo,
        selector: `.gallery-item-${index}`,
        
        lighting: {
            enabled: true,
            preset: 'clearcoat',
            lightAngle: 171,
            color: '#ffffff'
        },
        
        processing: {
            details: 85,
            compression: 12,
            mode: 'auto'
        }
    });
    
    const css = await converter.toCSS();
    document.head.appendChild(createStyleElement(css));
}
```

#### Material Design System
```javascript
// Generate material maps for design system
const converter = new img2css({
    source: 'material-texture.jpg',
    
    mapExtractor: {
        enabled: true,
        types: ['normal', 'roughness', 'albedo'],
        selectors: {
            normal: '.material-normal',
            roughness: '.material-roughness', 
            albedo: '.material-albedo'
        }
    },
    
    stats: 'standard'
});

const css = await converter.toCSS();

// Extract individual maps
const { mapExtractor } = converter.stats.plugins;
const normalCSS = mapExtractor.maps.normal.css;
const roughnessCSS = mapExtractor.maps.roughness.css;
const albedoCSS = mapExtractor.maps.albedo.css;

// Apply to design system
document.head.appendChild(createStyleElement(normalCSS));
document.head.appendChild(createStyleElement(roughnessCSS));
document.head.appendChild(createStyleElement(albedoCSS));
```

#### Server-Side API
```javascript
// Express.js API endpoint
app.post('/api/convert', async (req, res) => {
    try {
        const converter = new img2css({
            source: req.body.imageUrl,
            
            // Configure based on request
            lighting: req.body.lighting || { enabled: false },
            mapExtractor: req.body.mapExtractor || { enabled: false },
            
            // Memory-safe for production
            stats: 'minimal',
            
            processing: {
                details: req.body.quality || 80,
                compression: req.body.compression || 15
            }
        });
        
        const css = await converter.toCSS();
        
        res.json({
            success: true,
            css: css,
            dimensions: converter.stats.settings.dimensions,
            bytesSaved: calculateBytesSaved(originalSize, css.length)
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
```

---

## ⚡ Performance Tips

### Memory Management
```javascript
// ✅ Good: Conservative defaults for production
const converter = new img2css({
    source: 'image.jpg',
    stats: 'minimal'  // No plugin result storage
});

// ✅ Good: Selective plugin collection
const converter = new img2css({
    source: 'image.jpg', 
    lighting: { enabled: true },
    mapExtractor: { enabled: true },
    stats: {
        level: 'standard',
        plugins: ['mapExtractor']  // Only collect essential results
    }
});

// ❌ Avoid: Verbose stats in production loops
// stats: 'verbose'  // Heavy memory usage
```

### Batch Processing
```javascript
// ✅ Good: Clear references in loops
for (const image of images) {
    const converter = new img2css({ source: image, stats: 'minimal' });
    const css = await converter.toCSS();
    processResult(css);
    converter.stats = null;  // Clear reference
}

// ✅ Good: Process in chunks for large batches
const chunks = chunkArray(images, 10);
for (const chunk of chunks) {
    await Promise.all(chunk.map(processImage));
    // Allow garbage collection between chunks
    await new Promise(resolve => setTimeout(resolve, 100));
}
```

### Plugin Usage
```javascript
// ✅ Good: Enable only needed plugins
const converter = new img2css({
    source: 'image.jpg',
    lighting: { enabled: userWantsLighting },  // Conditional
    mapExtractor: { enabled: false }           // Disabled when not needed
});

// ✅ Good: Use appropriate presets
const converter = new img2css({
    source: 'image.jpg',
    lighting: {
        enabled: true,
        preset: 'clearcoat'  // Optimized preset instead of manual config
    }
});
```

---

## 🔄 Migration from v1

### Breaking Changes
- Plugin configuration now uses shorthand syntax
- Stats collection is minimal by default (was always collected)
- Some advanced features moved to plugins

### Migration Examples

#### v1 → v2 Basic Usage
```javascript
// v1
const converter = new img2css('/path/to/image.jpg');
const css = await converter.toCSS();

// v2 (unchanged)
const converter = new img2css({ source: '/path/to/image.jpg' });
const css = await converter.toCSS();
```

#### v1 → v2 Advanced Features  
```javascript
// v1 (lighting was built-in)
const converter = new img2css({
    source: '/path/to/image.jpg',
    enableLighting: true,
    lightingIntensity: 0.8
});

// v2 (lighting is now a plugin)
const converter = new img2css({
    source: '/path/to/image.jpg',
    lighting: {
        enabled: true,
        highlightAlpha: 0.8,
        preset: 'clearcoat'
    }
});
```

#### v1 → v2 Stats Access
```javascript
// v1 (all stats always collected)
const css = await converter.toCSS();
console.log(converter.stats.detailedInfo);

// v2 (opt-in stats collection)
const converter = new img2css({
    source: '/path/to/image.jpg',
    stats: 'standard'  // Enable detailed stats
});
const css = await converter.toCSS();
console.log(converter.stats.plugins);
```

---

## 🔮 Future Roadmap

### CSS Blend Mode "Shader" Effects
Planned for v2.1: Advanced CSS blend mode combinations for shader-like effects:

- **Multi-layer composition**: Complex lighting through strategic layering
- **Environmental effects**: Dynamic background gradients with `background-attachment: fixed`
- **Holographic transformations**: Color-shifting effects using blend modes
- **Aurora effects**: Complex gradient combinations with multiple blend modes

### Enhanced Plugin Ecosystem
- Community plugin marketplace
- Plugin development tools and templates
- Performance profiling and optimization plugins
- Advanced material property extractors

---

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 🆘 Support

- 📖 [Documentation](https://github.com/digitalisstudios/img2css/wiki)
- 🐛 [Issues](https://github.com/digitalisstudios/img2css/issues)  
- 💬 [Discussions](https://github.com/digitalisstudios/img2css/discussions)
- 🌟 [Live Demo](https://codepen.io/digitalisstudios/full/OPMPPaZ)