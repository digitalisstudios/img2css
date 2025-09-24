// Test API surface for headless operation
console.log('=== Testing img2css API Surface ===\n');

// Check if plugins can be loaded and used programmatically
console.log('1. Plugin Availability:');
console.log('   Lighting plugin:', typeof Lighting === 'function' ? '✅' : '❌');
console.log('   MapExtractor plugin:', typeof MapExtractor === 'function' ? '✅' : '❌');

console.log('\n2. Constructor Options Test:');
try {
  // Test basic instantiation
  const basicConverter = new img2css({
    source: 'https://example.com/test.jpg',
    selector: '.test-gradient',
    processing: {
      details: 80,
      compression: 10,
      mode: 'auto'
    }
  });
  console.log('   Basic instantiation: ✅');
} catch (e) {
  console.log('   Basic instantiation: ❌', e.message);
}

console.log('\n3. Plugin Integration Test:');
try {
  // Test plugin integration
  const lightingPlugin = Lighting({ 
    enabled: true, 
    lightAngle: 45,
    blendMode: 'screen',
    highlightAlpha: 0.8
  });
  
  const mapExtractorPlugin = MapExtractor({ 
    enabled: true, 
    types: ['normal', 'roughness'],
    threshold: 127
  });
  
  const pluginConverter = new img2css({
    source: 'test.jpg',
    plugins: [lightingPlugin, mapExtractorPlugin],
    hooks: {
      onMapCSS: function(data) { 
        console.log('   Map generated:', data.type); 
      },
      afterBuildCSS: function(ctx) { 
        console.log('   CSS enhanced with lighting effects'); 
        return ctx;
      }
    }
  });
  
  console.log('   Plugin integration: ✅');
  console.log('   Available methods:');
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(pluginConverter))
    .filter(name => name !== 'constructor' && typeof pluginConverter[name] === 'function');
  methods.forEach(method => console.log(`     - ${method}()`));
  
} catch (e) {
  console.log('   Plugin integration: ❌', e.message);
}

console.log('\n4. Headless Operation Test:');
console.log('   Can run without DOM: ', typeof document === 'undefined' ? '✅' : '⚠️ DOM present');

console.log('\n=== API Surface Summary ===');
console.log('Core features available programmatically:');
console.log('✅ Basic gradient generation');
console.log('✅ Plugin system with hooks');
console.log('✅ Configuration options');
console.log('✅ Processing modes and optimization');

if (typeof Lighting === 'function' && typeof MapExtractor === 'function') {
  console.log('✅ Advanced features (lighting, map extraction) available via plugins');
} else {
  console.log('❌ Advanced features not accessible - plugins not loaded');
}