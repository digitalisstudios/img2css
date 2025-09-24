// img2css v2 Enhanced Stats Configuration Examples
// Demonstrates stats collection with memory-safe defaults

// ===== APPROACH 1: Default (Minimal Stats) =====
// Conservative default - minimal memory usage, no plugin results
const converter1 = new img2css({
  source: 'image.jpg',
  lighting: { enabled: true, lightAngle: 45 },
  mapExtractor: { enabled: true, types: ['normal', 'roughness'] }
  // stats: 'minimal' <- default, no need to specify
});

async function demonstrateMinimalStats() {
  const css = await converter1.toCSS();
  console.log('Main CSS:', css);
  console.log('Minimal stats:', converter1.stats);
  
  // Stats will only include:
  // - css: the main gradient CSS string
  // - settings: processing configuration
  // - dimensions: image dimensions
  // NO plugin results to prevent memory bloat
}

// ===== APPROACH 2: Standard Stats =====
// Include plugin results for analysis
const converter2 = new img2css({
  source: 'image.jpg',
  lighting: { enabled: true, lightAngle: 171, blendMode: 'screen' },
  mapExtractor: { enabled: true, types: ['normal', 'roughness', 'subjectnormal'] },
  stats: 'standard'  // Enable plugin result collection
});

async function demonstrateStandardStats() {
  const css = await converter2.toCSS();
  console.log('Main CSS:', css);
  console.log('Standard stats with plugin results:', converter2.stats);
  
  // Stats will include:
  // - All minimal stats PLUS:
  // - stats.plugins.mapExtractor.maps.normal = { css, dimensions, timestamp }
  // - stats.plugins.mapExtractor.maps.roughness = { css, dimensions, timestamp }
  // - stats.plugins.lighting.enhancedCSS = true
  // - stats.plugins.lighting.hasLightingEffects = true
}

// ===== APPROACH 3: Verbose Stats =====
// Full stats including performance data and debug info
const converter3 = new img2css({
  source: 'complex-image.jpg',
  lighting: { enabled: true, preset: 'clearcoat' },
  mapExtractor: { enabled: true, types: ['normal', 'roughness'] },
  stats: 'verbose'  // Maximum stats collection
});

async function demonstrateVerboseStats() {
  const css = await converter3.toCSS();
  console.log('Main CSS:', css);
  console.log('Verbose stats:', converter3.stats);
  
  // Stats will include:
  // - All standard stats PLUS:
  // - stats.performance.timestamp
  // - stats.performance.memoryUsage (if available)
  // - stats.plugins.debug.hookExecutions[] (detailed hook trace)
}

// ===== APPROACH 4: Selective Plugin Collection =====
// Only collect from specific plugins to control memory usage
const converter4 = new img2css({
  source: 'image.jpg',
  lighting: { enabled: true, lightAngle: 90 },
  mapExtractor: { enabled: true, types: ['normal', 'roughness'] },
  softPosterize: { enabled: true, strength: 50 },
  stats: {
    level: 'standard',
    collectPluginResults: true,
    plugins: ['mapExtractor']  // Only collect from map extractor, ignore lighting
  }
});

async function demonstrateSelectiveStats() {
  const css = await converter4.toCSS();
  console.log('Main CSS:', css);
  console.log('Selective plugin stats:', converter4.stats);
  
  // Stats will include:
  // - Base stats
  // - stats.plugins.mapExtractor (only this plugin's results)
  // - NO lighting or softPosterize results despite being enabled
}

// ===== APPROACH 5: Custom Stats Configuration =====
// Advanced configuration for specific use cases
const converter5 = new img2css({
  source: 'image.jpg',
  lighting: { enabled: true, lightAngle: 135 },
  mapExtractor: { enabled: true, types: ['normal'] },
  stats: {
    level: 'standard',
    collectPluginResults: true,
    collectIntermediates: false,  // Skip heavy intermediate data
    plugins: ['lighting', 'mapExtractor']  // Specific plugins only
  }
});

async function demonstrateCustomStats() {
  const css = await converter5.toCSS();
  console.log('Main CSS:', css);
  console.log('Custom stats configuration:', converter5.stats);
  
  // Access specific plugin results:
  if (converter5.stats.plugins) {
    const { mapExtractor, lighting } = converter5.stats.plugins;
    
    if (mapExtractor && mapExtractor.maps) {
      console.log('Normal map CSS:', mapExtractor.maps.normal?.css);
      console.log('Roughness map CSS:', mapExtractor.maps.roughness?.css);
    }
    
    if (lighting) {
      console.log('Lighting effects applied:', lighting.hasLightingEffects);
      console.log('CSS enhanced with lighting:', lighting.enhancedCSS);
    }
  }
}

// ===== APPROACH 6: Memory-Safe Batch Processing =====
// Processing multiple images with controlled memory usage
async function demonstrateBatchProcessing() {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  const results = [];
  
  for (const imageSrc of images) {
    const converter = new img2css({
      source: imageSrc,
      lighting: { enabled: true, lightAngle: 45 },
      mapExtractor: { enabled: true, types: ['normal'] },
      stats: {
        level: 'standard',
        collectPluginResults: true,
        plugins: ['mapExtractor']  // Only collect essential results
      }
    });
    
    const css = await converter.toCSS();
    
    // Extract only essential data to prevent memory accumulation
    results.push({
      source: imageSrc,
      mainCSS: css,
      normalMapCSS: converter.stats.plugins?.mapExtractor?.maps?.normal?.css,
      dimensions: converter.stats.settings.dimensions
    });
    
    // Clear reference to prevent memory leak
    converter.stats = null;
  }
  
  console.log('Batch processing results:', results);
}

// ===== STATS INSPECTION UTILITIES =====
function inspectStatsSize(converter) {
  const statsSize = JSON.stringify(converter.stats).length;
  const hasPluginResults = !!(converter.stats.plugins);
  const pluginCount = hasPluginResults ? Object.keys(converter.stats.plugins).length : 0;
  
  console.log(`Stats size: ${statsSize} characters`);
  console.log(`Plugin results included: ${hasPluginResults}`);
  console.log(`Number of plugin results: ${pluginCount}`);
  
  if (hasPluginResults) {
    Object.keys(converter.stats.plugins).forEach(pluginName => {
      const pluginData = converter.stats.plugins[pluginName];
      const pluginSize = JSON.stringify(pluginData).length;
      console.log(`  ${pluginName}: ${pluginSize} characters`);
    });
  }
}

// ===== COMPARISON: Memory Usage =====
async function compareMemoryUsage() {
  console.log('=== Memory Usage Comparison ===');
  
  // Test with minimal stats
  const minimal = new img2css({
    source: 'test-image.jpg',
    lighting: { enabled: true },
    mapExtractor: { enabled: true, types: ['normal', 'roughness'] }
    // Default minimal stats
  });
  
  await minimal.toCSS();
  console.log('\nMinimal stats:');
  inspectStatsSize(minimal);
  
  // Test with standard stats
  const standard = new img2css({
    source: 'test-image.jpg',
    lighting: { enabled: true },
    mapExtractor: { enabled: true, types: ['normal', 'roughness'] },
    stats: 'standard'
  });
  
  await standard.toCSS();
  console.log('\nStandard stats:');
  inspectStatsSize(standard);
  
  // Test with verbose stats
  const verbose = new img2css({
    source: 'test-image.jpg',
    lighting: { enabled: true },
    mapExtractor: { enabled: true, types: ['normal', 'roughness'] },
    stats: 'verbose'
  });
  
  await verbose.toCSS();
  console.log('\nVerbose stats:');
  inspectStatsSize(verbose);
}

// Export for testing
export { 
  demonstrateMinimalStats,
  demonstrateStandardStats, 
  demonstrateVerboseStats,
  demonstrateSelectiveStats,
  demonstrateCustomStats,
  demonstrateBatchProcessing,
  compareMemoryUsage,
  inspectStatsSize
};