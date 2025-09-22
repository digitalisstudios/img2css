(function (global) {
  function SoftPosterize(options) {
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

    var steps = Math.max(2, options.steps || 16);
    var blurBoost = options.blurBoost || 1.0;

    var qStep = 255 / (steps - 1);
    function quant(v) {
      var snapped = Math.round(v / qStep) * qStep;
      return Math.max(0, Math.min(255, Math.round(snapped)));
    }

    return {
      hooks: {
        beforeRowPass: function (ctx) {
          emit('beforePass', Object.assign({ axis: 'row' }, ctx));
          return { blurRadius: Math.max(1, Math.round((ctx.blurRadius || 1) * blurBoost)) };
        },
        beforeColumnPass: function (ctx) {
          emit('beforePass', Object.assign({ axis: 'column' }, ctx));
          return { blurRadius: Math.max(1, Math.round((ctx.blurRadius || 1) * blurBoost)) };
        },
        transformOptimizedStops: function (ctx) {
          var pre = emit('beforeTransformStops', Object.assign({ phase: 'optimized' }, ctx));
          var baseStops = (pre && pre.stops) ? pre.stops : (ctx.stops || []);
          var stops = baseStops.map(function (s) {
            return {
              r: quant(s.r),
              g: quant(s.g),
              b: quant(s.b),
              a: s.a,
              position: s.position
            };
          });
          var post = emit('afterTransformStops', { phase: 'optimized', steps: steps, stops: stops });
          return (post && post.stops) ? { stops: post.stops } : { stops: stops };
        }
      }
    };
  }

  global.SoftPosterize = SoftPosterize;

  // Standard UI metadata for core UI renderer
  global.SoftPosterize.ui = {
    id: 'softPosterize',
    name: 'Soft Posterize',
    controls: [
      { type: 'switch', key: 'enabled', label: 'Enable', default: false },
      { type: 'slider', key: 'steps', label: 'Steps', min: 2, max: 32, step: 1, default: 16 },
      { type: 'slider', key: 'blurBoost', label: 'Blur Boost', min: 1.0, max: 1.5, step: 0.01, default: 1.05 }
    ],
    build(values, ctx) {
      if (!values.enabled) return null;
      return SoftPosterize({ steps: parseInt(values.steps || 16, 10), blurBoost: parseFloat(values.blurBoost || 1.05), on: (ctx && ctx.hooks) ? ctx.hooks : undefined });
    }
  };
})(typeof window !== 'undefined' ? window : this);
