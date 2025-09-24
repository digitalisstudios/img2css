(function (global) {
  function ContrastBoost(options) {
    options = options || {};
    console.log('ContrastBoost constructor called with options:', options);
    
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

    // Plugin configuration - will be updated dynamically

    // Auto-contrast enhancement
    function applyAutoContrast(imageData) {
      var data = imageData.data;
      var width = imageData.width;
      var height = imageData.height;
      
      // Find min and max values for each channel
      var minR = 255, maxR = 0;
      var minG = 255, maxG = 0;
      var minB = 255, maxB = 0;
      
      for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (g < minG) minG = g;
        if (g > maxG) maxG = g;
        if (b < minB) minB = b;
        if (b > maxB) maxB = b;
      }
      
      // Calculate stretch factors for each channel
      var rangeR = maxR - minR;
      var rangeG = maxG - minG;
      var rangeB = maxB - minB;
      
      // Apply auto-contrast stretch
      for (var i = 0; i < data.length; i += 4) {
        if (rangeR > 0) {
          var newR = ((data[i] - minR) * 255) / rangeR;
          data[i] = Math.max(0, Math.min(255, newR));
        }
        if (rangeG > 0) {
          var newG = ((data[i + 1] - minG) * 255) / rangeG;
          data[i + 1] = Math.max(0, Math.min(255, newG));
        }
        if (rangeB > 0) {
          var newB = ((data[i + 2] - minB) * 255) / rangeB;
          data[i + 2] = Math.max(0, Math.min(255, newB));
        }
      }
      
      return imageData;
    }

    // Manual contrast adjustment
    function applyManualContrast(imageData, contrastAmount, brightnessAmount, preserveHighlights, preserveShadows) {
      var data = imageData.data;
      
      // Convert contrast and brightness from -100/+100 to usable factors
      var contrastFactor = (259 * (contrastAmount + 255)) / (255 * (259 - contrastAmount));
      var brightnessFactor = brightnessAmount * 2.55; // Convert to 0-255 range
      
      for (var i = 0; i < data.length; i += 4) {
        // Apply contrast
        var r = contrastFactor * (data[i] - 128) + 128;
        var g = contrastFactor * (data[i + 1] - 128) + 128;
        var b = contrastFactor * (data[i + 2] - 128) + 128;
        
        // Apply brightness
        r += brightnessFactor;
        g += brightnessFactor;
        b += brightnessFactor;
        
        // Preserve highlights and shadows if enabled
        if (preserveHighlights) {
          r = Math.min(r, data[i] > 200 ? data[i] : r);
          g = Math.min(g, data[i + 1] > 200 ? data[i + 1] : g);
          b = Math.min(b, data[i + 2] > 200 ? data[i + 2] : b);
        }
        
        if (preserveShadows) {
          r = Math.max(r, data[i] < 50 ? data[i] : r);
          g = Math.max(g, data[i + 1] < 50 ? data[i + 1] : g);
          b = Math.max(b, data[i + 2] < 50 ? data[i + 2] : b);
        }
        
        // Clamp values
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }
      
      return imageData;
    }

    // Histogram equalization
    function applyHistogramEqualization(imageData) {
      var data = imageData.data;
      var width = imageData.width;
      var height = imageData.height;
      var totalPixels = width * height;
      
      // Calculate histogram for each channel
      var histR = new Array(256).fill(0);
      var histG = new Array(256).fill(0);
      var histB = new Array(256).fill(0);
      
      for (var i = 0; i < data.length; i += 4) {
        histR[data[i]]++;
        histG[data[i + 1]]++;
        histB[data[i + 2]]++;
      }
      
      // Calculate cumulative distribution function (CDF)
      var cdfR = new Array(256);
      var cdfG = new Array(256);
      var cdfB = new Array(256);
      
      cdfR[0] = histR[0];
      cdfG[0] = histG[0];
      cdfB[0] = histB[0];
      
      for (var i = 1; i < 256; i++) {
        cdfR[i] = cdfR[i - 1] + histR[i];
        cdfG[i] = cdfG[i - 1] + histG[i];
        cdfB[i] = cdfB[i - 1] + histB[i];
      }
      
      // Apply equalization
      for (var i = 0; i < data.length; i += 4) {
        data[i] = Math.round((cdfR[data[i]] * 255) / totalPixels);
        data[i + 1] = Math.round((cdfG[data[i + 1]] * 255) / totalPixels);
        data[i + 2] = Math.round((cdfB[data[i + 2]] * 255) / totalPixels);
      }
      
      return imageData;
    }

    // Apply contrast enhancement to image data if enabled
    function processImageData(imageData) {
      if (!options.enabled) return imageData;
      
      var mode = options.mode || 'auto';
      var contrast = Math.max(-100, Math.min(100, options.contrast || 0));
      var brightness = Math.max(-100, Math.min(100, options.brightness || 0));
      var preserveHighlights = options.preserveHighlights !== undefined ? options.preserveHighlights : true;
      var preserveShadows = options.preserveShadows !== undefined ? options.preserveShadows : true;
      
      console.log('Contrast Boost applying:', mode, 'contrast:', contrast, 'brightness:', brightness);
      
      // Create a copy to avoid modifying the original
      var processedData = new ImageData(
        new Uint8ClampedArray(imageData.data), 
        imageData.width, 
        imageData.height
      );
      
      if (mode === 'auto') {
        applyAutoContrast(processedData);
      } else if (mode === 'manual') {
        applyManualContrast(processedData, contrast, brightness, preserveHighlights, preserveShadows);
      } else if (mode === 'histogram') {
        applyHistogramEqualization(processedData);
      }
      
      return processedData;
    }

    return {
      hooks: {
        // Apply contrast enhancement before image scaling
        beforeScale: function(ctx) {
          console.log('ContrastBoost beforeScale called with enabled:', options.enabled);
          if (options.enabled) {
            var processedImageData = processImageData(ctx.imageData);
            return { imageData: processedImageData };
          }
        }
      }
    };
  }

  // Make globally available
  global.ContrastBoost = ContrastBoost;

  // UI Configuration  
  global.ContrastBoost.ui = {
    id: 'contrastBoost',
    name: 'Contrast Boost',
    description: 'Automatically adjusts contrast to improve gradient visibility with manual controls',
    
    controls: [
      { type: 'switch', key: 'enabled', label: 'Enable', default: false },
      { 
        type: 'select', 
        key: 'mode', 
        label: 'Mode', 
        default: 'auto', 
        options: [
          { value: 'auto', label: 'Auto Contrast' },
          { value: 'manual', label: 'Manual' },
          { value: 'histogram', label: 'Histogram Equalization' }
        ]
      },
      { type: 'slider', key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 5, default: 0 },
      { type: 'slider', key: 'brightness', label: 'Brightness', min: -100, max: 100, step: 5, default: 0 },
      { type: 'switch', key: 'preserveHighlights', label: 'Preserve Highlights', default: true },
      { type: 'switch', key: 'preserveShadows', label: 'Preserve Shadows', default: true }
    ],
    
    presets: [
      { name: 'Auto Enhance', mode: 'auto', contrast: 0, brightness: 0, preserveHighlights: true, preserveShadows: true },
      { name: 'Subtle Boost', mode: 'manual', contrast: 15, brightness: 5, preserveHighlights: true, preserveShadows: true },
      { name: 'Strong Contrast', mode: 'manual', contrast: 35, brightness: 0, preserveHighlights: false, preserveShadows: false },
      { name: 'Histogram EQ', mode: 'histogram', contrast: 0, brightness: 0, preserveHighlights: true, preserveShadows: true }
    ],

    build: function(values, ctx) {
      if (!values.enabled) return null;
      
      // Auto-switch to manual mode if user adjusts contrast or brightness sliders
      var mode = values.mode || 'auto';
      var contrast = parseInt(values.contrast || 0, 10);
      var brightness = parseInt(values.brightness || 0, 10);
      
      // If user changed contrast or brightness from defaults, switch to manual mode
      if (mode !== 'manual' && (contrast !== 0 || brightness !== 0)) {
        mode = 'manual';
        // Update the UI to reflect the mode change (if updateControlValue is available)
        if (ctx && ctx.updateControlValue) {
          ctx.updateControlValue('contrastBoost', 'mode', 'manual');
        }
      }
      
      return ContrastBoost({
        enabled: values.enabled,
        mode: mode,
        contrast: contrast,
        brightness: brightness,
        preserveHighlights: values.preserveHighlights !== undefined ? values.preserveHighlights : true,
        preserveShadows: values.preserveShadows !== undefined ? values.preserveShadows : true,
        on: (ctx && ctx.hooks) ? ctx.hooks : undefined
      });
    }
  };

  console.log('Contrast Boost plugin loaded successfully');
  console.log('ContrastBoost function available:', typeof ContrastBoost);

})(typeof window !== 'undefined' ? window : global);