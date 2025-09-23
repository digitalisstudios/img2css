// img2css v2 Plugin Configuration Examples
// Demonstrates all ways developers can configure plugins

// Ensure plugins are loaded (script tags, imports, etc.)
// <script src="plugins/lighting.global.js"></script>
// <script src="plugins/map-extractor.global.js"></script>
// <script src="plugins/soft-posterize.global.js"></script>

// ===== APPROACH 1: Plugin Shorthand (New v2 Feature) =====
// Developers can configure plugins directly in constructor
const converter1 = new img2css({
  source: 'image.jpg',
  selector: '.my-gradient',
  
  // Lighting plugin configuration
  lighting: {
    enabled: true,
    lightAngle: 171,
    blendMode: 'screen',
    highlightAlpha: 1.0,
    color: '#ffffff',
    bandGap: 110,
    bandWidth: 50,
    softEdge: 4,
    bandPhase: 2,
    bandGap2: 80,
    bandWidth2: 10,
    bandPhase3: 14,
    bandGap3: 120,
    bandWidth3: 8,
    preview: 'off'
  },
  
  // Map extractor plugin configuration
  mapExtractor: {
    enabled: true,
    types: ['normal', 'roughness', 'subjectnormal'],
    threshold: 127,
    selector: '.map-gradient',
    computeAt: 'scaled'
  },
  
  // Soft posterize plugin configuration
  softPosterize: {
    enabled: true,
    strength: 50,
    preserveOriginalPalette: true
  },
  
  // Processing settings
  processing: {
    details: 80,
    compression: 15,
    mode: 'auto'
  }
});

// ===== APPROACH 2: Legacy Plugin Array (Backward Compatible) =====
// Pre-instantiate plugins manually
const lightingPlugin = Lighting({
  enabled: true,
  lightAngle: 171,
  blendMode: 'screen'
});

const mapExtractorPlugin = MapExtractor({
  enabled: true,
  types: ['normal', 'roughness']
});

const converter2 = new img2css({
  source: 'image.jpg',
  plugins: [lightingPlugin, mapExtractorPlugin]
});

// ===== APPROACH 3: Mixed Configuration =====
// Combine shorthand and manual plugins
const customPlugin = {
  hooks: {
    afterBuildCSS: (ctx) => {
      console.log('Custom processing complete');
      return ctx;
    }
  }
};

const converter3 = new img2css({
  source: 'image.jpg',
  
  // Shorthand plugins
  lighting: { enabled: true, lightAngle: 45 },
  mapExtractor: { enabled: true, types: ['normal'] },
  
  // Manual plugins
  plugins: [customPlugin],
  
  // Direct hooks
  hooks: {
    onError: (ctx) => console.error('Processing error:', ctx.error),
    afterProcess: (ctx) => {
      console.log('Processing completed successfully');
      return ctx;
    }
  }
});

// ===== APPROACH 4: Comprehensive Configuration =====
// Everything a developer could need
const converter4 = new img2css({
  // Source and output
  source: 'complex-image.jpg',
  selector: '.advanced-gradient',
  minified: true,
  
  // Processing configuration
  processing: {
    details: 90,
    compression: 8,
    mode: 'hybrid',
    posterize: 0,
    useOriginalPalette: false
  },
  
  // Performance tuning
  autoOptimize: true,
  maxSize: '1MB',
  
  // Plugin configurations
  lighting: {
    enabled: true,
    preset: 'clearcoat',  // Auto-applies clearcoat defaults
    lightAngle: 171,
    blendMode: 'screen',
    highlightAlpha: 1.0,
    color: '#ffffff',
    // All band settings...
    bandGap: 110,
    bandWidth: 50,
    softEdge: 4,
    bandPhase: 2,
    bandGap2: 80,
    bandWidth2: 10,
    bandPhase3: 14,
    bandGap3: 120,
    bandWidth3: 8,
    preview: 'masked'
  },
  
  mapExtractor: {
    enabled: true,
    types: ['normal', 'roughness', 'subjectnormal', 'albedo', 'depth'],
    threshold: 127,
    selector: '.map-gradient',
    selectors: {
      normal: '.normal-map',
      roughness: '.roughness-map',
      subjectnormal: '.subject-normal-map'
    },
    computeAt: 'scaled',
    maxWidth: 512,
    normalFactor: 1.0,
    roughnessFactor: 1.0
  },
  
  softPosterize: {
    enabled: true,
    strength: 75,
    preserveOriginalPalette: true
  },
  
  // Advanced hooks
  hooks: {
    onInit: (ctx) => console.log('Converter initialized'),
    beforeProcess: (ctx) => {
      console.log('Starting processing...');
      return ctx;
    },
    afterProcess: (ctx) => {
      console.log('Processing complete');
      return ctx;
    },
    onError: (ctx) => {
      console.error('Error during processing:', ctx.error);
      return ctx;
    }
  }
});

// ===== Usage Examples =====

async function demonstrateUsage() {
  try {
    // Generate CSS with shorthand configuration
    const css1 = await converter1.toCSS();
    console.log('Generated CSS:', css1);
    console.log('Processing stats:', converter1.stats);
    
    // Generate with legacy approach
    const css2 = await converter2.toCSS();
    console.log('Legacy approach result:', css2);
    
    // Generate with mixed configuration
    const css3 = await converter3.toCSS();
    console.log('Mixed configuration result:', css3);
    
    // Generate with comprehensive configuration
    const css4 = await converter4.toCSS();
    console.log('Comprehensive result:', css4);
    console.log('Detailed stats:', converter4.stats);
    
  } catch (error) {
    console.error('Processing failed:', error);
  }
}

// ===== Plugin Availability Check =====
function checkPluginAvailability() {
  const available = [];
  const missing = [];
  
  const plugins = ['Lighting', 'MapExtractor', 'SoftPosterize'];
  
  plugins.forEach(pluginName => {
    if (typeof globalThis[pluginName] === 'function') {
      available.push(pluginName);
    } else {
      missing.push(pluginName);
    }
  });
  
  console.log('Available plugins:', available);
  if (missing.length > 0) {
    console.warn('Missing plugins:', missing);
    console.warn('Ensure plugin scripts are loaded before img2css instantiation');
  }
  
  return { available, missing };
}

// Export for testing
export { 
  converter1, 
  converter2, 
  converter3, 
  converter4, 
  demonstrateUsage, 
  checkPluginAvailability 
};