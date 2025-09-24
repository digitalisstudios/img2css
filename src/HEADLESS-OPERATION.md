# img2css v2 Headless Operation Guide

img2css v2 is designed to work seamlessly in headless environments (Node.js, Web Workers, Service Workers) while maintaining full functionality for UI applications.

## ✅ Headless Compatibility

### Core Features (Fully Supported)
- **CSS gradient generation** - Complete processing pipeline
- **Plugin system** - All hooks and processing work headlessly  
- **Stats collection** - Memory-safe plugin result capture
- **Configuration** - Full plugin shorthand and advanced options
- **Error handling** - Robust operation without DOM dependencies

### UI Features (Gracefully Skipped)
- **Plugin auto-loading** - Manual import/require needed in headless
- **Custom content rendering** - Automatically detects and skips DOM creation
- **Preview elements** - UI-specific hooks are optional and safe

## 🚀 Headless Usage Examples

### Node.js Server Environment
```javascript
// Load plugins manually (no auto-loading in headless)
const { Lighting } = require('./plugins/lighting.global.js');
const { MapExtractor } = require('./plugins/map-extractor.global.js');
const img2css = require('./img2css.js');

// Full featured usage
const converter = new img2css({
  source: 'path/to/image.jpg',
  
  // Plugin shorthand works perfectly
  lighting: {
    enabled: true,
    lightAngle: 171,
    blendMode: 'screen',
    highlightAlpha: 1.0
  },
  
  mapExtractor: {
    enabled: true,
    types: ['normal', 'roughness', 'subjectnormal']
  },
  
  // Stats collection with memory control
  stats: {
    level: 'standard',
    plugins: ['lighting', 'mapExtractor']
  }
});

const css = await converter.toCSS();
console.log('Generated CSS:', css);

// Access plugin results
if (converter.stats.plugins) {
  const { mapExtractor, lighting } = converter.stats.plugins;
  console.log('Normal map CSS:', mapExtractor.maps.normal?.css);
  console.log('Lighting applied:', lighting.hasLightingEffects);
}
```

### Web Worker Environment
```javascript
// Inside worker script
importScripts('plugins/lighting.global.js');
importScripts('plugins/map-extractor.global.js'); 
importScripts('img2css.js');

self.onmessage = async function(e) {
  const { imageData, config } = e.data;
  
  const converter = new img2css({
    source: imageData,
    lighting: config.lighting,
    mapExtractor: config.mapExtractor,
    stats: 'standard'
  });
  
  try {
    const css = await converter.toCSS();
    
    // Send results back to main thread
    self.postMessage({
      success: true,
      css: css,
      stats: converter.stats
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    });
  }
};
```

### Batch Processing Server
```javascript
const express = require('express');
const img2css = require('./img2css.js');

const app = express();

app.post('/convert', async (req, res) => {
  try {
    const converter = new img2css({
      source: req.body.imageUrl,
      
      // Use minimal stats to prevent memory accumulation
      stats: 'minimal',
      
      // Configure plugins as needed
      lighting: req.body.lighting || { enabled: false },
      mapExtractor: req.body.mapExtractor || { enabled: false }
    });
    
    const css = await converter.toCSS();
    
    res.json({
      success: true,
      css: css,
      dimensions: converter.stats.settings.dimensions
    });
    
    // Clear reference to prevent memory leaks
    converter.stats = null;
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

## 🔧 Headless-Specific Configurations

### Memory-Safe Defaults
```javascript
// Minimal memory footprint (default)
const converter = new img2css({
  source: 'image.jpg',
  // stats: 'minimal' <- default, no plugin results stored
});

// Controlled plugin result collection
const converter = new img2css({
  source: 'image.jpg',
  lighting: { enabled: true },
  mapExtractor: { enabled: true },
  stats: {
    level: 'standard',
    plugins: ['mapExtractor']  // Only collect from specific plugins
  }
});
```

### Plugin Loading Strategies
```javascript
// Strategy 1: Pre-import all plugins
const { Lighting } = require('./plugins/lighting.global.js');
const { MapExtractor } = require('./plugins/map-extractor.global.js');

// Strategy 2: Conditional loading
function loadPlugins(config) {
  const plugins = [];
  
  if (config.lighting) {
    const { Lighting } = require('./plugins/lighting.global.js');
    plugins.push(Lighting(config.lighting));
  }
  
  if (config.mapExtractor) {
    const { MapExtractor } = require('./plugins/map-extractor.global.js');
    plugins.push(MapExtractor(config.mapExtractor));
  }
  
  return plugins;
}

const converter = new img2css({
  source: 'image.jpg',
  plugins: loadPlugins(userConfig)
});
```

## 🛡️ Error Handling & Resilience

### Missing Plugin Graceful Handling
```javascript
// Will not throw if plugins aren't loaded
const converter = new img2css({
  source: 'image.jpg',
  lighting: { enabled: true },           // Safe if Lighting not loaded
  mapExtractor: { enabled: true },       // Safe if MapExtractor not loaded
  nonExistentPlugin: { enabled: true }   // Safe - ignored gracefully
});

// Check what plugins were actually loaded
console.log('Loaded plugins:', converter._plugins.length);
```

### DOM-Safe Plugin Features
```javascript
// MapExtractor automatically detects headless environment
const mapExtractorPlugin = MapExtractor({
  enabled: true,
  types: ['normal', 'roughness']
});

// customContent() returns null in headless, won't break plugin-ui.js
const customContent = mapExtractorPlugin.ui.customContent({ enabled: true });
// customContent === null in headless environments
```

### Hook Execution Safety
```javascript
// All plugin hooks handle missing DOM elements gracefully
const lightingPlugin = Lighting({ enabled: true });

// These work fine with null/undefined elements
lightingPlugin.hooks.beforeMaskLoaded({
  mask: 'linear-gradient(...)',
  element: null,  // No DOM element - safe
  mapType: 'roughness'
});
```

## 📊 Performance Considerations

### Memory Management
```javascript
// For batch processing, use minimal stats
const results = [];

for (const imagePath of imagePaths) {
  const converter = new img2css({
    source: imagePath,
    lighting: { enabled: true },
    stats: 'minimal'  // Prevents memory accumulation
  });
  
  const css = await converter.toCSS();
  results.push({ 
    path: imagePath, 
    css: css,
    size: converter.stats.settings.dimensions 
  });
  
  // Clear reference
  converter.stats = null;
}
```

### Canvas Requirements
- **Node.js**: Requires `canvas` package for image processing
- **Web Workers**: OffscreenCanvas supported in modern browsers  
- **Service Workers**: Limited canvas support, may need image data preprocessing

## 🌍 Environment Compatibility

| Environment | DOM | Canvas | img2css Support | Notes |
|-------------|-----|--------|-----------------|-------|
| **Node.js** | ❌ | ✅* | ✅ Full | *Requires `canvas` package |
| **Web Worker** | ❌ | ✅ | ✅ Full | OffscreenCanvas supported |
| **Service Worker** | ❌ | ⚠️ | ⚠️ Limited | Canvas support varies |
| **React Native** | ❌ | ❌ | ⚠️ Limited | May need preprocessing |
| **Browser** | ✅ | ✅ | ✅ Full | Complete functionality |

## 🔍 Testing Headless Operation

```javascript
// Test basic headless functionality
const converter = new img2css({
  source: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  lighting: { enabled: true, lightAngle: 45 },
  stats: 'standard'
});

const css = await converter.toCSS();
console.assert(css.includes('background'), 'CSS should contain background');
console.assert(converter.stats.plugins, 'Plugin results should be collected');
console.log('✅ Headless operation test passed');
```

## 🎯 Best Practices

1. **Use minimal stats by default** to prevent memory issues
2. **Pre-load plugins** in headless environments (no auto-loading)
3. **Clear converter references** after use in batch processing
4. **Handle missing canvas gracefully** in limited environments
5. **Test headless operation** as part of your deployment pipeline

## 🔄 Migration from v1

v1 required DOM for all operations. v2 provides:
- ✅ **Headless-first design** - works everywhere
- ✅ **Optional UI features** - gracefully skipped when not available
- ✅ **Memory-safe defaults** - prevents accumulation in server environments
- ✅ **Robust error handling** - doesn't break on missing dependencies