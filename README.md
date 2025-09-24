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
- [🔌 Plugin Development](#-plugin-development)
  - [🏗️ Plugin Architecture](#️-plugin-architecture)
  - [🚀 Getting Started](#-getting-started-1)
  - [🔧 Plugin Structure](#-plugin-structure)
  - [🎯 Plugin Examples](#-plugin-examples)
  - [📦 Publishing Plugins](#-publishing-plugins)
  - [⚡ Plugin Best Practices](#-plugin-best-practices)
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
- [🛠️ Troubleshooting](#️-troubleshooting)
- [❓ FAQ](#-faq)
- [⚡ Performance Guide](#-performance-guide)
- [🏗️ Framework Integration](#️-framework-integration)
- [🚨 Error Handling](#-error-handling)
- [🖼️ Visual Gallery](#️-visual-gallery)
- [📚 Cookbook & Recipes](#-cookbook--recipes)
- [🔧 Build Tool Integration](#-build-tool-integration)
- [🧪 Testing Guide](#-testing-guide)
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
- `clearcoat`: Automotive clearcoat finish (default)
- `chrome`: Polished metal surface  
- `water`: Liquid surface effects
- `marble`: Natural stone appearance
- `ceramic`: Glossy ceramic finish
- `satin`: Soft fabric texture

#### Lighting Plugin Configuration Reference

The Lighting plugin accepts extensive configuration options for fine-tuned control:

```javascript
const converter = new img2css({
    source: 'image.jpg',
    lighting: {
        // Core Settings
        enabled: true,                    // Enable/disable plugin
        preset: 'clearcoat',             // Preset: 'clearcoat' | 'chrome' | 'water' | 'marble' | 'ceramic' | 'satin'
        
        // Light Properties
        lightAngle: 171,                 // Light angle in degrees (0-360)
        blendMode: 'screen',             // CSS blend mode: 'screen' | 'overlay' | 'soft-light' | 'hard-light'
        highlightAlpha: 1.0,             // Highlight intensity (0.0-1.0)
        color: '#ffffff',                // Light color (hex)
        
        // Primary Lighting Band
        bandGap: 110,                    // Gap between light bands
        bandWidth: 50,                   // Width of primary light band
        bandSpace: 120,                  // Spacing of primary band
        softEdge: 4,                     // Edge softness (blur)
        bandPhase: 2,                    // Phase offset for band positioning
        
        // Secondary Lighting Band
        bandGap2: 80,                    // Secondary band gap
        bandWidth2: 10,                  // Secondary band width
        bandSpace2: 90,                  // Secondary band spacing
        
        // Tertiary Lighting Band
        bandGap3: 120,                   // Tertiary band gap
        bandWidth3: 8,                   // Tertiary band width
        bandSpace3: 140,                 // Tertiary band spacing
        bandPhase3: 14,                  // Tertiary phase offset
        
        // Advanced Options
        maskVar: 'var(--lighting-mask)', // CSS variable for masking
        reflection: false,               // Use reflection mode (subject normal map)
        preview: 'off',                  // Preview mode: 'off' | 'masked' | 'unmasked'
        
        // Plugin Hooks
        pluginHooks: {
            beforeMaskLoaded: (data) => console.log('Loading mask'),
            onMaskLoaded: (data) => console.log('Mask loaded')
        }
    }
});
```

#### Lighting Plugin Presets

Each preset provides optimized values for specific surface types:

**Clearcoat Preset** (Automotive finish):
```javascript
{
    lightAngle: 171,
    highlightAlpha: 1.0,
    blendMode: 'screen',
    bandGap: 110, bandWidth: 50, bandSpace: 120,
    bandGap2: 80, bandWidth2: 10, bandSpace2: 90,
    bandGap3: 120, bandWidth3: 8, bandSpace3: 140
}
```

**Chrome Preset** (Polished metal):
```javascript
{
    lightAngle: 145,
    highlightAlpha: 0.95,
    blendMode: 'overlay',
    bandGap: 95, bandWidth: 35, bandSpace: 100,
    bandGap2: 65, bandWidth2: 8, bandSpace2: 75,
    bandGap3: 105, bandWidth3: 6, bandSpace3: 120
}
```

**Water Preset** (Liquid surface):
```javascript
{
    lightAngle: 160,
    highlightAlpha: 0.8,
    blendMode: 'soft-light',
    bandGap: 130, bandWidth: 60, bandSpace: 140,
    bandGap2: 90, bandWidth2: 12, bandSpace2: 105,
    bandGap3: 140, bandWidth3: 10, bandSpace3: 160
}
```

#### Using Custom Presets

```javascript
// Create custom preset
const myCustomPreset = {
    lightAngle: 180,
    highlightAlpha: 0.7,
    blendMode: 'overlay',
    color: '#f0f0f0',
    bandGap: 100,
    bandWidth: 40,
    // ... other parameters
};

// Apply custom preset
const converter = new img2css({
    source: 'image.jpg',
    lighting: {
        ...myCustomPreset,
        enabled: true
    }
});
```

### 🗺️ Map Extractor Plugin  
Generate material maps for advanced graphics and PBR workflows:

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

#### Map Extractor Configuration Reference

The Map Extractor plugin provides comprehensive material map generation:

```javascript
const converter = new img2css({
    source: 'texture.jpg',
    mapExtractor: {
        // Core Settings
        enabled: true,                                    // Enable/disable plugin
        
        // Map Generation
        types: [                                         // Array of map types to generate
            'normal', 'roughness', 'albedo', 
            'subjectnormal', 'depth', 'irradiance', 'object'
        ],
        
        // Processing Control
        computeAt: 'original',                           // When to compute: 'original' | 'scaled'
        dataUrl: true,                                   // Generate data URLs
        emitCSS: true,                                   // Emit CSS for each map
        
        // Quality & Performance
        quality: 1.0,                                    // Processing quality (0.1-1.0)
        threshold: 0.2,                                  // Edge detection threshold (0.0-1.0)
        strength: 1.0,                                   // Overall effect strength
        gamma: 1.0,                                      // Gamma correction
        whitenessBlend: 0.5,                            // Whiteness blending factor
        
        // Normal Map Settings
        normalStrength: 1.0,                            // Normal map intensity
        
        // Roughness Map Settings  
        roughnessWindow: 3,                             // Sampling window size
        
        // Albedo Map Settings
        albedoDeshade: 0.7,                             // Shadow removal strength
        
        // Depth Map Settings
        depthRadius: 3,                                 // Depth calculation radius
        depthStrength: 1.0,                             // Depth effect strength
        depthGamma: 1.2,                                // Depth gamma correction
        depthInvert: false,                             // Invert depth values
        depthLuminanceWeight: 0.3,                      // Luminance contribution
        depthContrastWeight: 0.4,                       // Contrast contribution
        depthEdgeWeight: 0.2,                           // Edge contribution
        depthSaturationWeight: 0.1,                     // Saturation contribution
        
        // Irradiance Map Settings
        irradianceRadius: 8,                            // Irradiance sampling radius
        
        // Object Isolation Settings
        objectRadius: 2,                                // Object detection radius
        objectThreshold: 0.3,                           // Object boundary threshold
        objectStrength: 1.0,                            // Object mask strength
        objectGamma: 1.0,                               // Object gamma correction
        
        // Output Configuration
        selectors: {                                     // CSS selectors for each map type
            normal: '.normal-map',
            roughness: '.roughness-map',
            albedo: '.albedo-map',
            subjectnormal: '.subject-normal-map',
            depth: '.depth-map',
            irradiance: '.irradiance-map',
            object: '.object-mask'
        },
        
        // Plugin Hooks
        pluginHooks: {
            mapGenerated: (data) => console.log(`Generated ${data.type} map`),
            allMapsComplete: (data) => console.log('All maps generated')
        }
    }
});
```

#### Map Types Explained

**Normal Map** (`normal`):
- **Purpose**: Surface detail representation for lighting calculations
- **Use Case**: PBR rendering, bump mapping effects
- **Output**: RGB values representing surface normals
```javascript
mapExtractor: {
    types: ['normal'],
    normalStrength: 1.5  // Increase for more pronounced effects
}
```

**Roughness Map** (`roughness`):
- **Purpose**: Surface roughness/smoothness for specular reflection
- **Use Case**: Material definition, reflection control
- **Output**: Grayscale values (white = rough, black = smooth)
```javascript
mapExtractor: {
    types: ['roughness'],
    roughnessWindow: 5  // Larger window for smoother transitions
}
```

**Albedo Map** (`albedo`):
- **Purpose**: Pure surface color without lighting information
- **Use Case**: Base material color, texture mapping
- **Output**: RGB color values with shadows removed
```javascript
mapExtractor: {
    types: ['albedo'],
    albedoDeshade: 0.8  // Higher value removes more shadows
}
```

**Subject Normal Map** (`subjectnormal`):
- **Purpose**: Object-specific normal information
- **Use Case**: Character/object lighting, detail enhancement
- **Output**: RGB normals focused on subject geometry

**Depth Map** (`depth`):
- **Purpose**: Surface depth/displacement information
- **Use Case**: Parallax mapping, 3D effects
- **Output**: Grayscale depth values
```javascript
mapExtractor: {
    types: ['depth'],
    depthStrength: 1.5,
    depthInvert: false  // Set true for inverted depth
}
```

**Irradiance Map** (`irradiance`):
- **Purpose**: Ambient lighting information
- **Use Case**: Global illumination, ambient occlusion
- **Output**: RGB lighting values

**Object Map** (`object`):
- **Purpose**: Object isolation and masking
- **Use Case**: Background removal, object selection
- **Output**: Binary mask (white = object, black = background)

#### Accessing Generated Maps

```javascript
const converter = new img2css({
    source: 'texture.jpg',
    mapExtractor: {
        types: ['normal', 'roughness', 'albedo'],
        emitCSS: true
    },
    stats: 'standard'  // Required to collect plugin results
});

const css = await converter.toCSS();

// Access generated maps
const { mapExtractor } = converter.stats.plugins;

// Individual map access
const normalMap = mapExtractor.maps.normal;
console.log('Normal map CSS:', normalMap.css);
console.log('Normal map dimensions:', normalMap.dimensions);
console.log('Normal map data URL:', normalMap.dataUrl);

// All maps
Object.keys(mapExtractor.maps).forEach(mapType => {
    const map = mapExtractor.maps[mapType];
    console.log(`${mapType}:`, map.css.length, 'characters');
});
```

#### Advanced Map Processing Workflows

**PBR Material Generation**:
```javascript
const converter = new img2css({
    source: 'material-photo.jpg',
    mapExtractor: {
        types: ['albedo', 'normal', 'roughness'],
        normalStrength: 1.2,
        roughnessWindow: 4,
        albedoDeshade: 0.75,
        selectors: {
            albedo: '.pbr-albedo',
            normal: '.pbr-normal', 
            roughness: '.pbr-roughness'
        }
    },
    stats: 'standard'
});
```

**Depth-Enhanced Effects**:
```javascript
const converter = new img2css({
    source: 'landscape.jpg',
    mapExtractor: {
        types: ['depth', 'normal'],
        depthStrength: 2.0,
        depthLuminanceWeight: 0.4,
        depthContrastWeight: 0.6,
        normalStrength: 0.8
    }
});
```

**Object Isolation Pipeline**:
```javascript
const converter = new img2css({
    source: 'portrait.jpg',
    mapExtractor: {
        types: ['object', 'subjectnormal', 'albedo'],
        objectThreshold: 0.25,
        objectStrength: 1.1,
        selectors: {
            object: '.subject-mask',
            subjectnormal: '.subject-normals',
            albedo: '.subject-color'
        }
    }
});
```

### 🎨 Soft Posterize Plugin
Create artistic posterized gradients with customizable color quantization:

```javascript
const converter = new img2css({
    source: 'image.jpg',
    softPosterize: {
        enabled: true,
        steps: 16,      // Number of color steps (2-256)
        blurBoost: 1.0  // Blur enhancement factor
    }
});
```

#### Soft Posterize Configuration Reference

The Soft Posterize plugin provides artistic color reduction with enhanced blur:

```javascript
const converter = new img2css({
    source: 'image.jpg',
    softPosterize: {
        // Core Settings
        enabled: true,                    // Enable/disable plugin
        steps: 16,                        // Number of posterization steps (2-256)
        blurBoost: 1.0,                   // Blur enhancement multiplier (0.1-5.0)
        
        // Plugin Hooks
        pluginHooks: {
            beforePass: (data) => {
                console.log(`Processing ${data.axis} pass with blur: ${data.blurRadius}`);
            },
            beforeTransformStops: (data) => {
                console.log(`Transforming ${data.stops.length} color stops`);
            },
            afterTransform: (data) => {
                console.log(`Posterized to ${data.uniqueColors} unique colors`);
            }
        }
    }
});
```

#### Posterization Effects

The Soft Posterize plugin quantizes colors to create artistic effects:

**Low Steps (2-8)**: High contrast, graphic poster effects
```javascript
softPosterize: {
    steps: 4,      // Very few colors
    blurBoost: 1.5 // Extra blur for smoothness
}
```

**Medium Steps (8-32)**: Balanced artistic effect
```javascript
softPosterize: {
    steps: 16,     // Default - good balance
    blurBoost: 1.0 // Standard blur
}
```

**High Steps (32-128)**: Subtle color reduction
```javascript
softPosterize: {
    steps: 64,     // Many colors, subtle effect
    blurBoost: 0.8 // Reduced blur
}
```

#### Color Quantization Process

The plugin applies quantization to RGB channels:

1. **Color Analysis**: Examines all colors in gradient stops
2. **Quantization**: Reduces color depth to specified steps
3. **Blur Enhancement**: Applies additional blur for smoothness
4. **Stop Optimization**: Removes duplicate quantized colors

**Mathematical Process**:
```javascript
// Quantization formula used internally
const stepSize = 255 / (steps - 1);
const quantizedValue = Math.round(originalValue / stepSize) * stepSize;
```

#### Artistic Applications

**Pop Art Style**:
```javascript
const converter = new img2css({
    source: 'portrait.jpg',
    softPosterize: {
        steps: 6,
        blurBoost: 2.0
    },
    processing: {
        compression: 5  // Lower compression preserves effect
    }
});
```

**Vintage Poster Effect**:
```javascript
const converter = new img2css({
    source: 'landscape.jpg',
    softPosterize: {
        steps: 12,
        blurBoost: 1.3
    }
});
```

**Subtle Color Reduction**:
```javascript
const converter = new img2css({
    source: 'photo.jpg',
    softPosterize: {
        steps: 48,
        blurBoost: 0.9
    }
});
```

#### Performance Considerations

- **Lower steps** = faster processing, more dramatic effects
- **Higher steps** = slower processing, subtler effects
- **Blur boost** affects rendering performance but improves visual quality

#### Combining with Other Plugins

**Posterize + Lighting**:
```javascript
const converter = new img2css({
    source: 'image.jpg',
    softPosterize: {
        steps: 20,
        blurBoost: 1.2
    },
    lighting: {
        enabled: true,
        preset: 'clearcoat',
        highlightAlpha: 0.8
    }
});
```

**Posterize + Map Extraction**:
```javascript
const converter = new img2css({
    source: 'texture.jpg',
    softPosterize: {
        steps: 32
    },
    mapExtractor: {
        types: ['albedo', 'normal'],
        normalStrength: 1.1
    }
});
```

## 📋 Plugin Reference

### Available Plugins Summary

| Plugin | Purpose | Key Features | Best For |
|--------|---------|--------------|----------|
| **Lighting** | Surface lighting effects | Multiple presets, 3-band lighting, blend modes | Realistic materials, product renders |
| **Map Extractor** | Material map generation | 7 map types, PBR workflow support | 3D graphics, material authoring |
| **Soft Posterize** | Artistic color reduction | Customizable steps, blur enhancement | Artistic effects, vintage styles |

### Plugin Compatibility Matrix

| Plugin A | Plugin B | Compatibility | Notes |
|----------|----------|---------------|-------|
| Lighting | Map Extractor | ✅ Excellent | Lighting can use extracted normal maps |
| Lighting | Soft Posterize | ✅ Good | Apply posterize before lighting for best results |
| Map Extractor | Soft Posterize | ⚠️ Partial | Posterization may affect map quality |

### Plugin Loading Order

When using multiple plugins, they execute in this order:

1. **Map Extractor** - Generates maps during processing
2. **Soft Posterize** - Modifies color stops during gradient generation
3. **Lighting** - Applies lighting effects to final CSS

### Memory Usage by Plugin

| Plugin | Memory Impact | Caching | Notes |
|--------|---------------|---------|-------|
| **Lighting** | Low | CSS cache | Efficient caching prevents re-computation |
| **Map Extractor** | High | Map cache | Caches generated maps, can be memory intensive |
| **Soft Posterize** | Low | None | Processes in-place, minimal memory overhead |

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

### 🔄 Hook Execution Lifecycle

This diagram shows the complete execution flow and when each hook is called during the image-to-CSS conversion process:

```
🚀 CONVERTER INITIALIZATION
│
├─ onInit ────────────────────── Converter initialized with config
│
│
📥 IMAGE LOADING (toCSS() called)
│
├─ beforeLoad ───────────────── About to load image from source
│   │
│   └─ [Image loading process]
│   │
├─ afterLoad ────────────────── Image loaded into ImageData
│
│
⚙️ PROCESSING PIPELINE
│
├─ beforeProcess ────────────── Starting main processing
│   │
│   ├─ supplyPalette ─────────── (Optional) Custom color palette
│   │   │
│   │   └─ [Palette extraction if needed]
│   │
│   ├─ beforeScale ───────────── About to scale image
│   │   │
│   │   └─ [Image scaling based on details]
│   │   │
│   ├─ afterScale ────────────── Image scaled for processing
│   │
│   ├─ decideProcessingMode ──── Override processing mode (auto/rows/columns/hybrid)
│   │
│   └─ [Processing mode determined]
│
│
🎯 GRADIENT GENERATION (Mode: ROWS)
│
├─ beforeRowPass ────────────── Configure row processing parameters
│   │
│   └─ For each row (y-axis):
│       │
│       ├─ shouldProcessLine ─── Control which rows to process
│       │   │
│       │   └─ [Extract colors from row]
│       │   │
│       │   ├─ transformRawStops ──────────── Transform raw color data
│       │   │
│       │   ├─ nearestPaletteColor ─────────── (If using palette) Select colors
│       │   │
│       │   ├─ transformDedupedStops ───────── Transform after deduplication
│       │   │
│       │   ├─ transformOptimizedStops ──────── Transform after optimization
│       │   │
│       │   └─ addIntermediateStops ─────────── Add smooth transition stops
│
│
🎯 GRADIENT GENERATION (Mode: COLUMNS)
│
├─ beforeColumnPass ─────────── Configure column processing parameters
│   │
│   └─ For each column (x-axis):
│       │
│       ├─ shouldProcessLine ─── Control which columns to process
│       │   │
│       │   └─ [Extract colors from column]
│       │   │
│       │   ├─ transformRawStops ──────────── Transform raw color data
│       │   │
│       │   ├─ nearestPaletteColor ─────────── (If using palette) Select colors
│       │   │
│       │   ├─ transformDedupedStops ───────── Transform after deduplication
│       │   │
│       │   ├─ transformOptimizedStops ──────── Transform after optimization
│       │   │
│       │   └─ addIntermediateStops ─────────── Add smooth transition stops
│
│
🔀 HYBRID PROCESSING (Mode: HYBRID only)
│
├─ [Primary mode processing] ─── (Rows or Columns, see above)
│   │
├─ beforeHybridSecondary ────── Configure secondary processing mode
│   │
├─ [Secondary mode processing] ── (Opposite of primary mode)
│   │
└─ combineHybrid ────────────── Combine primary and secondary results
│
│
🎨 CSS GENERATION
│
├─ buildLayer ───────────────── Transform individual gradient layers
│   │                           (Called for each gradient layer)
│   │
├─ beforeBuildCSS ───────────── About to assemble final CSS
│   │
│   └─ [CSS assembly process]
│   │
├─ afterBuildCSS ────────────── CSS generated, ready for post-processing
│   │
└─ afterProcess ─────────────── Processing complete, final result ready
│
│
✅ RESULT RETURNED
│
└─ CSS string returned to caller


❌ ERROR HANDLING (Can occur at any stage)
│
└─ onError ──────────────────── Called whenever an error occurs
    │                           Context includes: { stage, error, ...data }
    │
    └─ Examples of error stages:
        ├─ 'pluginInit' ─────── Plugin initialization failed
        ├─ 'loadFromSource' ──── Image loading failed
        ├─ 'toCSS' ──────────── CSS generation failed
        └─ 'hook:hookName' ───── Hook execution failed


🔧 HOOK EXECUTION NOTES:
│
├─ Plugin hooks execute before direct hooks within the same stage
├─ Hooks can modify context and return modified data
├─ Error hooks are non-blocking and don't stop processing
├─ Some hooks are conditional (e.g., hybrid hooks only in hybrid mode)
└─ Gradient transformation hooks are called for each row/column
```

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

## 🔌 Plugin Development

img2css v2's plugin system allows developers to extend functionality through hooks, custom processing, and stats collection. This section provides everything you need to create powerful, reusable plugins.

### 🏗️ Plugin Architecture

#### Plugin Types

img2css supports three types of plugins:

1. **Hook-Based Plugins** - Extend processing through hooks
2. **Functional Plugins** - Standalone processing functions  
3. **Hybrid Plugins** - Combine hooks with custom functionality

#### Plugin Registration

Plugins can be registered in multiple ways:

```javascript
// 1. Global registration (browser/Node.js)
globalThis.MyPlugin = function(options) { /* plugin code */ };

// 2. Direct plugin instances
const converter = new img2css({
    plugins: [MyPlugin(options)]
});

// 3. Shorthand configuration (auto-loaded)
const converter = new img2css({
    myPlugin: { enabled: true, option: 'value' }
});
```

#### Plugin Loading Priority

1. **Global plugins** (loaded via script tags or imports)
2. **Direct plugin instances** (passed to `plugins` array)
3. **Shorthand configurations** (auto-instantiated)

### 🚀 Getting Started

#### Basic Plugin Template

```javascript
function MyPlugin(options = {}) {
    // Plugin configuration
    const config = {
        enabled: options.enabled !== false,
        setting: options.setting || 'default',
        ...options
    };
    
    // Plugin-local hooks for extensibility
    const localHooks = options.pluginHooks || {};
    
    function emitLocalHook(eventName, data) {
        const fn = localHooks[eventName];
        if (typeof fn === 'function') {
            try { 
                return fn(data); 
            } catch (e) { 
                console.warn(`Plugin hook error (${eventName}):`, e); 
            }
        }
    }
    
    // Return plugin object
    return {
        // Plugin metadata
        name: 'MyPlugin',
        version: '1.0.0',
        
        // Hook implementations
        hooks: {
            beforeProcess: (ctx) => {
                if (!config.enabled) return ctx;
                
                // Plugin processing
                console.log('MyPlugin: Processing started');
                
                // Emit local hook
                emitLocalHook('beforeProcess', ctx);
                
                return ctx;
            },
            
            afterBuildCSS: (ctx) => {
                if (!config.enabled) return ctx;
                
                // Modify CSS
                ctx.css = processCSS(ctx.css, config);
                
                // Emit local hook
                emitLocalHook('afterProcess', { 
                    css: ctx.css, 
                    config 
                });
                
                return ctx;
            }
        },
        
        // Optional: Direct API methods
        processCSS: (css) => processCSS(css, config),
        getConfig: () => config
    };
    
    // Helper functions
    function processCSS(css, config) {
        // Plugin-specific CSS processing
        return css;
    }
}

// Global registration
if (typeof globalThis !== 'undefined') {
    globalThis.MyPlugin = MyPlugin;
}

// Node.js export
if (typeof module !== 'undefined') {
    module.exports = { MyPlugin };
}
```

#### Plugin Registration Pattern

```javascript
// plugin-name.global.js
(function(global) {
    'use strict';
    
    function PluginName(options = {}) {
        // Plugin implementation
        return {
            hooks: {
                // Hook implementations
            }
        };
    }
    
    // Global registration
    if (typeof global.PluginName === 'undefined') {
        global.PluginName = PluginName;
    }
    
    // Node.js support
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { PluginName };
    }
    
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

### 🔧 Plugin Structure

#### Complete Plugin Example

```javascript
function ColorEnhancer(options = {}) {
    // Configuration with defaults
    const config = {
        enabled: options.enabled !== false,
        saturationBoost: options.saturationBoost || 1.1,
        brightnessBoost: options.brightnessBoost || 1.05,
        contrastBoost: options.contrastBoost || 1.02,
        applyToStops: options.applyToStops !== false,
        applyToCSS: options.applyToCSS !== false
    };
    
    // Plugin-local hooks
    const localHooks = options.pluginHooks || {};
    function emitLocalHook(name, data) {
        const fn = localHooks[name];
        if (typeof fn === 'function') {
            try { return fn(data); } catch (e) { console.warn('Hook error:', e); }
        }
    }
    
    // Internal state
    let processedStops = 0;
    let enhancedColors = 0;
    
    return {
        // Plugin metadata
        name: 'ColorEnhancer',
        version: '1.0.0',
        description: 'Enhances colors through saturation, brightness, and contrast adjustments',
        
        // Hook implementations
        hooks: {
            transformRawStops: (ctx) => {
                if (!config.enabled || !config.applyToStops) return ctx;
                
                const enhanced = ctx.stops.map(stop => {
                    const original = { r: stop.r, g: stop.g, b: stop.b };
                    const enhanced = enhanceColor(stop, config);
                    
                    processedStops++;
                    if (colorChanged(original, enhanced)) {
                        enhancedColors++;
                    }
                    
                    return enhanced;
                });
                
                // Emit local hook
                emitLocalHook('stopsEnhanced', {
                    original: ctx.stops,
                    enhanced: enhanced,
                    stats: { processedStops, enhancedColors }
                });
                
                return { stops: enhanced };
            },
            
            afterBuildCSS: (ctx) => {
                if (!config.enabled || !config.applyToCSS) return ctx;
                
                // Apply CSS-level enhancements
                let css = ctx.css;
                
                // Add CSS filters for additional enhancement
                const filterRule = buildFilterRule(config);
                if (filterRule) {
                    css = css.replace(
                        /(\{[^}]*)(background[^;]*;)/g,
                        `$1$2\n  filter: ${filterRule};`
                    );
                }
                
                // Emit completion hook
                emitLocalHook('cssEnhanced', {
                    originalCSS: ctx.css,
                    enhancedCSS: css,
                    filterRule: filterRule
                });
                
                return { ...ctx, css };
            }
        },
        
        // Public API
        enhanceColor: (color) => enhanceColor(color, config),
        getStats: () => ({ processedStops, enhancedColors }),
        getConfig: () => ({ ...config }),
        reset: () => { processedStops = 0; enhancedColors = 0; }
    };
    
    // Helper functions
    function enhanceColor(color, config) {
        let { r, g, b, a = 255 } = color;
        
        // Convert to HSL for better color manipulation
        const [h, s, l] = rgbToHsl(r, g, b);
        
        // Apply enhancements
        const newS = Math.min(1, s * config.saturationBoost);
        const newL = Math.min(1, l * config.brightnessBoost);
        
        // Convert back to RGB
        const [newR, newG, newB] = hslToRgb(h, newS, newL);
        
        // Apply contrast boost
        const contrast = config.contrastBoost;
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        
        return {
            r: Math.round(Math.min(255, Math.max(0, factor * (newR - 128) + 128))),
            g: Math.round(Math.min(255, Math.max(0, factor * (newG - 128) + 128))),
            b: Math.round(Math.min(255, Math.max(0, factor * (newB - 128) + 128))),
            a: a,
            position: color.position
        };
    }
    
    function buildFilterRule(config) {
        const filters = [];
        
        if (config.saturationBoost !== 1) {
            filters.push(`saturate(${config.saturationBoost})`);
        }
        if (config.brightnessBoost !== 1) {
            filters.push(`brightness(${config.brightnessBoost})`);
        }
        if (config.contrastBoost !== 1) {
            filters.push(`contrast(${config.contrastBoost})`);
        }
        
        return filters.length > 0 ? filters.join(' ') : null;
    }
    
    function colorChanged(original, enhanced) {
        return original.r !== enhanced.r || 
               original.g !== enhanced.g || 
               original.b !== enhanced.b;
    }
    
    // Color space conversion utilities
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return [h, s, l];
    }
    
    function hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}

// Registration
if (typeof globalThis !== 'undefined') {
    globalThis.ColorEnhancer = ColorEnhancer;
}
```

### 🎯 Plugin Examples

#### Stats Collection Plugin

```javascript
function StatsCollector(options = {}) {
    const stats = {
        startTime: null,
        endTime: null,
        phases: {},
        hooks: {},
        errors: []
    };
    
    return {
        name: 'StatsCollector',
        version: '1.0.0',
        
        hooks: {
            beforeProcess: (ctx) => {
                stats.startTime = performance.now();
                stats.phases.processing = { start: stats.startTime };
                return ctx;
            },
            
            afterProcess: (ctx) => {
                stats.endTime = performance.now();
                stats.phases.processing.end = stats.endTime;
                stats.phases.processing.duration = stats.endTime - stats.startTime;
                return ctx;
            },
            
            onError: (ctx) => {
                stats.errors.push({
                    stage: ctx.stage,
                    error: ctx.error.message,
                    timestamp: performance.now()
                });
                return ctx;
            }
        },
        
        getStats: () => ({ ...stats }),
        getReport: () => generateReport(stats)
    };
    
    function generateReport(stats) {
        return {
            totalTime: stats.endTime - stats.startTime,
            phases: Object.keys(stats.phases).map(name => ({
                name,
                duration: stats.phases[name].duration || 0
            })),
            errorCount: stats.errors.length,
            errors: stats.errors
        };
    }
}
```

#### CSS Framework Adapter Plugin

```javascript
function TailwindAdapter(options = {}) {
    const config = {
        prefix: options.prefix || 'img2css-',
        generateUtilities: options.generateUtilities !== false,
        addToSafelist: options.addToSafelist !== false,
        outputPath: options.outputPath
    };
    
    const generatedClasses = new Set();
    
    return {
        name: 'TailwindAdapter',
        version: '1.0.0',
        
        hooks: {
            afterBuildCSS: (ctx) => {
                const originalSelector = ctx.selector;
                const utilityClass = `${config.prefix}${generateClassHash(ctx.css)}`;
                
                // Replace selector with utility class
                const utilityCSS = ctx.css.replace(
                    new RegExp(escapeRegex(originalSelector), 'g'),
                    `.${utilityClass}`
                );
                
                // Wrap in Tailwind layer
                const wrappedCSS = `@layer utilities {\n${utilityCSS}\n}`;
                
                generatedClasses.add(utilityClass);
                
                // Generate safelist entry
                if (config.addToSafelist) {
                    addToSafelist(utilityClass);
                }
                
                return { ...ctx, css: wrappedCSS, utilityClass };
            }
        },
        
        getGeneratedClasses: () => Array.from(generatedClasses),
        exportConfig: () => ({
            safelist: Array.from(generatedClasses)
        })
    };
    
    function generateClassHash(css) {
        // Simple hash function for class names
        let hash = 0;
        for (let i = 0; i < css.length; i++) {
            const char = css.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function addToSafelist(className) {
        // Implementation would depend on how you want to integrate with Tailwind
        console.log(`Add to Tailwind safelist: ${className}`);
    }
}
```

#### Performance Optimizer Plugin

```javascript
function PerformanceOptimizer(options = {}) {
    const config = {
        enabled: options.enabled !== false,
        maxProcessingTime: options.maxProcessingTime || 5000, // 5 seconds
        adaptiveCompression: options.adaptiveCompression !== false,
        skipLargeImages: options.skipLargeImages !== false,
        maxImageSize: options.maxImageSize || 2000000 // 2MP
    };
    
    let processingStartTime = null;
    
    return {
        name: 'PerformanceOptimizer',
        version: '1.0.0',
        
        hooks: {
            beforeProcess: (ctx) => {
                if (!config.enabled) return ctx;
                
                processingStartTime = performance.now();
                
                // Check image size
                const pixels = ctx.imageData.width * ctx.imageData.height;
                if (config.skipLargeImages && pixels > config.maxImageSize) {
                    throw new Error(`Image too large: ${pixels} pixels (max: ${config.maxImageSize})`);
                }
                
                // Adaptive compression based on image size
                if (config.adaptiveCompression) {
                    if (pixels > 500000) {
                        ctx.config.processing.compression = Math.max(
                            ctx.config.processing.compression, 
                            25
                        );
                    }
                }
                
                return ctx;
            },
            
            shouldProcessLine: (ctx) => {
                // Skip processing if taking too long
                if (processingStartTime && 
                    performance.now() - processingStartTime > config.maxProcessingTime) {
                    return { process: ctx.index % 3 === 0 }; // Process every 3rd line
                }
                
                return { process: true };
            },
            
            beforeBuildCSS: (ctx) => {
                const elapsed = performance.now() - processingStartTime;
                console.log(`Processing took ${elapsed.toFixed(2)}ms`);
                return ctx;
            }
        }
    };
}
```

### 📦 Publishing Plugins

#### Plugin Package Structure

```
my-img2css-plugin/
├── package.json
├── README.md
├── CHANGELOG.md
├── src/
│   ├── index.js          # Main plugin file
│   ├── plugin.global.js  # Browser global version
│   └── utils/
│       └── helpers.js
├── examples/
│   ├── basic.html
│   └── advanced.js
├── tests/
│   └── plugin.test.js
└── docs/
    └── api.md
```

#### Package.json Example

```json
{
  "name": "img2css-color-enhancer",
  "version": "1.0.0",
  "description": "Color enhancement plugin for img2css",
  "main": "src/index.js",
  "browser": "src/plugin.global.js",
  "keywords": ["img2css", "plugin", "color", "enhancement"],
  "author": "Your Name",
  "license": "MIT",
  "peerDependencies": {
    "img2css": "^2.0.0"
  },
  "files": [
    "src/",
    "examples/",
    "README.md",
    "CHANGELOG.md"
  ]
}
```

#### Plugin Documentation Template

```markdown
# img2css Color Enhancer Plugin

Enhances colors in img2css gradients through saturation, brightness, and contrast adjustments.

## Installation

### Browser
```html
<script src="https://cdn.jsdelivr.net/npm/img2css-color-enhancer/src/plugin.global.js"></script>
```

### Node.js
```bash
npm install img2css-color-enhancer
```

## Usage

### Basic Usage
```javascript
const converter = new img2css({
    source: 'image.jpg',
    colorEnhancer: {
        enabled: true,
        saturationBoost: 1.2,
        brightnessBoost: 1.1
    }
});
```

### Advanced Usage
```javascript
const ColorEnhancer = require('img2css-color-enhancer');

const converter = new img2css({
    source: 'image.jpg',
    plugins: [
        ColorEnhancer({
            saturationBoost: 1.3,
            pluginHooks: {
                stopsEnhanced: (data) => {
                    console.log('Enhanced', data.enhanced.length, 'color stops');
                }
            }
        })
    ]
});
```

## API

### Configuration Options
- `enabled` (boolean) - Enable/disable plugin
- `saturationBoost` (number) - Saturation multiplier (default: 1.1)
- `brightnessBoost` (number) - Brightness multiplier (default: 1.05)

### Plugin Hooks
- `stopsEnhanced` - Called when color stops are enhanced
- `cssEnhanced` - Called when CSS filters are applied
```

### ⚡ Plugin Best Practices

#### Performance Guidelines

```javascript
// ✅ Good: Lightweight operations in frequently called hooks
hooks: {
    transformRawStops: (ctx) => {
        // Fast color transformations
        return { stops: ctx.stops.map(fastTransform) };
    }
}

// ❌ Avoid: Heavy operations in per-stop hooks
hooks: {
    transformRawStops: (ctx) => {
        // Don't do expensive operations here
        return { stops: ctx.stops.map(expensiveTransform) };
    }
}

// ✅ Good: Batch operations and cache results
const transformCache = new Map();
hooks: {
    transformRawStops: (ctx) => {
        const cacheKey = generateCacheKey(ctx);
        if (transformCache.has(cacheKey)) {
            return { stops: transformCache.get(cacheKey) };
        }
        
        const result = batchTransform(ctx.stops);
        transformCache.set(cacheKey, result);
        return { stops: result };
    }
}
```

#### Error Handling

```javascript
// ✅ Good: Graceful error handling
hooks: {
    afterBuildCSS: (ctx) => {
        try {
            const enhanced = enhanceCSS(ctx.css);
            return { ...ctx, css: enhanced };
        } catch (error) {
            console.warn('CSS enhancement failed:', error);
            return ctx; // Return original context
        }
    }
}

// ✅ Good: Validate configuration
function MyPlugin(options = {}) {
    // Validate options
    if (options.threshold && (options.threshold < 0 || options.threshold > 255)) {
        throw new Error('threshold must be between 0 and 255');
    }
    
    const config = {
        enabled: options.enabled !== false,
        threshold: Math.max(0, Math.min(255, options.threshold || 127))
    };
    
    return { /* plugin implementation */ };
}
```

#### Memory Management

```javascript
// ✅ Good: Clean up resources
function MyPlugin(options = {}) {
    const cache = new Map();
    
    return {
        hooks: {
            afterProcess: (ctx) => {
                // Clear cache after processing
                cache.clear();
                return ctx;
            }
        },
        
        // Provide cleanup method
        destroy: () => {
            cache.clear();
        }
    };
}

// ✅ Good: Use WeakMap for automatic cleanup
const processedImages = new WeakMap();

hooks: {
    afterLoad: (ctx) => {
        processedImages.set(ctx.imageData, { processed: true });
        return ctx;
    }
}
```

#### Testing Plugins

```javascript
// ✅ Good: Unit testable plugin functions
function createColorTransformer(config) {
    return {
        transformColor: (color) => {
            // Pure function, easy to test
            return enhanceColor(color, config);
        }
    };
}

// Test example
describe('ColorTransformer', () => {
    test('enhances saturation', () => {
        const transformer = createColorTransformer({ saturation: 1.5 });
        const result = transformer.transformColor({ r: 100, g: 150, b: 200 });
        
        expect(result.saturation).toBeGreaterThan(1.4);
    });
});

// ✅ Good: Integration testing
test('plugin integrates with img2css', async () => {
    const converter = new img2css({
        source: testImage,
        plugins: [MyPlugin({ testMode: true })]
    });
    
    const css = await converter.toCSS();
    expect(css).toContain('enhanced');
});
```

#### Documentation Standards

```javascript
/**
 * Color Enhancement Plugin for img2css
 * 
 * Enhances gradient colors through various adjustment techniques.
 * 
 * @param {Object} options - Plugin configuration
 * @param {boolean} [options.enabled=true] - Enable/disable plugin
 * @param {number} [options.saturationBoost=1.1] - Saturation multiplier
 * @param {number} [options.brightnessBoost=1.05] - Brightness multiplier
 * @param {Object} [options.pluginHooks={}] - Plugin-specific hooks
 * 
 * @returns {Object} Plugin instance
 * 
 * @example
 * const converter = new img2css({
 *     source: 'image.jpg',
 *     colorEnhancer: {
 *         saturationBoost: 1.3,
 *         brightnessBoost: 1.2
 *     }
 * });
 */
function ColorEnhancer(options = {}) {
    // Implementation
}
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

## 🛠️ Troubleshooting

### Common Error Messages and Solutions

#### "Canvas tainted by cross-origin data"
**Error**: SecurityError when processing images from external domains
```
Error: Failed to execute 'getImageData' on CanvasRenderingContext2D
```

**Solutions**:
```javascript
// 1. Use CORS-enabled servers with proper headers
fetch('https://api.example.com/image.jpg')
    .then(response => response.blob())
    .then(blob => {
        const converter = new img2css({ source: blob });
        return converter.toCSS();
    });

// 2. Convert to data URL first
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const converter = new img2css({ source: canvas });
    const css = await converter.toCSS();
};
img.src = 'https://example.com/image.jpg';
```

#### "Out of memory" with large images
**Error**: Browser runs out of memory during processing
```
Error: RangeError: Invalid array length
```

**Solutions**:
```javascript
// 1. Enable compression for large images
const converter = new img2css({
    source: 'large-image.jpg',
    compression: {
        enabled: true,
        maxWidth: 800,    // Limit processing width
        maxHeight: 600,   // Limit processing height
        quality: 0.8      // Reduce quality slightly
    }
});

// 2. Use progressive processing
const converter = new img2css({
    source: 'large-image.jpg',
    processing: 'hybrid',  // More memory efficient
    stats: 'none'          // Disable memory-intensive stats
});
```

#### "CSS too large" warnings
**Error**: Generated CSS exceeds reasonable size limits
```
Warning: Generated CSS is 2.3MB, consider optimization
```

**Solutions**:
```javascript
// 1. Use Soft Posterize to reduce color count
const converter = new img2css({
    source: 'detailed-image.jpg',
    softPosterize: {
        enabled: true,
        steps: 32,        // Reduce from default 64
        blurBoost: 1.2    // Increase blur for smoother gradients
    }
});

// 2. Enable compression
const converter = new img2css({
    source: 'detailed-image.jpg',
    compression: {
        enabled: true,
        maxWidth: 600,
        blurRadius: 2     // Add blur to reduce detail
    }
});
```

### Performance Issues and Fixes

#### Slow Processing Times
**Symptoms**: Processing takes more than 10-15 seconds
**Causes**: Large images, complex details, inefficient settings

**Optimizations**:
```javascript
// Fast processing configuration
const converter = new img2css({
    source: 'image.jpg',
    processing: 'rows',        // Faster than 'auto' or 'hybrid'
    compression: {
        enabled: true,
        maxWidth: 400,         // Limit processing size
        blurRadius: 1          // Add slight blur for speed
    },
    stats: 'none',             // Disable stats collection
    softPosterize: {
        enabled: true,
        steps: 16              // Lower step count
    }
});
```

#### Memory Usage Spikes
**Symptoms**: Browser becomes unresponsive, high RAM usage
**Solutions**:
```javascript
// Memory-efficient processing
const converter = new img2css({
    source: 'image.jpg',
    processing: 'hybrid',      // Most memory efficient
    compression: {
        enabled: true,
        maxWidth: 500,         // Reasonable limit
        maxHeight: 500
    }
});

// Process in chunks for very large images
async function processLargeImage(imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    await new Promise(resolve => img.onload = resolve);
    
    if (img.width * img.height > 1000000) { // 1MP threshold
        console.warn('Large image detected, using aggressive compression');
        return new img2css({
            source: img,
            compression: {
                enabled: true,
                maxWidth: 400,
                maxHeight: 400,
                quality: 0.7
            }
        }).toCSS();
    }
    
    return new img2css({ source: img }).toCSS();
}
```

### Browser-Specific Problems

#### Safari Canvas Issues
**Problem**: Safari has stricter canvas memory limits
```javascript
// Safari-specific optimizations
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const config = {
    source: 'image.jpg',
    compression: {
        enabled: true,
        maxWidth: isSafari ? 300 : 600,    // Smaller on Safari
        maxHeight: isSafari ? 300 : 600
    }
};

const converter = new img2css(config);
```

#### Firefox CORS Handling
**Problem**: Firefox stricter about tainted canvas
```javascript
// Firefox-compatible image loading
function loadImageSafely(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Try with CORS first
        img.crossOrigin = 'anonymous';
        
        img.onload = () => resolve(img);
        img.onerror = () => {
            // Fallback: try without CORS
            const img2 = new Image();
            img2.onload = () => resolve(img2);
            img2.onerror = reject;
            img2.src = src;
        };
        
        img.src = src;
    });
}
```

#### Mobile Browser Limitations
**Problem**: Limited memory and processing power
```javascript
// Mobile-optimized configuration
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const mobileConfig = {
    source: 'image.jpg',
    processing: 'rows',            // Fastest processing
    compression: {
        enabled: true,
        maxWidth: isMobile ? 200 : 400,
        maxHeight: isMobile ? 200 : 400,
        blurRadius: isMobile ? 2 : 1
    },
    softPosterize: {
        enabled: true,
        steps: isMobile ? 8 : 16   // Fewer colors on mobile
    },
    stats: 'none'                  // Disable stats on mobile
};
```

### Plugin Conflicts and Resolutions

#### Multiple Blur Plugins
**Problem**: Blur Boost and Soft Posterize both add blur
```javascript
// Coordinated blur usage
const converter = new img2css({
    source: 'image.jpg',
    blurBoost: {
        enabled: true,
        multiplier: 1.0            // Keep base level
    },
    softPosterize: {
        enabled: true,
        blurBoost: 1.5            // Let Soft Posterize handle extra blur
    }
});
```

#### Compression vs Quality Plugins
**Problem**: Compression reducing quality that plugins need
```javascript
// Balanced quality and compression
const converter = new img2css({
    source: 'image.jpg',
    compression: {
        enabled: true,
        maxWidth: 500,
        quality: 0.9              // High quality for plugins
    },
    normalMap: {                  // Quality-dependent plugin
        enabled: true,
        strength: 0.8             // Compensate for compression
    }
});
```

### Memory Issues and Optimization

#### Garbage Collection Assistance
```javascript
// Manual cleanup for intensive processing
async function processWithCleanup(imageSrc) {
    let converter = new img2css({ source: imageSrc });
    
    try {
        const css = await converter.toCSS();
        
        // Manual cleanup
        converter = null;
        
        // Force garbage collection (if available)
        if (window.gc) {
            window.gc();
        }
        
        return css;
    } catch (error) {
        converter = null;
        throw error;
    }
}
```

#### Memory Monitoring
```javascript
// Monitor memory usage during processing
const converter = new img2css({
    source: 'image.jpg',
    globalHooks: {
        beforeProcessing: () => {
            if (performance.memory) {
                console.log('Memory before:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');
            }
        },
        afterProcessing: () => {
            if (performance.memory) {
                console.log('Memory after:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');
            }
        }
    }
});
```

---

## ❓ FAQ

### "Why is my CSS so large?"

**Q**: The generated CSS is several megabytes. How can I reduce the size?

**A**: Large CSS files typically result from highly detailed images with many color variations. Try these approaches:

```javascript
// Approach 1: Use Soft Posterize to reduce colors
const converter = new img2css({
    source: 'detailed-image.jpg',
    softPosterize: {
        enabled: true,
        steps: 24,        // Fewer color stops
        blurBoost: 1.3    // More blur for smoother transitions
    }
});

// Approach 2: Enable compression
const converter = new img2css({
    source: 'detailed-image.jpg',
    compression: {
        enabled: true,
        maxWidth: 500,    // Smaller processing size
        blurRadius: 2     // Add blur to reduce detail
    }
});

// Approach 3: Use hybrid processing for better compression
const converter = new img2css({
    source: 'detailed-image.jpg',
    processing: 'hybrid'  // Often produces smaller CSS
});
```

### "How do I optimize for mobile?"

**Q**: My gradients look great on desktop but perform poorly on mobile devices.

**A**: Mobile optimization requires aggressive settings due to limited resources:

```javascript
// Mobile-optimized configuration
const converter = new img2css({
    source: 'image.jpg',
    processing: 'rows',           // Fastest processing mode
    compression: {
        enabled: true,
        maxWidth: 300,            // Small size for mobile
        maxHeight: 300,
        blurRadius: 2             // Extra blur for performance
    },
    softPosterize: {
        enabled: true,
        steps: 12                 // Fewer colors for less CSS
    }
});

// Responsive CSS implementation
const css = await converter.toCSS();
const responsiveCSS = `
/* Desktop version */
@media (min-width: 768px) {
    .gradient-element {
        ${css}
    }
}

/* Mobile version - simpler fallback */
@media (max-width: 767px) {
    .gradient-element {
        background: linear-gradient(45deg, #primary-color, #secondary-color);
    }
}
`;
```

### "Can I use this with frameworks?"

**Q**: How do I integrate img2css with React, Vue, or other frameworks?

**A**: img2css works seamlessly with all major frameworks. See the Framework Integration section below for detailed examples.

Quick React example:
```javascript
import { useState, useEffect } from 'react';
import img2css from './img2css.js';

function GradientBackground({ imageSrc }) {
    const [gradient, setGradient] = useState('');
    
    useEffect(() => {
        const generateGradient = async () => {
            const converter = new img2css({ source: imageSrc });
            const css = await converter.toCSS();
            setGradient(css);
        };
        
        generateGradient();
    }, [imageSrc]);
    
    return (
        <div 
            className="gradient-bg"
            style={{
                background: gradient.replace('background: ', ''),
                minHeight: '400px'
            }}
        />
    );
}
```

### "What's the difference between processing modes?"

**Q**: When should I use 'auto', 'rows', 'columns', or 'hybrid' processing?

**A**: Each mode has specific strengths:

- **Auto** (Default): Analyzes image content to choose optimal direction
  - Best for: General-purpose use, unknown image content
  - Performance: Medium
  - Quality: High

- **Rows**: Processes image row by row (horizontal gradients)
  - Best for: Landscapes, horizontal compositions
  - Performance: Fastest
  - Quality: Good for horizontal details

- **Columns**: Processes image column by column (vertical gradients)
  - Best for: Portraits, vertical compositions
  - Performance: Fast
  - Quality: Good for vertical details

- **Hybrid**: Combines multiple processing passes
  - Best for: Complex images, maximum quality needs
  - Performance: Slowest but most memory efficient
  - Quality: Highest for complex scenes

```javascript
// Mode selection based on image characteristics
function selectProcessingMode(imageWidth, imageHeight, complexity) {
    const aspectRatio = imageWidth / imageHeight;
    
    if (complexity === 'high') {
        return 'hybrid';    // Best quality for complex images
    } else if (aspectRatio > 1.5) {
        return 'rows';      // Wide/landscape images
    } else if (aspectRatio < 0.7) {
        return 'columns';   // Tall/portrait images
    } else {
        return 'auto';      // Let img2css decide
    }
}
```

### "How do I choose the right plugins?"

**Q**: There are many plugins available. Which ones should I use?

**A**: Plugin selection depends on your image type and desired output:

```javascript
// For photographs and realistic images
const photoConfig = {
    source: 'photo.jpg',
    blurBoost: { enabled: true, multiplier: 1.2 },
    normalMap: { enabled: true, strength: 0.6 }
};

// For illustrations and graphics
const artConfig = {
    source: 'illustration.png',
    softPosterize: { enabled: true, steps: 32 },
    colorPalette: { enabled: true, paletteSize: 16 }
};

// For logos and simple graphics
const logoConfig = {
    source: 'logo.svg',
    processing: 'auto',
    compression: { enabled: false }  // Keep crisp edges
};

// For web performance focus
const performanceConfig = {
    source: 'image.jpg',
    compression: { enabled: true, maxWidth: 400 },
    softPosterize: { enabled: true, steps: 16 },
    stats: 'none'
};
```

**Plugin Compatibility Matrix**:
- ✅ Blur Boost + Normal Map: Great for realistic textures
- ✅ Soft Posterize + Color Palette: Perfect for artistic effects
- ⚠️ Compression + Detail plugins: May conflict, tune carefully
- ❌ Multiple blur plugins: Avoid redundant blur application

---

## ⚡ Performance Guide

### Image Size Optimization Strategies

#### Automatic Upscaling Thresholds
img2css automatically upscales small images for better gradient quality:

```javascript
// Understanding upscaling behavior
const converter = new img2css({
    source: 'small-icon.png',  // 64x64 image
    globalHooks: {
        beforeProcessing: (data) => {
            console.log(`Original: ${data.originalWidth}x${data.originalHeight}`);
            console.log(`Processing: ${data.processingWidth}x${data.processingHeight}`);
            // Will show 2x upscaling: 128x128
        }
    }
});
```

#### Smart Compression Settings
Choose compression settings based on image characteristics:

```javascript
// Size-based compression strategy
function getCompressionConfig(imageWidth, imageHeight) {
    const pixels = imageWidth * imageHeight;
    
    if (pixels > 2000000) {        // 2MP+
        return {
            enabled: true,
            maxWidth: 600,
            maxHeight: 600,
            quality: 0.8,
            blurRadius: 2
        };
    } else if (pixels > 500000) {  // 0.5MP - 2MP
        return {
            enabled: true,
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.9,
            blurRadius: 1
        };
    } else {                       // Under 0.5MP
        return {
            enabled: false         // Keep original quality
        };
    }
}

// Usage
const img = new Image();
img.onload = async () => {
    const config = getCompressionConfig(img.width, img.height);
    const converter = new img2css({
        source: img,
        compression: config
    });
};
```

### Processing Mode Selection Guide

#### Performance Benchmarking
Test different modes to find optimal performance:

```javascript
// Benchmark processing modes
async function benchmarkModes(imageSrc) {
    const modes = ['rows', 'columns', 'auto', 'hybrid'];
    const results = {};
    
    for (const mode of modes) {
        const startTime = performance.now();
        
        const converter = new img2css({
            source: imageSrc,
            processing: mode,
            stats: 'timing'
        });
        
        await converter.toCSS();
        
        const endTime = performance.now();
        results[mode] = {
            duration: endTime - startTime,
            stats: converter.stats
        };
    }
    
    return results;
}

// Find fastest mode for your images
benchmarkModes('sample.jpg').then(results => {
    console.table(results);
});
```

#### Content-Aware Mode Selection
```javascript
// Analyze image content to select optimal mode
function analyzeImage(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Calculate horizontal vs vertical variation
    let horizontalVariation = 0;
    let verticalVariation = 0;
    
    // Simplified analysis (production code would be more sophisticated)
    for (let y = 0; y < canvas.height - 1; y++) {
        for (let x = 0; x < canvas.width - 1; x++) {
            const idx = (y * canvas.width + x) * 4;
            const nextHoriz = ((y) * canvas.width + (x + 1)) * 4;
            const nextVert = ((y + 1) * canvas.width + x) * 4;
            
            horizontalVariation += Math.abs(data[idx] - data[nextHoriz]);
            verticalVariation += Math.abs(data[idx] - data[nextVert]);
        }
    }
    
    return {
        recommendedMode: horizontalVariation > verticalVariation ? 'rows' : 'columns',
        complexity: (horizontalVariation + verticalVariation) / (canvas.width * canvas.height)
    };
}
```

### Memory Management Best Practices

#### Batch Processing for Multiple Images
```javascript
// Process multiple images efficiently
class ImageBatchProcessor {
    constructor(options = {}) {
        this.concurrency = options.concurrency || 2;  // Limit concurrent processing
        this.queue = [];
        this.processing = 0;
    }
    
    async processImage(imageSrc, config) {
        return new Promise((resolve, reject) => {
            this.queue.push({ imageSrc, config, resolve, reject });
            this.processNext();
        });
    }
    
    async processNext() {
        if (this.processing >= this.concurrency || this.queue.length === 0) {
            return;
        }
        
        const { imageSrc, config, resolve, reject } = this.queue.shift();
        this.processing++;
        
        try {
            const converter = new img2css({ ...config, source: imageSrc });
            const css = await converter.toCSS();
            resolve(css);
        } catch (error) {
            reject(error);
        } finally {
            this.processing--;
            setTimeout(() => this.processNext(), 100); // Brief pause for GC
        }
    }
}

// Usage
const processor = new ImageBatchProcessor({ concurrency: 1 }); // Sequential for memory
const results = await Promise.all([
    processor.processImage('image1.jpg', { processing: 'rows' }),
    processor.processImage('image2.jpg', { processing: 'columns' }),
    processor.processImage('image3.jpg', { processing: 'auto' })
]);
```

#### Memory Monitoring and Cleanup
```javascript
// Monitor memory usage during processing
class MemoryMonitor {
    constructor() {
        this.measurements = [];
    }
    
    measure(label) {
        if (performance.memory) {
            this.measurements.push({
                label,
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                timestamp: Date.now()
            });
        }
    }
    
    getReport() {
        return this.measurements.map((measurement, index) => {
            if (index === 0) return measurement;
            
            const prev = this.measurements[index - 1];
            return {
                ...measurement,
                delta: measurement.used - prev.used
            };
        });
    }
}

// Usage with img2css
const monitor = new MemoryMonitor();
monitor.measure('start');

const converter = new img2css({
    source: 'large-image.jpg',
    globalHooks: {
        beforeProcessing: () => monitor.measure('before processing'),
        afterProcessing: () => monitor.measure('after processing')
    }
});

const css = await converter.toCSS();
monitor.measure('complete');

console.table(monitor.getReport());
```

### Plugin Performance Characteristics

#### Performance Impact Matrix

| Plugin | Memory Impact | CPU Impact | CSS Size Impact | Quality Benefit |
|--------|---------------|------------|-----------------|-----------------|
| Blur Boost | Low | Low | None | Medium |
| Soft Posterize | Medium | High | Large Reduction | High |
| Normal Map | Medium | Medium | Increase | Medium |
| Color Palette | Low | Medium | Slight Reduction | Medium |
| Compression | Low | Low | Large Reduction | Variable |

#### Optimized Plugin Combinations
```javascript
// Performance-focused configuration
const fastConfig = {
    source: 'image.jpg',
    processing: 'rows',                    // Fastest mode
    compression: {
        enabled: true,
        maxWidth: 400,
        blurRadius: 1
    },
    softPosterize: {
        enabled: true,
        steps: 16,                         // Lower complexity
        blurBoost: 1.0
    },
    stats: 'none'                         // Disable stats collection
};

// Quality-focused configuration
const qualityConfig = {
    source: 'image.jpg',
    processing: 'hybrid',                 // Best quality
    blurBoost: {
        enabled: true,
        multiplier: 1.2
    },
    normalMap: {
        enabled: true,
        strength: 0.8
    },
    stats: 'detailed'                     // Full stats for analysis
};

// Balanced configuration
const balancedConfig = {
    source: 'image.jpg',
    processing: 'auto',                   // Smart selection
    compression: {
        enabled: true,
        maxWidth: 600,
        quality: 0.85
    },
    softPosterize: {
        enabled: true,
        steps: 24,                        // Moderate complexity
        blurBoost: 1.1
    },
    stats: 'standard'                     // Basic stats
};
```

### Caching Strategies

#### Browser Cache Integration
```javascript
// Cache processed gradients in localStorage
class GradientCache {
    constructor(maxSize = 50) {
        this.maxSize = maxSize;
        this.cache = new Map(JSON.parse(localStorage.getItem('img2css-cache') || '[]'));
    }
    
    generateKey(imageSrc, config) {
        // Create hash of image source and config
        return btoa(JSON.stringify({ src: imageSrc, config })).slice(0, 16);
    }
    
    get(imageSrc, config) {
        const key = this.generateKey(imageSrc, config);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
            return cached.css;
        }
        
        this.cache.delete(key);
        return null;
    }
    
    set(imageSrc, config, css) {
        const key = this.generateKey(imageSrc, config);
        
        // Implement LRU eviction
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            css,
            timestamp: Date.now()
        });
        
        // Persist to localStorage
        try {
            localStorage.setItem('img2css-cache', JSON.stringify([...this.cache]));
        } catch (e) {
            // Handle quota exceeded
            this.cache.clear();
        }
    }
}

// Usage with caching
const cache = new GradientCache();

async function processWithCache(imageSrc, config) {
    // Check cache first
    const cached = cache.get(imageSrc, config);
    if (cached) {
        console.log('Cache hit!');
        return cached;
    }
    
    // Process and cache
    const converter = new img2css({ ...config, source: imageSrc });
    const css = await converter.toCSS();
    
    cache.set(imageSrc, config, css);
    return css;
}
```

---

## 🏗️ Framework Integration Examples

### React/Next.js Integration

#### React Hook for img2css
```javascript
// useImg2css.js
import { useState, useEffect, useCallback } from 'react';
import img2css from '../lib/img2css.js';

export function useImg2css(imageSrc, config = {}) {
    const [gradient, setGradient] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const processImage = useCallback(async () => {
        if (!imageSrc) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const converter = new img2css({
                source: imageSrc,
                ...config
            });
            
            const css = await converter.toCSS();
            setGradient(css);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [imageSrc, config]);
    
    useEffect(() => {
        processImage();
    }, [processImage]);
    
    return { gradient, loading, error, retry: processImage };
}
```

#### React Component Example
```javascript
// GradientBackground.jsx
import React from 'react';
import { useImg2css } from '../hooks/useImg2css';

function GradientBackground({ 
    imageSrc, 
    children,
    config = {},
    className = '',
    fallbackColor = '#f0f0f0'
}) {
    const { gradient, loading, error } = useImg2css(imageSrc, config);
    
    const backgroundStyle = {
        background: gradient ? 
            gradient.replace('background: ', '') : 
            fallbackColor,
        transition: 'background 0.3s ease-in-out'
    };
    
    if (error) {
        console.warn('img2css error:', error);
    }
    
    return (
        <div 
            className={`gradient-background ${className}`}
            style={backgroundStyle}
            data-loading={loading}
            data-error={!!error}
        >
            {children}
        </div>
    );
}

export default GradientBackground;
```

#### Next.js Server-Side Processing
```javascript
// pages/api/process-image.js
import { readFile } from 'fs/promises';
import { join } from 'path';
import img2css from '../../lib/img2css.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    try {
        const { imagePath, config } = req.body;
        
        // Security: validate image path
        if (!imagePath.startsWith('/public/images/')) {
            return res.status(400).json({ message: 'Invalid image path' });
        }
        
        const fullPath = join(process.cwd(), imagePath);
        const imageBuffer = await readFile(fullPath);
        
        const converter = new img2css({
            source: imageBuffer,
            ...config
        });
        
        const css = await converter.toCSS();
        const stats = converter.stats;
        
        res.status(200).json({ css, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
```

#### Next.js Build-Time Processing
```javascript
// next.config.js
const img2css = require('./lib/img2css.js');
const glob = require('glob');
const { readFileSync, writeFileSync } = require('fs');

module.exports = {
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Process gradients at build time
            const images = glob.sync('./public/images/*.{jpg,png,webp}');
            
            images.forEach(async (imagePath) => {
                const converter = new img2css({
                    source: imagePath,
                    compression: { enabled: true, maxWidth: 600 },
                    softPosterize: { enabled: true, steps: 24 }
                });
                
                const css = await converter.toCSS();
                const outputPath = imagePath.replace(/\.(jpg|png|webp)$/, '.gradient.css');
                
                writeFileSync(outputPath, css);
                console.log(`Generated gradient: ${outputPath}`);
            });
        }
        
        return config;
    }
};
```

### Vue/Nuxt Integration

#### Vue 3 Composition API
```javascript
// composables/useImg2css.js
import { ref, watch, computed } from 'vue';
import img2css from '~/lib/img2css.js';

export function useImg2css(imageSrc, config = {}) {
    const gradient = ref('');
    const loading = ref(false);
    const error = ref(null);
    
    const backgroundStyle = computed(() => ({
        background: gradient.value ? 
            gradient.value.replace('background: ', '') : 
            'transparent'
    }));
    
    const processImage = async () => {
        if (!imageSrc.value) return;
        
        loading.value = true;
        error.value = null;
        
        try {
            const converter = new img2css({
                source: imageSrc.value,
                ...config.value
            });
            
            gradient.value = await converter.toCSS();
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };
    
    watch([imageSrc, config], processImage, { 
        immediate: true, 
        deep: true 
    });
    
    return {
        gradient,
        loading,
        error,
        backgroundStyle,
        processImage
    };
}
```

#### Vue Component
```vue
<!-- GradientBackground.vue -->
<template>
    <div 
        class="gradient-background"
        :style="backgroundStyle"
        :class="{ 
            'is-loading': loading, 
            'has-error': error 
        }"
    >
        <slot />
        
        <div v-if="loading" class="loading-overlay">
            Processing image...
        </div>
        
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { useImg2css } from '~/composables/useImg2css';

const props = defineProps({
    imageSrc: {
        type: String,
        required: true
    },
    config: {
        type: Object,
        default: () => ({})
    }
});

const { backgroundStyle, loading, error } = useImg2css(
    computed(() => props.imageSrc),
    computed(() => props.config)
);
</script>

<style scoped>
.gradient-background {
    position: relative;
    transition: background 0.3s ease-in-out;
    min-height: 200px;
}

.loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
}

.error-message {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #fee2e2;
    color: #dc2626;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
}
</style>
```

#### Nuxt 3 Server Processing
```javascript
// server/api/gradient.post.js
import img2css from '~/lib/img2css.js';

export default defineEventHandler(async (event) => {
    const { imageSrc, config } = await readBody(event);
    
    try {
        const converter = new img2css({
            source: imageSrc,
            ...config
        });
        
        const css = await converter.toCSS();
        
        return {
            success: true,
            css,
            stats: converter.stats
        };
    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message
        });
    }
});
```

### Angular Integration

#### Angular Service
```typescript
// services/img2css.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import img2css from '../lib/img2css.js';

export interface Img2cssConfig {
    processing?: 'auto' | 'rows' | 'columns' | 'hybrid';
    compression?: {
        enabled: boolean;
        maxWidth?: number;
        maxHeight?: number;
    };
    softPosterize?: {
        enabled: boolean;
        steps?: number;
    };
}

export interface GradientResult {
    css: string;
    stats?: any;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class Img2cssService {
    private cache = new Map<string, string>();
    
    processImage(imageSrc: string, config: Img2cssConfig = {}): Observable<GradientResult> {
        const cacheKey = this.generateCacheKey(imageSrc, config);
        
        if (this.cache.has(cacheKey)) {
            return new BehaviorSubject({
                css: this.cache.get(cacheKey)!
            }).asObservable();
        }
        
        return from(this.processImageInternal(imageSrc, config)).pipe(
            map(result => {
                if (result.css) {
                    this.cache.set(cacheKey, result.css);
                }
                return result;
            }),
            catchError(error => [{
                css: '',
                error: error.message
            }])
        );
    }
    
    private async processImageInternal(
        imageSrc: string, 
        config: Img2cssConfig
    ): Promise<GradientResult> {
        const converter = new img2css({
            source: imageSrc,
            ...config
        });
        
        const css = await converter.toCSS();
        
        return {
            css,
            stats: converter.stats
        };
    }
    
    private generateCacheKey(imageSrc: string, config: Img2cssConfig): string {
        return btoa(JSON.stringify({ src: imageSrc, config }));
    }
}
```

#### Angular Component
```typescript
// components/gradient-background.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { Img2cssService, Img2cssConfig } from '../services/img2css.service';

@Component({
    selector: 'app-gradient-background',
    template: `
        <div 
            class="gradient-background"
            [style.background]="backgroundStyle"
            [class.is-loading]="loading"
            [class.has-error]="hasError"
        >
            <ng-content></ng-content>
            
            <div *ngIf="loading" class="loading-overlay">
                Processing image...
            </div>
            
            <div *ngIf="hasError" class="error-message">
                {{ errorMessage }}
            </div>
        </div>
    `,
    styleUrls: ['./gradient-background.component.scss']
})
export class GradientBackgroundComponent implements OnInit, OnDestroy {
    @Input() imageSrc!: string;
    @Input() config: Img2cssConfig = {};
    @Input() fallbackColor = 'transparent';
    
    backgroundStyle: SafeStyle = '';
    loading = false;
    hasError = false;
    errorMessage = '';
    
    private destroy$ = new Subject<void>();
    
    constructor(
        private img2cssService: Img2cssService,
        private sanitizer: DomSanitizer
    ) {}
    
    ngOnInit() {
        this.processImage();
    }
    
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    
    private processImage() {
        if (!this.imageSrc) return;
        
        this.loading = true;
        this.hasError = false;
        
        this.img2cssService.processImage(this.imageSrc, this.config)
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.loading = false;
                
                if (result.error) {
                    this.hasError = true;
                    this.errorMessage = result.error;
                    this.backgroundStyle = this.sanitizer.bypassSecurityTrustStyle(
                        this.fallbackColor
                    );
                } else {
                    const cssValue = result.css.replace('background: ', '');
                    this.backgroundStyle = this.sanitizer.bypassSecurityTrustStyle(cssValue);
                }
            });
    }
}
```

### Svelte/SvelteKit Integration

#### Svelte Store
```javascript
// stores/img2css.js
import { writable, derived } from 'svelte/store';
import img2css from '../lib/img2css.js';

function createImg2cssStore() {
    const { subscribe, set, update } = writable({
        gradient: '',
        loading: false,
        error: null,
        stats: null
    });
    
    const processImage = async (imageSrc, config = {}) => {
        update(state => ({ ...state, loading: true, error: null }));
        
        try {
            const converter = new img2css({
                source: imageSrc,
                ...config
            });
            
            const css = await converter.toCSS();
            
            set({
                gradient: css,
                loading: false,
                error: null,
                stats: converter.stats
            });
        } catch (err) {
            set({
                gradient: '',
                loading: false,
                error: err.message,
                stats: null
            });
        }
    };
    
    return {
        subscribe,
        processImage,
        reset: () => set({
            gradient: '',
            loading: false,
            error: null,
            stats: null
        })
    };
}

export const img2cssStore = createImg2cssStore();

// Derived store for background style
export const backgroundStyle = derived(
    img2cssStore,
    $store => $store.gradient ? 
        $store.gradient.replace('background: ', '') : 
        'transparent'
);
```

#### Svelte Component
```svelte
<!-- GradientBackground.svelte -->
<script>
    import { onMount } from 'svelte';
    import { img2cssStore, backgroundStyle } from '../stores/img2css.js';
    
    export let imageSrc;
    export let config = {};
    export let fallbackColor = 'transparent';
    
    $: if (imageSrc) {
        img2cssStore.processImage(imageSrc, config);
    }
    
    onMount(() => {
        return () => img2cssStore.reset();
    });
</script>

<div 
    class="gradient-background"
    class:is-loading={$img2cssStore.loading}
    class:has-error={$img2cssStore.error}
    style="background: {$img2cssStore.gradient ? 
        $img2cssStore.gradient.replace('background: ', '') : 
        fallbackColor}"
>
    <slot />
    
    {#if $img2cssStore.loading}
        <div class="loading-overlay">
            Processing image...
        </div>
    {/if}
    
    {#if $img2cssStore.error}
        <div class="error-message">
            {$img2cssStore.error}
        </div>
    {/if}
</div>

<style>
    .gradient-background {
        position: relative;
        transition: background 0.3s ease-in-out;
        min-height: 200px;
    }
    
    .loading-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(4px);
    }
    
    .error-message {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #fee2e2;
        color: #dc2626;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
    }
</style>
```

### Server-Side Rendering Considerations

#### Universal Processing Function
```javascript
// utils/ssr-img2css.js
import img2css from '../lib/img2css.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function processImageSSR(imagePath, config = {}) {
    // Server-side: read from file system
    if (typeof window === 'undefined') {
        try {
            const fullPath = join(process.cwd(), 'public', imagePath);
            const imageBuffer = await readFile(fullPath);
            
            const converter = new img2css({
                source: imageBuffer,
                ...config
            });
            
            return await converter.toCSS();
        } catch (error) {
            console.warn('SSR img2css processing failed:', error.message);
            return null;
        }
    }
    
    // Client-side: process normally
    const converter = new img2css({
        source: imagePath,
        ...config
    });
    
    return await converter.toCSS();
}

// Hydration-safe component pattern
export function createHydrationSafeGradient(imagePath, config) {
    return {
        // Server-rendered gradient
        ssr: processImageSSR(imagePath, config),
        
        // Client-side processing
        csr: async () => {
            const converter = new img2css({
                source: imagePath,
                ...config
            });
            return await converter.toCSS();
        }
    };
}
```

---

## 🎯 Error Handling Guide

### Try-Catch Patterns

#### Basic Error Handling
```javascript
// Simple try-catch wrapper
async function safeProcessImage(imageSrc, config = {}) {
    try {
        const converter = new img2css({
            source: imageSrc,
            ...config
        });
        
        const css = await converter.toCSS();
        return { success: true, css };
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        };
    }
}

// Usage
const result = await safeProcessImage('image.jpg');
if (result.success) {
    console.log('Generated CSS:', result.css);
} else {
    console.error('Processing failed:', result.error);
}
```

#### Advanced Error Categorization
```javascript
// Categorized error handler
class Img2cssErrorHandler {
    static categorizeError(error) {
        if (error.message.includes('CORS')) {
            return {
                type: 'CORS_ERROR',
                severity: 'high',
                userMessage: 'Image could not be loaded due to CORS restrictions',
                solution: 'Use a CORS-enabled server or local images'
            };
        }
        
        if (error.message.includes('Canvas')) {
            return {
                type: 'CANVAS_ERROR',
                severity: 'high',
                userMessage: 'Browser canvas limitations encountered',
                solution: 'Reduce image size or enable compression'
            };
        }
        
        if (error.message.includes('memory') || error.message.includes('RangeError')) {
            return {
                type: 'MEMORY_ERROR',
                severity: 'critical',
                userMessage: 'Image is too large to process',
                solution: 'Enable compression with smaller maxWidth/maxHeight'
            };
        }
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
            return {
                type: 'NETWORK_ERROR',
                severity: 'medium',
                userMessage: 'Could not load image from URL',
                solution: 'Check internet connection and image URL'
            };
        }
        
        return {
            type: 'UNKNOWN_ERROR',
            severity: 'medium',
            userMessage: 'An unexpected error occurred',
            solution: 'Try again with different settings'
        };
    }
    
    static async processWithRecovery(imageSrc, config = {}) {
        const attempts = [
            // First attempt: as configured
            () => new img2css({ source: imageSrc, ...config }).toCSS(),
            
            // Second attempt: with compression
            () => new img2css({
                source: imageSrc,
                ...config,
                compression: {
                    enabled: true,
                    maxWidth: 400,
                    maxHeight: 400
                }
            }).toCSS(),
            
            // Third attempt: minimal settings
            () => new img2css({
                source: imageSrc,
                processing: 'rows',
                compression: {
                    enabled: true,
                    maxWidth: 200,
                    maxHeight: 200,
                    blurRadius: 2
                },
                stats: 'none'
            }).toCSS()
        ];
        
        for (let i = 0; i < attempts.length; i++) {
            try {
                const css = await attempts[i]();
                return {
                    success: true,
                    css,
                    attemptsUsed: i + 1
                };
            } catch (error) {
                const errorInfo = this.categorizeError(error);
                
                if (i === attempts.length - 1) {
                    // Last attempt failed
                    return {
                        success: false,
                        error: errorInfo,
                        attemptsUsed: attempts.length
                    };
                }
                
                console.warn(`Attempt ${i + 1} failed: ${errorInfo.userMessage}`);
            }
        }
    }
}

// Usage
const result = await Img2cssErrorHandler.processWithRecovery('image.jpg', {
    processing: 'hybrid',
    softPosterize: { enabled: true }
});

if (result.success) {
    console.log(`Success after ${result.attemptsUsed} attempt(s)`);
    console.log('CSS:', result.css);
} else {
    console.error('All attempts failed:', result.error);
    // Show user-friendly message
    alert(result.error.userMessage + '\n\nSuggestion: ' + result.error.solution);
}
```

### Graceful Degradation

#### Progressive Enhancement Pattern
```javascript
// Progressive enhancement with fallbacks
class GradientWithFallbacks {
    constructor(element, imageSrc, config = {}) {
        this.element = element;
        this.imageSrc = imageSrc;
        this.config = config;
        this.fallbacks = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Generic gradient
            '#667eea', // Solid color
            'transparent' // Final fallback
        ];
    }
    
    async apply() {
        // Set immediate fallback
        this.element.style.background = this.fallbacks[0];
        
        try {
            // Attempt img2css processing
            const converter = new img2css({
                source: this.imageSrc,
                ...this.config
            });
            
            const css = await converter.toCSS();
            const gradientValue = css.replace('background: ', '');
            
            // Smooth transition to generated gradient
            this.element.style.transition = 'background 0.5s ease-in-out';
            this.element.style.background = gradientValue;
            
            return { success: true, method: 'img2css' };
            
        } catch (error) {
            console.warn('img2css failed, using color extraction fallback');
            
            try {
                // Fallback: extract dominant colors
                const colors = await this.extractDominantColors();
                const fallbackGradient = this.createSimpleGradient(colors);
                
                this.element.style.background = fallbackGradient;
                return { success: true, method: 'color-extraction' };
                
            } catch (extractError) {
                console.warn('Color extraction failed, using static fallback');
                
                // Final fallback: keep the predefined gradient
                return { success: true, method: 'static-fallback' };
            }
        }
    }
    
    async extractDominantColors() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = 'anonymous';
        
        return new Promise((resolve, reject) => {
            img.onload = () => {
                canvas.width = 100; // Small size for performance
                canvas.height = 100;
                ctx.drawImage(img, 0, 0, 100, 100);
                
                try {
                    const imageData = ctx.getImageData(0, 0, 100, 100);
                    const colors = this.analyzeColors(imageData.data);
                    resolve(colors);
                } catch (err) {
                    reject(err);
                }
            };
            
            img.onerror = reject;
            img.src = this.imageSrc;
        });
    }
    
    analyzeColors(data) {
        const colorMap = new Map();
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
        
        // Get top 3 colors
        return Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([color]) => color);
    }
    
    createSimpleGradient(colors) {
        if (colors.length === 0) return this.fallbacks[1];
        if (colors.length === 1) return colors[0];
        
        return `linear-gradient(135deg, ${colors.join(', ')})`;
    }
}

// Usage
const gradientHandler = new GradientWithFallbacks(
    document.getElementById('hero-section'),
    'https://example.com/hero-image.jpg',
    { processing: 'auto', compression: { enabled: true } }
);

gradientHandler.apply().then(result => {
    console.log(`Applied gradient using: ${result.method}`);
});
```

### Error Recovery Strategies

#### Retry with Exponential Backoff
```javascript
// Robust retry mechanism
class RetryableImg2css {
    constructor(config = {}) {
        this.maxRetries = config.maxRetries || 3;
        this.baseDelay = config.baseDelay || 1000;
        this.maxDelay = config.maxDelay || 10000;
    }
    
    async processWithRetry(imageSrc, config = {}) {
        let lastError;
        
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    const delay = Math.min(
                        this.baseDelay * Math.pow(2, attempt - 1),
                        this.maxDelay
                    );
                    
                    console.log(`Retry attempt ${attempt} after ${delay}ms delay`);
                    await this.sleep(delay);
                }
                
                // Modify config based on attempt number
                const retryConfig = this.getRetryConfig(config, attempt);
                
                const converter = new img2css({
                    source: imageSrc,
                    ...retryConfig
                });
                
                const css = await converter.toCSS();
                
                return {
                    success: true,
                    css,
                    attempt,
                    retriesUsed: attempt
                };
                
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt + 1} failed:`, error.message);
                
                // Don't retry certain errors
                if (this.isNonRetryableError(error)) {
                    break;
                }
            }
        }
        
        return {
            success: false,
            error: lastError.message,
            retriesUsed: this.maxRetries
        };
    }
    
    getRetryConfig(baseConfig, attempt) {
        // Progressively reduce quality/complexity on retries
        const retryConfigs = [
            baseConfig, // Original config
            {
                ...baseConfig,
                compression: {
                    enabled: true,
                    maxWidth: 600,
                    maxHeight: 600
                }
            },
            {
                ...baseConfig,
                processing: 'rows',
                compression: {
                    enabled: true,
                    maxWidth: 400,
                    maxHeight: 400
                },
                softPosterize: {
                    enabled: true,
                    steps: 16
                }
            },
            {
                processing: 'rows',
                compression: {
                    enabled: true,
                    maxWidth: 200,
                    maxHeight: 200,
                    blurRadius: 3
                },
                stats: 'none'
            }
        ];
        
        return retryConfigs[Math.min(attempt, retryConfigs.length - 1)];
    }
    
    isNonRetryableError(error) {
        const nonRetryablePatterns = [
            'CORS',
            'SecurityError',
            'InvalidImageFormat'
        ];
        
        return nonRetryablePatterns.some(pattern =>
            error.message.includes(pattern)
        );
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage
const retryableProcessor = new RetryableImg2css({
    maxRetries: 3,
    baseDelay: 1000
});

const result = await retryableProcessor.processWithRetry('image.jpg', {
    processing: 'hybrid',
    softPosterize: { enabled: true, steps: 32 }
});

if (result.success) {
    console.log(`Success after ${result.retriesUsed} retries`);
} else {
    console.error(`Failed after ${result.retriesUsed} retries: ${result.error}`);
}
```

### Logging and Monitoring

#### Comprehensive Logging System
```javascript
// Production logging system
class Img2cssLogger {
    constructor(config = {}) {
        this.logLevel = config.logLevel || 'info'; // debug, info, warn, error
        this.enableRemoteLogging = config.enableRemoteLogging || false;
        this.remoteEndpoint = config.remoteEndpoint;
        this.sessionId = this.generateSessionId();
    }
    
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    log(level, message, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            sessionId: this.sessionId,
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Console logging
        if (this.shouldLog(level)) {
            console[level](`[img2css] ${message}`, data);
        }
        
        // Remote logging
        if (this.enableRemoteLogging && level !== 'debug') {
            this.sendToRemote(logEntry);
        }
        
        return logEntry;
    }
    
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentIndex = levels.indexOf(this.logLevel);
        const messageIndex = levels.indexOf(level);
        return messageIndex >= currentIndex;
    }
    
    async sendToRemote(logEntry) {
        try {
            await fetch(this.remoteEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });
        } catch (error) {
            // Don't let logging errors break the application
            console.warn('Failed to send log to remote endpoint:', error);
        }
    }
    
    // Convenience methods
    debug(message, data) { return this.log('debug', message, data); }
    info(message, data) { return this.log('info', message, data); }
    warn(message, data) { return this.log('warn', message, data); }
    error(message, data) { return this.log('error', message, data); }
}

// Enhanced img2css wrapper with logging
class LoggedImg2css {
    constructor(config = {}) {
        this.logger = new Img2cssLogger(config.logging);
        this.config = config;
    }
    
    async processImage(imageSrc, processingConfig = {}) {
        const startTime = performance.now();
        const processId = Math.random().toString(36).substr(2, 9);
        
        this.logger.info('Processing started', {
            processId,
            imageSrc: typeof imageSrc === 'string' ? imageSrc : 'blob/buffer',
            config: processingConfig
        });
        
        try {
            const converter = new img2css({
                source: imageSrc,
                ...processingConfig,
                globalHooks: {
                    beforeProcessing: (data) => {
                        this.logger.debug('Before processing', {
                            processId,
                            dimensions: `${data.width}x${data.height}`,
                            processingMode: data.processingMode
                        });
                    },
                    afterProcessing: (data) => {
                        this.logger.debug('After processing', {
                            processId,
                            cssLength: data.css?.length || 0,
                            processingTime: data.processingTime
                        });
                    }
                }
            });
            
            const css = await converter.toCSS();
            const endTime = performance.now();
            
            this.logger.info('Processing completed', {
                processId,
                duration: endTime - startTime,
                cssSize: css.length,
                stats: converter.stats
            });
            
            return { success: true, css, stats: converter.stats };
            
        } catch (error) {
            const endTime = performance.now();
            
            this.logger.error('Processing failed', {
                processId,
                duration: endTime - startTime,
                error: error.message,
                stack: error.stack,
                imageSrc: typeof imageSrc === 'string' ? imageSrc : 'blob/buffer',
                config: processingConfig
            });
            
            return { success: false, error: error.message };
        }
    }
}

// Usage
const processor = new LoggedImg2css({
    logging: {
        logLevel: 'info',
        enableRemoteLogging: true,
        remoteEndpoint: '/api/logs'
    }
});

const result = await processor.processImage('image.jpg', {
    processing: 'auto',
    compression: { enabled: true }
});
```

### User Feedback Patterns

#### User-Friendly Error Messages
```javascript
// User feedback component
class Img2cssUserFeedback {
    constructor(container) {
        this.container = container;
        this.createFeedbackElements();
    }
    
    createFeedbackElements() {
        // Create notification container
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'img2css-notifications';
        this.notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(this.notificationContainer);
    }
    
    showNotification(type, title, message, duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `img2css-notification img2css-notification--${type}`;
        notification.style.cssText = `
            background: ${this.getTypeColor(type)};
            color: white;
            padding: 16px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            pointer-events: auto;
            cursor: pointer;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.9;">${message}</div>
            <div style="position: absolute; top: 8px; right: 12px; cursor: pointer; font-size: 18px;">&times;</div>
        `;
        
        // Auto-dismiss
        const autoDismiss = setTimeout(() => this.dismissNotification(notification), duration);
        
        // Manual dismiss
        notification.onclick = () => {
            clearTimeout(autoDismiss);
            this.dismissNotification(notification);
        };
        
        this.notificationContainer.appendChild(notification);
        
        // Slide in animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        return notification;
    }
    
    dismissNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    getTypeColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || colors.info;
    }
    
    showProcessingProgress(imageName) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'img2css-progress';
        progressContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 24px 32px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 10001;
            min-width: 300px;
        `;
        
        progressContainer.innerHTML = `
            <div style="margin-bottom: 16px; font-weight: 600; color: #374151;">
                Processing ${imageName}...
            </div>
            <div class="progress-bar" style="
                width: 100%;
                height: 6px;
                background: #e5e7eb;
                border-radius: 3px;
                overflow: hidden;
            ">
                <div class="progress-fill" style="
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 3px;
                "></div>
            </div>
            <div style="margin-top: 12px; font-size: 12px; color: #6b7280;">
                This may take a moment for large images...
            </div>
        `;
        
        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;
        
        document.body.appendChild(backdrop);
        document.body.appendChild(progressContainer);
        
        // Animate progress bar
        const progressFill = progressContainer.querySelector('.progress-fill');
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90; // Don't complete until actually done
            progressFill.style.width = `${progress}%`;
        }, 200);
        
        return {
            complete: () => {
                clearInterval(progressInterval);
                progressFill.style.width = '100%';
                setTimeout(() => {
                    document.body.removeChild(backdrop);
                    document.body.removeChild(progressContainer);
                }, 500);
            },
            error: () => {
                clearInterval(progressInterval);
                document.body.removeChild(backdrop);
                document.body.removeChild(progressContainer);
            }
        };
    }
    
    // High-level error handling with user feedback
    async processImageWithFeedback(imageSrc, config = {}) {
        const imageName = typeof imageSrc === 'string' ? 
            imageSrc.split('/').pop() : 
            'uploaded image';
        
        const progress = this.showProcessingProgress(imageName);
        
        try {
            const converter = new img2css({
                source: imageSrc,
                ...config
            });
            
            const css = await converter.toCSS();
            
            progress.complete();
            
            this.showNotification(
                'success',
                'Gradient Generated!',
                `Successfully converted ${imageName} to CSS gradient (${(css.length / 1024).toFixed(1)}KB)`
            );
            
            return { success: true, css };
            
        } catch (error) {
            progress.error();
            
            // User-friendly error messages
            let userMessage = 'An unexpected error occurred while processing your image.';
            let suggestions = 'Please try again with a different image or settings.';
            
            if (error.message.includes('CORS')) {
                userMessage = 'Unable to load image due to browser security restrictions.';
                suggestions = 'Try uploading the image directly or using a different source.';
            } else if (error.message.includes('memory')) {
                userMessage = 'The image is too large to process in your browser.';
                suggestions = 'Try using a smaller image or enable compression in settings.';
            } else if (error.message.includes('Canvas')) {
                userMessage = 'Browser limitations prevent processing this image.';
                suggestions = 'Try reducing the image size or using a different format.';
            }
            
            this.showNotification(
                'error',
                'Processing Failed',
                `${userMessage} ${suggestions}`,
                8000 // Longer duration for error messages
            );
            
            return { success: false, error: error.message };
        }
    }
}

// Usage
const feedback = new Img2cssUserFeedback();

// Process image with user feedback
const result = await feedback.processImageWithFeedback('large-image.jpg', {
    compression: { enabled: true },
    softPosterize: { enabled: true }
});

if (result.success) {
    console.log('Processing completed successfully!');
} else {
    console.error('Processing failed:', result.error);
}
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