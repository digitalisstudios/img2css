// Plugin Template
// Usage: plugins: [PluginTemplate({ /* options */ })]

export default function PluginTemplate(options = {}) {
  // Access user options here
  const name = options.name || 'plugin-template';

  // Plugin-local hooks: accept as options.on or options.pluginHooks
  const localHooks = (options && (options.on || options.pluginHooks)) || {};
  const emit = (event, payload) => {
    try {
      const fn = localHooks && localHooks[event];
      if (typeof fn === 'function') {
        const res = fn(payload || {});
        return res === undefined ? payload : res;
      }
    } catch (_) {}
    return payload;
  };

  // Allow external override/validation of options
  const resolved = emit('resolveOptions', { options: { ...options } });
  if (resolved && resolved.options) options = resolved.options;

  return {
    // Either return hooks directly or { hooks: {...} }
    hooks: {
      // Lifecycle (async ok)
      onInit(ctx) {
        // ctx: { config, instance }
        // console.log(`[${name}] init`, ctx.config);
      },
      beforeLoad({ source }) {
        // Optionally replace/normalize the source
        return { source };
      },
      afterLoad({ imageData, source }) {
        // Optionally transform ImageData
        return { imageData };
      },
      beforeProcess({ config, imageData }) {},
      afterProcess({ css, stats }) {},
      onError({ stage, error }) {
        // Swallow/forward as needed (do not throw)
      },

      // Orchestration
      supplyPalette({ imageData, config }) {
        // Return { palette } to override palette extraction
      },
      beforeScale({ imageData, details }) {
        // Return { imageData } to pre-process scaling input
      },
      afterScale({ imageData, details }) {
        // Return { imageData } to post-process scaled data
      },
      decideProcessingMode({ imageData, config, defaultMode }) {
        // Return { mode: 'rows'|'columns'|'hybrid'|'auto' }
      },

      // Pass-level (sync for perf)
      beforeRowPass({ width, height, samplingRate, adjustedSamplingRate, compression, blurRadius }) {
        // Return overrides: { samplingRate, adjustedSamplingRate, blurRadius }
        emit('beforePass', { axis: 'row', width, height, samplingRate, adjustedSamplingRate, compression, blurRadius });
      },
      beforeColumnPass({ width, height, samplingRate, adjustedSamplingRate, compression, blurRadius }) {
        // Return overrides
        emit('beforePass', { axis: 'column', width, height, samplingRate, adjustedSamplingRate, compression, blurRadius });
      },
      shouldProcessLine({ axis, index, stride, width, height }) {
        // Return { skip: true } to skip a row/column
      },

      // Color-stop pipeline (sync)
      transformRawStops({ stops, axis, index, imageData, config }) {
        // Return { stops }
        const r = emit('beforeTransformStops', { phase: 'raw', axis, index, stops });
        return r && r.stops ? { stops: r.stops } : undefined;
      },
      transformDedupedStops({ stops, axis, index }) {
        // Return { stops }
        const r = emit('beforeTransformStops', { phase: 'deduped', axis, index, stops });
        return r && r.stops ? { stops: r.stops } : undefined;
      },
      transformOptimizedStops({ stops, axis, index }) {
        // Return { stops }
        const r = emit('beforeTransformStops', { phase: 'optimized', axis, index, stops });
        return r && r.stops ? { stops: r.stops } : undefined;
      },
      addIntermediateStops({ stops, axis, index }) {
        // Return { stops } to replace the default intermediate-stop logic
        const r = emit('beforeTransformStops', { phase: 'intermediate', axis, index, stops });
        return r && r.stops ? { stops: r.stops } : undefined;
      },
      nearestPaletteColor({ color, palette }) {
        // Return { color } to override palette snapping
      },

      // Composition (sync)
      buildLayer({ gradient, positionPercent, sizePercent, axis }) {
        // Return { gradient, positionPercent, sizePercent }
      },
      beforeBuildCSS({ layers, selector, dimensions, minified }) {
        // Return { selector?, layers? }
      },
      afterBuildCSS({ css, layers, selector, dimensions, minified }) {
        // Return { css }
      },

      // Hybrid (async ok)
      beforeHybridSecondary({ primaryMode, secondaryMode, imageData, config }) {
        // Return { primaryMode?, secondaryMode? }
      },
      combineHybrid({ primaryCSS, secondaryData, primaryMode, imageData, config, correctedCSS }) {
        // Return { css }
      }
    }
  };
}
