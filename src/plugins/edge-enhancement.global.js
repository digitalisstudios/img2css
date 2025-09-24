(function (global) {
  function EdgeEnhancement(options) {
    options = options || {};
    
    // Local plugin hooks via options.on or options.pluginHooks
    var localHooks = (options && (options.on || options.pluginHooks)) || {};
    function emit(event, payload) {
      try {
        var fn = localHooks && localHooks[event];
        if (typeof fn === 'function') {
          var res = fn(payload || {});
          return (res === undefined) ? payload : res;
        }
      } catch (e) {}
      return payload;
    }

    // Resolve options via local hook
    var resolved = emit('resolveOptions', { options: Object.assign({}, options) });
    if (resolved && resolved.options) options = resolved.options;

    // Plugin configuration
    var intensity = Math.max(0, Math.min(100, options.intensity || 50));
    var threshold = Math.max(0, Math.min(100, options.threshold || 10));
    var radius = Math.max(0.5, Math.min(5.0, options.radius || 1.0));

    // Unsharp mask implementation
    function applyUnsharpMask(imageData, intensity, threshold, radius) {
      var width = imageData.width;
      var height = imageData.height;
      var data = imageData.data;
      var originalData = new Uint8ClampedArray(data);
      
      // Create Gaussian blur kernel
      var kernelSize = Math.ceil(radius * 2) * 2 + 1;
      var kernel = createGaussianKernel(kernelSize, radius);
      
      // Apply Gaussian blur
      var blurredData = applyConvolution(originalData, width, height, kernel, kernelSize);
      
      // Apply unsharp mask
      var normalizedIntensity = intensity / 100.0;
      var normalizedThreshold = threshold / 100.0 * 255;
      
      for (var i = 0; i < data.length; i += 4) {
        for (var channel = 0; channel < 3; channel++) { // RGB channels only
          var original = originalData[i + channel];
          var blurred = blurredData[i + channel];
          var difference = original - blurred;
          
          // Apply threshold
          if (Math.abs(difference) >= normalizedThreshold) {
            var enhanced = original + (difference * normalizedIntensity);
            data[i + channel] = Math.max(0, Math.min(255, enhanced));
          }
        }
        // Keep alpha channel unchanged
      }
      
      return imageData;
    }

    // Create Gaussian kernel for blur
    function createGaussianKernel(size, sigma) {
      var kernel = new Array(size * size);
      var center = Math.floor(size / 2);
      var sum = 0;
      
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var dx = x - center;
          var dy = y - center;
          var value = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
          kernel[y * size + x] = value;
          sum += value;
        }
      }
      
      // Normalize kernel
      for (var i = 0; i < kernel.length; i++) {
        kernel[i] /= sum;
      }
      
      return kernel;
    }

    // Apply convolution with kernel
    function applyConvolution(data, width, height, kernel, kernelSize) {
      var result = new Uint8ClampedArray(data.length);
      var center = Math.floor(kernelSize / 2);
      
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var pixelIndex = (y * width + x) * 4;
          
          for (var channel = 0; channel < 3; channel++) { // RGB only
            var sum = 0;
            
            for (var ky = 0; ky < kernelSize; ky++) {
              for (var kx = 0; kx < kernelSize; kx++) {
                var sampleY = Math.min(height - 1, Math.max(0, y + ky - center));
                var sampleX = Math.min(width - 1, Math.max(0, x + kx - center));
                var sampleIndex = (sampleY * width + sampleX) * 4 + channel;
                
                sum += data[sampleIndex] * kernel[ky * kernelSize + kx];
              }
            }
            
            result[pixelIndex + channel] = Math.max(0, Math.min(255, sum));
          }
          
          // Copy alpha channel unchanged
          result[pixelIndex + 3] = data[pixelIndex + 3];
        }
      }
      
      return result;
    }

    return {
      hooks: {
        onInit: function(ctx) {
          emit('onInit', ctx);
        },

        // Apply edge enhancement before image scaling
        beforeScale: function(ctx) {
          var enabled = options.enabled !== undefined ? options.enabled : false;
          var currentIntensity = Math.max(0, Math.min(100, options.intensity || 50));
          var currentThreshold = Math.max(0, Math.min(100, options.threshold || 10));
          var currentRadius = Math.max(0.5, Math.min(5.0, options.radius || 1.0));
          
          console.log('EdgeEnhancement beforeScale called with enabled:', enabled, 'intensity:', currentIntensity);
          
          if (enabled && currentIntensity > 0) {
            // Create a copy to avoid modifying the original
            var processedData = new ImageData(
              new Uint8ClampedArray(ctx.imageData.data), 
              ctx.imageData.width, 
              ctx.imageData.height
            );
            
            // Apply edge enhancement
            applyUnsharpMask(processedData, currentIntensity, currentThreshold, currentRadius);
            emit('afterEdgeEnhancement', { 
              imageData: processedData, 
              intensity: currentIntensity, 
              threshold: currentThreshold, 
              radius: currentRadius 
            });
            
            return { imageData: processedData };
          }
        }
      }
    };
  }

  // Make globally available
  global.EdgeEnhancement = EdgeEnhancement;

  // UI Configuration  
  global.EdgeEnhancement.ui = {
    id: 'edgeEnhancement',
    name: 'Edge Enhancement',
    description: 'Sharpens gradient transitions and enhances detail definition using unsharp mask algorithm',
    
    controls: [
      { type: 'switch', key: 'enabled', label: 'Enable', default: false },
      { type: 'slider', key: 'intensity', label: 'Intensity', min: 0, max: 100, step: 5, default: 50 },
      { type: 'slider', key: 'threshold', label: 'Threshold', min: 0, max: 100, step: 5, default: 10 },
      { type: 'slider', key: 'radius', label: 'Radius', min: 0.5, max: 5.0, step: 0.1, default: 1.0 }
    ],
    
    presets: [
      { name: 'Subtle', intensity: 25, threshold: 15, radius: 0.8 },
      { name: 'Moderate', intensity: 50, threshold: 10, radius: 1.0 },
      { name: 'Strong', intensity: 75, threshold: 5, radius: 1.5 },
      { name: 'Maximum', intensity: 100, threshold: 0, radius: 2.0 }
    ],

    build: function(values, ctx) {
      if (!values.enabled) return null;
      return EdgeEnhancement({
        enabled: values.enabled,
        intensity: parseInt(values.intensity || 50, 10),
        threshold: parseInt(values.threshold || 10, 10),
        radius: parseFloat(values.radius || 1.0),
        on: (ctx && ctx.hooks) ? ctx.hooks : undefined
      });
    }
  };

  console.log('Edge Enhancement plugin loaded successfully');

})(typeof window !== 'undefined' ? window : global);