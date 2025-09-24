(function (global) {
  function Lighting(options) {
    options = options || {};

    // Local plugin hooks (not used here but supported for symmetry)
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

    // Cache for generated CSS to prevent re-calculation - clears when image changes
    var cssCache = {};
    var lastConfigKey = null;
    var lastImageSignature = null;

    function generateConfigKey(config) {
      // Generate key from all lighting parameters that affect CSS output
      return [
        config.lightAngle, config.blendMode, config.highlightAlpha, config.color,
        config.bandGap, config.bandWidth, config.bandSpace, config.softEdge,
        config.bandPhase, config.bandGap2, config.bandWidth2, config.bandSpace2,
        config.bandPhase3, config.bandGap3, config.bandWidth3, config.bandSpace3,
        config.reflection, config.preview
      ].join('_');
    }

    function generateColorVariations(hexColor) {
      // Parse hex color to RGB
      var hex = hexColor.replace('#', '');
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);
      
      return {
        base: hexColor,
        soft: 'rgba(' + r + ',' + g + ',' + b + ',0.15)',
        weak: 'rgba(' + r + ',' + g + ',' + b + ',0.35)',
        weak2: 'rgba(' + r + ',' + g + ',' + b + ',0.2)',
        transparent: 'rgba(' + r + ',' + g + ',' + b + ',0)'
      };
    }

    // Apply Clearcoat preset as defaults if no specific values provided
    var clearcoatDefaults = {
      lightAngle: 171,
      highlightAlpha: 1.0,
      blendMode: 'screen',
      bandGap: 110,
      bandWidth: 50,
      softEdge: 4,
      bandPhase: 2,
      bandGap2: 80,
      bandWidth2: 10,
      bandSpace2: 90,
      bandPhase3: 14,
      bandGap3: 120,
      bandWidth3: 8,
      bandSpace: 120,
      bandSpace3: 140
    };

    var cfg = {
      enabled: options.enabled !== false,
      // Visuals - use Clearcoat preset values as defaults
      lightAngle: (options.lightAngle == null ? clearcoatDefaults.lightAngle : options.lightAngle),
      blendMode: options.blendMode || clearcoatDefaults.blendMode,
      highlightAlpha: (options.highlightAlpha == null ? clearcoatDefaults.highlightAlpha : options.highlightAlpha),
      color: options.color || '#ffffff',
      // Banding (primary) - use Clearcoat preset values
      bandGap: (options.bandGap == null ? clearcoatDefaults.bandGap : options.bandGap),
      bandWidth: (options.bandWidth == null ? clearcoatDefaults.bandWidth : options.bandWidth),
      bandSpace: (options.bandSpace == null ? clearcoatDefaults.bandSpace : options.bandSpace),
      softEdge: (options.softEdge == null ? clearcoatDefaults.softEdge : options.softEdge),
      // Secondary - use Clearcoat preset values
      bandPhase: (options.bandPhase == null ? clearcoatDefaults.bandPhase : options.bandPhase),
      bandGap2: (options.bandGap2 == null ? clearcoatDefaults.bandGap2 : options.bandGap2),
      bandWidth2: (options.bandWidth2 == null ? clearcoatDefaults.bandWidth2 : options.bandWidth2),
      bandSpace2: (options.bandSpace2 == null ? clearcoatDefaults.bandSpace2 : options.bandSpace2),
      // Tertiary - use Clearcoat preset values
      bandPhase3: (options.bandPhase3 == null ? clearcoatDefaults.bandPhase3 : options.bandPhase3),
      bandGap3: (options.bandGap3 == null ? clearcoatDefaults.bandGap3 : options.bandGap3),
      bandWidth3: (options.bandWidth3 == null ? clearcoatDefaults.bandWidth3 : options.bandWidth3),
      bandSpace3: (options.bandSpace3 == null ? clearcoatDefaults.bandSpace3 : options.bandSpace3),
      // Masks
      maskVar: options.maskVar || 'var(--lighting-mask, var(--spec-mask))',
      // Reflection mode - uses subject normal map instead of roughness
      reflection: options.reflection || false,
      // Preview: 'off'|'masked'|'unmasked'
      preview: options.preview || 'off'
    };

    function appendOverlayCSS(inputCSS, selector, minified, imageData) {
      if (!cfg.enabled) return inputCSS;
      
      // Clear cache if image has changed
      if (imageData) {
        var currentImageSignature = imageData.width + 'x' + imageData.height + '_' + imageData.data.length;
        if (lastImageSignature && lastImageSignature !== currentImageSignature) {
          cssCache = {};
          lastConfigKey = null;
          emit('onImageChange', { previousSignature: lastImageSignature, newSignature: currentImageSignature });
        }
        lastImageSignature = currentImageSignature;
      }
      
      // Check cache first
      var configKey = generateConfigKey(cfg);
      var cacheKey = configKey + '_' + selector + '_' + (minified ? 'min' : 'full');
      
      if (lastConfigKey === configKey && cssCache[cacheKey]) {
        return inputCSS + cssCache[cacheKey];
      }
      
      var nl = minified ? '' : '\n';
      var ind = minified ? '' : '  ';
      var sel = selector + '.css-lighting';
      var beforeRule = sel + '::before';
      var afterRule = sel + '::after';
      var baseRule = sel;
      var css = inputCSS + (minified ? '' : nl + nl);

      // Generate color variations from the configured color
      var baseColor = cfg.color || '#ffffff';
      var colorVariations = generateColorVariations(baseColor);
      
      // Add CSS variable definitions for portability
      var rootVars = ':root {' + nl +
        ind + '--light-angle: ' + cfg.lightAngle + 'deg;' + nl +
        ind + '--highlight-alpha: ' + cfg.highlightAlpha + ';' + nl +
        ind + '--blend-mode: ' + cfg.blendMode + ';' + nl +
        ind + '--band-gap: ' + cfg.bandGap + 'px;' + nl +
        ind + '--band-width: ' + cfg.bandWidth + 'px;' + nl +
        ind + '--band-space: ' + cfg.bandSpace + 'px;' + nl +
        ind + '--soft-edge: ' + cfg.softEdge + 'px;' + nl +
        ind + '--band-phase: ' + cfg.bandPhase + 'deg;' + nl +
        ind + '--band-gap2: ' + cfg.bandGap2 + 'px;' + nl +
        ind + '--band-width2: ' + cfg.bandWidth2 + 'px;' + nl +
        ind + '--band-space2: ' + cfg.bandSpace2 + 'px;' + nl +
        ind + '--band-phase3: ' + cfg.bandPhase3 + 'deg;' + nl +
        ind + '--band-gap3: ' + cfg.bandGap3 + 'px;' + nl +
        ind + '--band-width3: ' + cfg.bandWidth3 + 'px;' + nl +
        ind + '--band-space3: ' + cfg.bandSpace3 + 'px;' + nl +
        ind + '--highlight-color: ' + colorVariations.base + ';' + nl +
        ind + '--highlight-color-soft: ' + colorVariations.soft + ';' + nl +
        ind + '--highlight-color-weak: ' + colorVariations.weak + ';' + nl +
        ind + '--highlight-color-weak2: ' + colorVariations.weak2 + ';' + nl +
        ind + '--highlight-color-0: ' + colorVariations.transparent + ';' + nl +
        '}' + nl + nl;
      css += rootVars;

      // Ensure relative positioning for overlay
      css += baseRule + (minified ? '{position:relative;}' : ' {' + nl + ind + 'position: relative;' + nl + '}') + nl;

      // Build banded backgrounds with CSS variables (definitions included above)
      var bg1 = 'repeating-linear-gradient(' +
        'var(--light-angle),' +
        'transparent 0,' +
        'transparent var(--band-gap),' +
        'var(--highlight-color-soft) var(--band-gap),' +
        'var(--highlight-color) calc(var(--band-gap) + var(--soft-edge)),' +
        'var(--highlight-color-0) calc(var(--band-gap) + var(--soft-edge) + var(--band-width)),' +
        'transparent calc(var(--band-gap) + var(--soft-edge) + var(--band-width) + var(--band-space))' +
      ')';
      var bg2 = 'repeating-linear-gradient(' +
        'calc(var(--light-angle) + var(--band-phase)),' +
        'transparent 0,' +
        'transparent var(--band-gap2),' +
        'var(--highlight-color-soft) var(--band-gap2),' +
        'var(--highlight-color-weak) calc(var(--band-gap2) + var(--soft-edge)),' +
        'var(--highlight-color-0) calc(var(--band-gap2) + var(--soft-edge) + var(--band-width2)),' +
        'transparent calc(var(--band-gap2) + var(--soft-edge) + var(--band-width2) + var(--band-space2))' +
      ')';
      var bg3 = 'repeating-linear-gradient(' +
        'calc(var(--light-angle) + var(--band-phase3)),' +
        'transparent 0,' +
        'transparent var(--band-gap3),' +
        'var(--highlight-color-soft) var(--band-gap3),' +
        'var(--highlight-color-weak2) calc(var(--band-gap3) + var(--soft-edge)),' +
        'var(--highlight-color-0) calc(var(--band-gap3) + var(--soft-edge) + var(--band-width3)),' +
        'transparent calc(var(--band-gap3) + var(--soft-edge) + var(--band-width3) + var(--band-space3))' +
      ')';

      var masked = (cfg.preview !== 'unmasked');
      var maskVarToUse = cfg.reflection ? 'var(--lighting-mask, var(--refl-mask))' : cfg.maskVar;
      var beforeDecl = (minified
        ? 'content:\"\";position:absolute;inset:0;pointer-events:none;background:' + bg1 + ',' + bg2 + ',' + bg3 + ';background-attachment:fixed;mix-blend-mode:var(--blend-mode);opacity:var(--highlight-alpha)' + (masked ? ';-webkit-mask:' + maskVarToUse + ';mask:' + maskVarToUse + ';mask-mode:luminance' : '') + ';'
        : '{' + nl +
            ind + 'content: "";' + nl +
            ind + 'position: absolute; inset: 0; pointer-events: none;' + nl +
            ind + 'background: ' + nl + ind + ind + bg1 + ',' + nl + ind + ind + bg2 + ',' + nl + ind + ind + bg3 + ';' + nl +
            ind + 'background-attachment: fixed;' + nl +
            ind + 'mix-blend-mode: var(--blend-mode);' + nl +
            ind + 'opacity: var(--highlight-alpha);' + nl +
            (masked ? (ind + '-webkit-mask: ' + maskVarToUse + ';' + nl + ind + 'mask: ' + maskVarToUse + ';' + nl + ind + 'mask-mode: luminance;' + nl) : '') +
          '}');

      css += beforeRule + ' ' + beforeDecl + nl;

      // Shadow layer kept but default opacity zero, uses same blend mode
      var afterDecl = (minified
        ? 'content:\"\";position:absolute;inset:0;pointer-events:none;background:linear-gradient(calc(var(--light-angle) + 180deg),rgba(0,0,0,1) 0,rgba(0,0,0,0) 60%);background-attachment:fixed;mix-blend-mode:var(--blend-mode);opacity:0' + (masked ? ';-webkit-mask:' + maskVarToUse + ';mask:' + maskVarToUse + ';mask-mode:luminance' : '') + ';'
        : '{' + nl +
            ind + 'content: "";' + nl +
            ind + 'position: absolute; inset: 0; pointer-events: none;' + nl +
            ind + 'background: linear-gradient(calc(var(--light-angle) + 180deg), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%);' + nl +
            ind + 'background-attachment: fixed;' + nl +
            ind + 'mix-blend-mode: var(--blend-mode);' + nl +
            ind + 'opacity: 0;' + nl +
            (masked ? (ind + '-webkit-mask: ' + maskVarToUse + ';' + nl + ind + 'mask: ' + maskVarToUse + ';' + nl + ind + 'mask-mode: luminance;' + nl) : '') +
          '}');

      if (cfg.preview !== 'off') {
        css += afterRule + ' ' + afterDecl + nl;
      }

      // Cache the generated CSS
      var generatedCSS = css.substring(inputCSS.length);
      cssCache[cacheKey] = generatedCSS;
      lastConfigKey = configKey;

      return css;
    }

    return {
      hooks: {
        afterBuildCSS: function (ctx) {
          try {
            if (!ctx || !ctx.css || !ctx.selector) return;
            var out = appendOverlayCSS(ctx.css, ctx.selector, !!ctx.minified, ctx.imageData);
            return { css: out };
          } catch (_) { return; }
        },
        beforeMaskLoaded: function (ctx) {
          // Hook called before mask is applied to preview element
          // ctx: { mask, element, mapType, lightingState }
          emit('beforeMaskLoaded', ctx);
          return ctx;
        },
        onMaskLoaded: function (ctx) {
          // Hook called after mask is applied to preview element
          // ctx: { mask, element, mapType, lightingState }
          emit('onMaskLoaded', ctx);
          return ctx;
        }
      }
    };
  }

  global.Lighting = Lighting;

  // UI metadata for PluginUI
  global.Lighting.ui = {
    id: 'lighting',
    name: 'Lighting',
    dependencies: ['mapExtractor'], // Requires mapExtractor plugin for specular maps
    controls: [
      { type: 'switch', key: 'enabled', label: 'Enable', default: false },
      { type: 'select', key: 'preset', label: 'Preset', default: 'clearcoat', options: [
        { label: 'Custom', value: 'custom' },
        { label: 'Chrome', value: 'chrome' },
        { label: 'Water', value: 'water' },
        { label: 'Wet Paint', value: 'wet-paint' },
        { label: 'Marble Floor', value: 'marble' },
        { label: 'Brushed Metal', value: 'brushed-metal' },
        { label: 'Glossy Plastic', value: 'glossy-plastic' },
        { label: 'Satin Fabric', value: 'satin' },
        { label: 'Ceramic', value: 'ceramic' },
        { label: 'Automotive Clearcoat', value: 'clearcoat' },
        { label: 'Frosted Glass', value: 'frosted-glass' }
      ]},
      { type: 'slider', key: 'lightAngle', label: 'Angle', min: 0, max: 360, step: 1, default: 171 },
      { type: 'slider', key: 'highlightAlpha', label: 'Intensity', min: 0, max: 1, step: 0.01, default: 1.0 },
      { type: 'color', key: 'color', label: 'Lighting Color', default: '#ffffff' },
      { type: 'select', key: 'blendMode', label: 'Blend Mode', default: 'screen', options: [
        { label: 'normal', value: 'normal' },
        { label: 'screen', value: 'screen' },
        { label: 'multiply', value: 'multiply' },
        { label: 'overlay', value: 'overlay' },
        { label: 'soft-light', value: 'soft-light' },
        { label: 'hard-light', value: 'hard-light' },
        { label: 'color-dodge', value: 'color-dodge' },
        { label: 'color-burn', value: 'color-burn' },
        { label: 'lighten', value: 'lighten' },
        { label: 'darken', value: 'darken' },
        { label: 'difference', value: 'difference' },
        { label: 'exclusion', value: 'exclusion' }
      ]},
      // Primary bands - Clearcoat preset defaults
      { type: 'slider', key: 'bandGap', label: 'Band Gap', min: 10, max: 300, step: 2, default: 110 },
      { type: 'slider', key: 'bandWidth', label: 'Band Width', min: 4, max: 120, step: 1, default: 50 },
      { type: 'slider', key: 'softEdge', label: 'Soft Edge', min: 0, max: 24, step: 1, default: 4 },
      // Secondary - Clearcoat preset defaults
      { type: 'slider', key: 'bandPhase', label: 'Phase', min: 0, max: 45, step: 1, default: 2 },
      { type: 'slider', key: 'bandGap2', label: 'Gap 2', min: 10, max: 240, step: 2, default: 80 },
      { type: 'slider', key: 'bandWidth2', label: 'Width 2', min: 2, max: 60, step: 1, default: 10 },
      // Tertiary - Clearcoat preset defaults
      { type: 'slider', key: 'bandPhase3', label: 'Phase 3', min: 0, max: 45, step: 1, default: 14 },
      { type: 'slider', key: 'bandGap3', label: 'Gap 3', min: 20, max: 300, step: 2, default: 120 },
      { type: 'slider', key: 'bandWidth3', label: 'Width 3', min: 2, max: 60, step: 1, default: 8 },
      { type: 'select', key: 'preview', label: 'Preview', default: 'off', options: [
        { label: 'Off (normal)', value: 'off' },
        { label: 'Masked only', value: 'masked' },
        { label: 'Unmasked only', value: 'unmasked' },
        { label: 'Mask image only', value: 'mask-only' }
      ]}
    ],
    build(values, ctx) {
      if (values.enabled === false) return null;
      return Lighting({
        enabled: true,
        lightAngle: parseInt(values.lightAngle, 10) || 0,
        blendMode: values.blendMode || 'normal',
        highlightAlpha: parseFloat(values.highlightAlpha),
        color: values.color || '#ffffff',
        reflection: !!values.reflection,
        bandGap: parseInt(values.bandGap, 10),
        bandWidth: parseInt(values.bandWidth, 10),
        bandSpace: 120,
        softEdge: parseInt(values.softEdge, 10),
        bandPhase: parseInt(values.bandPhase, 10),
        bandGap2: parseInt(values.bandGap2, 10),
        bandWidth2: parseInt(values.bandWidth2, 10),
        bandSpace2: 90,
        bandPhase3: parseInt(values.bandPhase3, 10),
        bandGap3: parseInt(values.bandGap3, 10),
        bandWidth3: parseInt(values.bandWidth3, 10),
        bandSpace3: 140,
        preview: values.preview || 'off',
        on: (ctx && ctx.hooks) ? ctx.hooks : undefined
      });
    }
  };
})(typeof window !== 'undefined' ? window : this);
