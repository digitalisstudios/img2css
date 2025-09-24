(function (global) {
  function ColorTemperature(options) {
    options = options || {};
    console.log('ColorTemperature constructor called with options:', options);
    
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

    // Convert Kelvin temperature to RGB multipliers
    function kelvinToRGB(kelvin) {
      // Clamp temperature between 1000K and 40000K
      var temp = Math.max(1000, Math.min(40000, kelvin)) / 100;
      
      var red, green, blue;
      
      // Calculate Red
      if (temp <= 66) {
        red = 255;
      } else {
        red = temp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);
        red = Math.max(0, Math.min(255, red));
      }
      
      // Calculate Green  
      if (temp <= 66) {
        green = temp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;
        green = Math.max(0, Math.min(255, green));
      } else {
        green = temp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492);
        green = Math.max(0, Math.min(255, green));
      }
      
      // Calculate Blue
      if (temp >= 66) {
        blue = 255;
      } else {
        if (temp <= 19) {
          blue = 0;
        } else {
          blue = temp - 10;
          blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
          blue = Math.max(0, Math.min(255, blue));
        }
      }
      
      return {
        r: red / 255,
        g: green / 255,
        b: blue / 255
      };
    }

    // Apply color temperature adjustment to image data
    function applyColorTemperature(imageData, temperature, tint, intensity) {
      var data = imageData.data;
      var tempRGB = kelvinToRGB(temperature);
      
      // Convert tint to RGB adjustment (-100 to +100 becomes magenta to green)
      var tintFactor = tint / 100.0;
      var magentaBoost = Math.max(0, -tintFactor) * 0.2; // Magenta = more red + blue
      var greenBoost = Math.max(0, tintFactor) * 0.2;   // Green = more green
      
      // Intensity factor (0-100% becomes 0.0-1.0)
      var intensityFactor = Math.max(0, Math.min(100, intensity)) / 100.0;
      
      for (var i = 0; i < data.length; i += 4) {
        var originalR = data[i];
        var originalG = data[i + 1];
        var originalB = data[i + 2];
        
        // Apply temperature adjustment
        var tempR = originalR * tempRGB.r;
        var tempG = originalG * tempRGB.g;
        var tempB = originalB * tempRGB.b;
        
        // Apply tint adjustment
        if (tintFactor < 0) { // Magenta tint
          tempR += originalR * magentaBoost;
          tempB += originalB * magentaBoost;
        } else if (tintFactor > 0) { // Green tint
          tempG += originalG * greenBoost;
        }
        
        // Blend with original based on intensity
        var finalR = originalR + (tempR - originalR) * intensityFactor;
        var finalG = originalG + (tempG - originalG) * intensityFactor;
        var finalB = originalB + (tempB - originalB) * intensityFactor;
        
        // Clamp values and apply
        data[i] = Math.max(0, Math.min(255, finalR));
        data[i + 1] = Math.max(0, Math.min(255, finalG));
        data[i + 2] = Math.max(0, Math.min(255, finalB));
        // Alpha channel remains unchanged
      }
      
      return imageData;
    }

    // Auto white balance - finds the brightest neutral area and adjusts temperature
    function autoWhiteBalance(imageData) {
      var data = imageData.data;
      var width = imageData.width;
      var height = imageData.height;
      
      var maxBrightness = 0;
      var whitePointR = 255, whitePointG = 255, whitePointB = 255;
      
      // Sample the center 50% of the image to find the brightest near-neutral area
      var startX = Math.floor(width * 0.25);
      var endX = Math.floor(width * 0.75);
      var startY = Math.floor(height * 0.25);
      var endY = Math.floor(height * 0.75);
      
      for (var y = startY; y < endY; y += 2) { // Sample every other pixel for performance
        for (var x = startX; x < endX; x += 2) {
          var index = (y * width + x) * 4;
          var r = data[index];
          var g = data[index + 1];
          var b = data[index + 2];
          
          // Calculate brightness
          var brightness = (r + g + b) / 3;
          
          // Check if this pixel is relatively neutral (not too colorful)
          var colorDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
          
          // If bright and relatively neutral, consider as potential white point
          if (brightness > maxBrightness && brightness > 128 && colorDiff < 30) {
            maxBrightness = brightness;
            whitePointR = r;
            whitePointG = g;
            whitePointB = b;
          }
        }
      }
      
      // Calculate color temperature from white point
      // This is a simplified estimation
      var ratio = whitePointB / whitePointR;
      var estimatedTemp = 6500; // Default daylight
      
      if (ratio > 1.1) {
        estimatedTemp = Math.min(10000, 6500 + (ratio - 1) * 2000); // Cooler
      } else if (ratio < 0.9) {
        estimatedTemp = Math.max(2000, 6500 - (1 - ratio) * 3000); // Warmer
      }
      
      return estimatedTemp;
    }

    return {
      hooks: {
        // Apply color temperature adjustment before image scaling
        beforeScale: function(ctx) {
          var enabled = options.enabled !== undefined ? options.enabled : false;
          var mode = options.mode || 'manual';
          var temperature = Math.max(2000, Math.min(10000, options.temperature || 6500));
          var tint = Math.max(-100, Math.min(100, options.tint || 0));
          var intensity = Math.max(0, Math.min(100, options.intensity || 100));
          
          console.log('ColorTemperature beforeScale called with enabled:', enabled, 'temp:', temperature, 'tint:', tint);
          
          if (enabled) {
            // Create a copy to avoid modifying the original
            var processedData = new ImageData(
              new Uint8ClampedArray(ctx.imageData.data), 
              ctx.imageData.width, 
              ctx.imageData.height
            );
            
            if (mode === 'auto') {
              // Auto white balance
              var autoTemp = autoWhiteBalance(processedData);
              applyColorTemperature(processedData, autoTemp, tint, intensity);
            } else {
              // Manual temperature adjustment
              applyColorTemperature(processedData, temperature, tint, intensity);
            }
            
            emit('afterColorTemperature', { 
              imageData: processedData, 
              temperature: temperature, 
              tint: tint, 
              intensity: intensity 
            });
            
            return { imageData: processedData };
          }
        }
      }
    };
  }

  // Make globally available
  global.ColorTemperature = ColorTemperature;

  // UI Configuration  
  global.ColorTemperature.ui = {
    id: 'colorTemperature',
    name: 'Color Temperature',
    description: 'Adjusts warmth/coolness and tint of the generated gradients',
    
    controls: [
      { type: 'switch', key: 'enabled', label: 'Enable', default: false },
      { 
        type: 'select', 
        key: 'mode', 
        label: 'Mode', 
        default: 'manual', 
        options: [
          { value: 'manual', label: 'Manual' },
          { value: 'auto', label: 'Auto White Balance' }
        ]
      },
      { type: 'slider', key: 'temperature', label: 'Temperature', min: 2000, max: 10000, step: 100, default: 6500, unit: 'K' },
      { type: 'slider', key: 'tint', label: 'Tint', min: -100, max: 100, step: 5, default: 0, unit: '' },
      { type: 'slider', key: 'intensity', label: 'Intensity', min: 0, max: 100, step: 5, default: 100, unit: '%' }
    ],
    
    presets: [
      { name: 'Daylight', mode: 'manual', temperature: 6500, tint: 0, intensity: 100 },
      { name: 'Warm/Tungsten', mode: 'manual', temperature: 3000, tint: 0, intensity: 100 },
      { name: 'Cool/Shade', mode: 'manual', temperature: 8000, tint: 0, intensity: 100 },
      { name: 'Golden Hour', mode: 'manual', temperature: 2500, tint: -10, intensity: 80 },
      { name: 'Fluorescent', mode: 'manual', temperature: 4000, tint: 15, intensity: 100 },
      { name: 'Auto Balance', mode: 'auto', temperature: 6500, tint: 0, intensity: 100 }
    ],

    build: function(values, ctx) {
      if (!values.enabled) return null;
      
      // Auto-switch to manual mode if user adjusts temperature or tint sliders
      var mode = values.mode || 'manual';
      var temperature = parseInt(values.temperature || 6500, 10);
      var tint = parseInt(values.tint || 0, 10);
      
      // If user changed temperature from default or adjusted tint, switch to manual mode
      if (mode !== 'manual' && (temperature !== 6500 || tint !== 0)) {
        mode = 'manual';
        // Update the UI to reflect the mode change (if updateControlValue is available)
        if (ctx && ctx.updateControlValue) {
          ctx.updateControlValue('colorTemperature', 'mode', 'manual');
        }
      }
      
      return ColorTemperature({
        enabled: values.enabled,
        mode: mode,
        temperature: temperature,
        tint: tint,
        intensity: parseInt(values.intensity || 100, 10),
        on: (ctx && ctx.hooks) ? ctx.hooks : undefined
      });
    }
  };

  console.log('Color Temperature plugin loaded successfully');

})(typeof window !== 'undefined' ? window : global);