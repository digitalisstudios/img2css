# img2css v2

A powerful JavaScript library for converting images into pure CSS gradients with an advanced plugin system for lighting effects, map extraction, and sophisticated processing options.

## 🌟 [**Try The Live Demo**](https://codepen.io/digitalisstudios/full/OPMPPaZ)

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

## **Why Convert Images to CSS?**

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

## Installation

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

## Quick Start

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

## Plugin System

### Available Plugins

#### 🌟 **Lighting Plugin**
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

#### 🗺️ **Map Extractor Plugin**  
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

### Plugin Configuration Methods

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

## Enhanced Stats System

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

## Headless Operation

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

## Processing Configuration

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

## API Reference

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

## Browser Support

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

## Examples

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

## Performance Tips

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

## Migration from v1

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

## Future Roadmap

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

## License

MIT License - see LICENSE file for details.

## Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## Support

- 📖 [Documentation](https://github.com/digitalisstudios/img2css/wiki)
- 🐛 [Issues](https://github.com/digitalisstudios/img2css/issues)  
- 💬 [Discussions](https://github.com/digitalisstudios/img2css/discussions)
- 🌟 [Live Demo](https://codepen.io/digitalisstudios/full/OPMPPaZ)