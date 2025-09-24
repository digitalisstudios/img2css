# img2css v2 API Surface Analysis

## Current Programmatic API

### Basic Usage
```javascript
import img2css from './img2css.js';

const converter = new img2css({
  source: 'image.jpg',
  selector: '.my-gradient',
  processing: {
    details: 80,
    compression: 15,
    mode: 'auto'
  }
});

const css = await converter.toCSS();
```

### Plugin Integration
```javascript
// Load plugins
import './plugins/lighting.global.js';
import './plugins/map-extractor.global.js';

// Create plugin instances
const lightingPlugin = Lighting({
  enabled: true,
  lightAngle: 171,
  blendMode: 'screen',
  highlightAlpha: 1.0,
  color: '#ffffff'
});

const mapExtractorPlugin = MapExtractor({
  enabled: true,
  types: ['normal', 'roughness', 'subjectnormal'],
  threshold: 127
});

// Use with img2css
const converter = new img2css({
  source: 'image.jpg',
  plugins: [lightingPlugin, mapExtractorPlugin],
  hooks: {
    onMapCSS: function(data) {
      console.log(`Generated ${data.type} map:`, data.css);
    },
    afterBuildCSS: function(ctx) {
      console.log('Final CSS with lighting effects generated');
      return ctx;
    }
  }
});
```

### Available Hooks
```javascript
const converter = new img2css({
  source: 'image.jpg',
  hooks: {
    // Initialization
    onInit: (ctx) => console.log('Initialized'),
    
    // Loading
    beforeLoad: (ctx) => console.log('Loading image...'),
    afterLoad: (ctx) => console.log('Image loaded'),
    
    // Processing
    beforeProcess: (ctx) => console.log('Processing started'),
    afterProcess: (ctx) => console.log('Processing complete'),
    beforeScale: (ctx) => ctx,
    afterScale: (ctx) => ctx,
    
    // CSS Generation
    beforeBuildCSS: (ctx) => ctx,
    afterBuildCSS: (ctx) => ctx,  // ← Lighting effects hook into here
    
    // Error handling
    onError: (ctx) => console.error('Error:', ctx.error)
  }
});
```

## Issues Found

### ❌ Missing: Direct Plugin Configuration
**Problem**: No way to configure plugin settings directly in constructor
**Current**: Must create plugin instances separately
**Needed**: 
```javascript
const converter = new img2css({
  source: 'image.jpg',
  lighting: {
    enabled: true,
    lightAngle: 171,
    blendMode: 'screen'
  },
  mapExtractor: {
    enabled: true,
    types: ['normal', 'roughness']
  }
});
```

### ❌ Missing: Plugin Results Access
**Problem**: No direct access to plugin-generated content (maps, lighting CSS)
**Current**: Must use hooks to capture results
**Needed**:
```javascript
const result = await converter.toCSS();
// result.css - main gradient
// result.maps.normal - normal map CSS
// result.maps.roughness - roughness map CSS  
// result.lighting - lighting overlay CSS
```

### ❌ Missing: Plugin State Management
**Problem**: No way to update plugin settings after instantiation
**Needed**:
```javascript
converter.updateLighting({ lightAngle: 45 });
converter.updateMapExtractor({ threshold: 100 });
```

### ❌ Missing: Plugin Discovery
**Problem**: No programmatic way to discover available plugins
**Needed**:
```javascript
const availablePlugins = img2css.getAvailablePlugins();
// ['Lighting', 'MapExtractor', 'SoftPosterize']
```

## Headless Operation Status

### ✅ Working Headlessly
- Core gradient generation
- Plugin hook system  
- Basic lighting effects
- Map extraction

### ⚠️ Potential Issues
- UI-specific plugin hooks (beforeMaskLoaded, onMaskLoaded) - these should be optional
- Any remaining DOM dependencies in plugins

### ❌ Not Available Headlessly
- Plugin auto-loading system (requires script tag injection)
- UI-specific features

## Recommendations

1. **Add plugin configuration shorthand** to constructor
2. **Add plugin results to toCSS() return value**
3. **Add plugin state management methods**
4. **Separate headless plugin loading** from UI auto-loading
5. **Add plugin discovery API**
6. **Ensure all UI hooks are optional**