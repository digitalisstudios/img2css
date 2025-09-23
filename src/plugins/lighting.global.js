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

    var cfg = {
      enabled: options.enabled !== false,
      // Visuals
      lightAngle: (options.lightAngle == null ? 173 : options.lightAngle),
      blendMode: options.blendMode || 'color-dodge',
      highlightAlpha: (options.highlightAlpha == null ? 0.75 : options.highlightAlpha),
      // Banding (primary)
      bandGap: (options.bandGap == null ? 120 : options.bandGap),
      bandWidth: (options.bandWidth == null ? 24 : options.bandWidth),
      bandSpace: (options.bandSpace == null ? 120 : options.bandSpace),
      softEdge: (options.softEdge == null ? 6 : options.softEdge),
      // Secondary
      bandPhase: (options.bandPhase == null ? 8 : options.bandPhase),
      bandGap2: (options.bandGap2 == null ? 90 : options.bandGap2),
      bandWidth2: (options.bandWidth2 == null ? 12 : options.bandWidth2),
      bandSpace2: (options.bandSpace2 == null ? 90 : options.bandSpace2),
      // Tertiary
      bandPhase3: (options.bandPhase3 == null ? 17 : options.bandPhase3),
      bandGap3: (options.bandGap3 == null ? 140 : options.bandGap3),
      bandWidth3: (options.bandWidth3 == null ? 10 : options.bandWidth3),
      bandSpace3: (options.bandSpace3 == null ? 140 : options.bandSpace3),
      // Masks
      maskVar: options.maskVar || 'var(--lighting-mask, var(--spec-mask))',
      // Preview: 'off'|'masked'|'unmasked'
      preview: options.preview || 'off'
    };

    function appendOverlayCSS(inputCSS, selector, minified) {
      if (!cfg.enabled) return inputCSS;
      var nl = minified ? '' : '\n';
      var ind = minified ? '' : '  ';
      var sel = selector + '.css-lighting';
      var beforeRule = sel + '::before';
      var afterRule = sel + '::after';
      var baseRule = sel;
      var css = inputCSS + (minified ? '' : nl + nl);

      // Ensure relative positioning for overlay
      css += baseRule + (minified ? '{position:relative;}' : ' {' + nl + ind + 'position: relative;' + nl + '}') + nl;

      // Build banded backgrounds with one-sided soft edge → hard → fade
      var bg1 = 'repeating-linear-gradient(' +
        cfg.lightAngle + 'deg,' +
        'transparent 0,' +
        'transparent ' + cfg.bandGap + 'px,' +
        'var(--highlight-color-soft, rgba(255,255,255,0.15)) ' + cfg.bandGap + 'px,' +
        'var(--highlight-color, #ffffff) ' + (cfg.bandGap + cfg.softEdge) + 'px,' +
        'var(--highlight-color-0, rgba(255,255,255,0)) ' + (cfg.bandGap + cfg.softEdge + cfg.bandWidth) + 'px,' +
        'transparent ' + (cfg.bandGap + cfg.softEdge + cfg.bandWidth + cfg.bandSpace) + 'px' +
      ')';
      var bg2 = 'repeating-linear-gradient(' +
        (cfg.lightAngle + cfg.bandPhase) + 'deg,' +
        'transparent 0,' +
        'transparent ' + cfg.bandGap2 + 'px,' +
        'var(--highlight-color-soft, rgba(255,255,255,0.15)) ' + cfg.bandGap2 + 'px,' +
        'var(--highlight-color-weak, rgba(255,255,255,0.35)) ' + (cfg.bandGap2 + cfg.softEdge) + 'px,' +
        'rgba(255,255,255,0) ' + (cfg.bandGap2 + cfg.softEdge + cfg.bandWidth2) + 'px,' +
        'transparent ' + (cfg.bandGap2 + cfg.softEdge + cfg.bandWidth2 + cfg.bandSpace2) + 'px' +
      ')';
      var bg3 = 'repeating-linear-gradient(' +
        (cfg.lightAngle + cfg.bandPhase3) + 'deg,' +
        'transparent 0,' +
        'transparent ' + cfg.bandGap3 + 'px,' +
        'var(--highlight-color-soft, rgba(255,255,255,0.15)) ' + cfg.bandGap3 + 'px,' +
        'var(--highlight-color-weak2, rgba(255,255,255,0.2)) ' + (cfg.bandGap3 + cfg.softEdge) + 'px,' +
        'rgba(255,255,255,0) ' + (cfg.bandGap3 + cfg.softEdge + cfg.bandWidth3) + 'px,' +
        'transparent ' + (cfg.bandGap3 + cfg.softEdge + cfg.bandWidth3 + cfg.bandSpace3) + 'px' +
      ')';

      var masked = (cfg.preview !== 'unmasked');
      var beforeDecl = (minified
        ? 'content:\"\";position:absolute;inset:0;pointer-events:none;background:' + bg1 + ',' + bg2 + ',' + bg3 + ';background-attachment:fixed;mix-blend-mode:' + cfg.blendMode + ';opacity:' + cfg.highlightAlpha + (masked ? ';-webkit-mask:' + cfg.maskVar + ';mask:' + cfg.maskVar + ';mask-mode:luminance' : '') + ';'
        : '{' + nl +
            ind + 'content: "";' + nl +
            ind + 'position: absolute; inset: 0; pointer-events: none;' + nl +
            ind + 'background: ' + nl + ind + ind + bg1 + ',' + nl + ind + ind + bg2 + ',' + nl + ind + ind + bg3 + ';' + nl +
            ind + 'background-attachment: fixed;' + nl +
            ind + 'mix-blend-mode: ' + cfg.blendMode + ';' + nl +
            ind + 'opacity: ' + cfg.highlightAlpha + ';' + nl +
            (masked ? (ind + '-webkit-mask: ' + cfg.maskVar + ';' + nl + ind + 'mask: ' + cfg.maskVar + ';' + nl + ind + 'mask-mode: luminance;' + nl) : '') +
          '}');

      css += beforeRule + ' ' + beforeDecl + nl;

      // Shadow layer kept but default opacity zero, uses same blend mode
      var afterDecl = (minified
        ? 'content:\"\";position:absolute;inset:0;pointer-events:none;background:linear-gradient(' + (cfg.lightAngle + 180) + 'deg,rgba(0,0,0,1) 0,rgba(0,0,0,0) 60%);background-attachment:fixed;mix-blend-mode:' + cfg.blendMode + ';opacity:0' + (masked ? ';-webkit-mask:' + cfg.maskVar + ';mask:' + cfg.maskVar + ';mask-mode:luminance' : '') + ';'
        : '{' + nl +
            ind + 'content: "";' + nl +
            ind + 'position: absolute; inset: 0; pointer-events: none;' + nl +
            ind + 'background: linear-gradient(' + (cfg.lightAngle + 180) + 'deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%);' + nl +
            ind + 'background-attachment: fixed;' + nl +
            ind + 'mix-blend-mode: ' + cfg.blendMode + ';' + nl +
            ind + 'opacity: 0;' + nl +
            (masked ? (ind + '-webkit-mask: ' + cfg.maskVar + ';' + nl + ind + 'mask: ' + cfg.maskVar + ';' + nl + ind + 'mask-mode: luminance;' + nl) : '') +
          '}');

      if (cfg.preview !== 'off') {
        css += afterRule + ' ' + afterDecl + nl;
      }

      return css;
    }

    return {
      hooks: {
        afterBuildCSS: function (ctx) {
          try {
            if (!ctx || !ctx.css || !ctx.selector) return;
            var out = appendOverlayCSS(ctx.css, ctx.selector, !!ctx.minified);
            return { css: out };
          } catch (_) { return; }
        }
      }
    };
  }

  global.Lighting = Lighting;

  // UI metadata for PluginUI
  global.Lighting.ui = {
    id: 'lighting',
    name: 'Lighting',
    controls: [
      { type: 'switch', key: 'enabled', label: 'Enable', default: true },
      { type: 'slider', key: 'lightAngle', label: 'Angle', min: 0, max: 360, step: 1, default: 173 },
      { type: 'slider', key: 'highlightAlpha', label: 'Highlight Alpha', min: 0, max: 1, step: 0.01, default: 0.75 },
      { type: 'select', key: 'blendMode', label: 'Blend Mode', default: 'color-dodge', options: [
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
      // Primary bands
      { type: 'slider', key: 'bandGap', label: 'Band Gap', min: 10, max: 300, step: 2, default: 120 },
      { type: 'slider', key: 'bandWidth', label: 'Band Width', min: 4, max: 120, step: 1, default: 24 },
      { type: 'slider', key: 'softEdge', label: 'Soft Edge', min: 0, max: 24, step: 1, default: 6 },
      // Secondary
      { type: 'slider', key: 'bandPhase', label: 'Phase', min: 0, max: 45, step: 1, default: 8 },
      { type: 'slider', key: 'bandGap2', label: 'Gap 2', min: 10, max: 240, step: 2, default: 90 },
      { type: 'slider', key: 'bandWidth2', label: 'Width 2', min: 2, max: 60, step: 1, default: 12 },
      // Tertiary
      { type: 'slider', key: 'bandPhase3', label: 'Phase 3', min: 0, max: 45, step: 1, default: 17 },
      { type: 'slider', key: 'bandGap3', label: 'Gap 3', min: 20, max: 300, step: 2, default: 140 },
      { type: 'slider', key: 'bandWidth3', label: 'Width 3', min: 2, max: 60, step: 1, default: 10 },
      { type: 'select', key: 'preview', label: 'Preview', default: 'off', options: [
        { label: 'Off (normal)', value: 'off' },
        { label: 'Masked only', value: 'masked' },
        { label: 'Unmasked only', value: 'unmasked' }
      ]}
    ],
    build(values, ctx) {
      if (values.enabled === false) return null;
      return Lighting({
        enabled: true,
        lightAngle: parseInt(values.lightAngle, 10) || 0,
        blendMode: values.blendMode || 'normal',
        highlightAlpha: parseFloat(values.highlightAlpha),
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

