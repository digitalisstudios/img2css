# Plugin API

This library now supports plugins and inline hooks to customize processing without forking the core.

## Registering Plugins

- Via `plugins` array (recommended, works in browsers without Node):

```js
// If using ESM in browser (served over HTTP):
import img2css from './src/img2css.js';
import SoftPosterize from './src/plugins/soft-posterize.js';
await (new img2css({
  source: '/image.jpg',
  plugins: [SoftPosterize({ steps: 16, blurBoost: 1.1 })]
})).toCSS();
```

- Via inline `hooks` (quick experiments):

```js
const css = await (new img2css({
  source: '/image.jpg',
  hooks: {
    beforeProcess({ config, imageData }) { /* ... */ },
  }
})).toCSS();
```

- Via classic script tags (no modules, no Node):

```html
<script src="./src/img2css.js"></script>
<script src="./src/plugins/soft-posterize.global.js"></script>
<script>
  const converter = new img2css({
    source: '/image.jpg',
    plugins: [window.SoftPosterize({ steps: 12 })]
  });
  converter.toCSS().then(css => console.log(css));
  // window.PluginTemplate(...) is also available for custom plugins
  // via src/plugins/plugin-template.global.js
</script>
```

## Hook List and Signatures

Async lifecycle (awaited):
- `onInit({ config, instance })`
- `beforeLoad({ source }) -> { source? }`
- `afterLoad({ imageData, source }) -> { imageData? }`
- `beforeProcess({ config, imageData })`
- `afterProcess({ css, stats })`
- `onError({ stage, error })`
- `supplyPalette({ imageData, config }) -> { palette }`
- `beforeScale({ imageData, details }) -> { imageData? }`
- `afterScale({ imageData, details }) -> { imageData? }`
- `decideProcessingMode({ imageData, config, defaultMode }) -> { mode }`
- `beforeHybridSecondary({ primaryMode, secondaryMode, imageData, config }) -> { primaryMode?, secondaryMode? }`
- `combineHybrid({ primaryCSS, secondaryData, primaryMode, imageData, config, correctedCSS }) -> { css }`

Performance‑sensitive (sync):
- `beforeRowPass({ width, height, samplingRate, adjustedSamplingRate, compression, blurRadius }) -> overrides`
- `beforeColumnPass({...}) -> overrides`
- `shouldProcessLine({ axis:'row'|'column', index, stride, width, height }) -> { skip:true }`
- `transformRawStops({ stops, axis, index, imageData, config }) -> { stops }`
- `transformDedupedStops({ stops, axis, index }) -> { stops }`
- `transformOptimizedStops({ stops, axis, index }) -> { stops }`
- `addIntermediateStops({ stops, axis, index }) -> { stops }`
- `nearestPaletteColor({ color, palette }) -> { color }`
- `buildLayer({ gradient, positionPercent, sizePercent, axis }) -> { gradient, positionPercent, sizePercent }`
- `beforeBuildCSS({ layers, selector, dimensions, minified }) -> { selector?, layers? }`
- `afterBuildCSS({ css, layers, selector, dimensions, minified }) -> { css }`

Notes:
- Return `undefined` to leave values unchanged.
- Async hooks are awaited; per‑line/per‑layer hooks are sync for performance.

## Authoring Plugins

A plugin is either:
- a function returning a hooks map or `{ hooks }`, or
- an object with a `hooks` property or direct hook methods.

See `src/plugins/plugin-template.js` and `src/plugins/soft-posterize.js` for examples.

## Plugin-Local Hooks

Plugins may expose their own hooks for consumers to observe or adjust the plugin’s behavior without forking it. Convention:

- Options accept `on` or `pluginHooks` with callbacks.
- Each callback receives a payload and may optionally return a replacement payload.

Example (SoftPosterize):

```html
<script src="./src/img2css.js"></script>
<script src="./src/plugins/soft-posterize.global.js"></script>
<script>
  const plugin = window.SoftPosterize({
    steps: 12,
    on: {
      resolveOptions({ options }) { options.steps = 10; return { options }; },
      beforePass({ axis, blurRadius }) { console.log('pass', axis, blurRadius); },
      beforeTransformStops({ phase, stops }) { /* optionally return {stops} */ },
      afterTransformStops({ steps, stops }) { /* inspect or tweak */ }
    }
  });

  new img2css({ source: '/image.jpg', plugins: [plugin] }).toCSS();
</script>
```

Template with local hooks is provided in:
- `src/plugins/plugin-template.js` (ESM)
- `src/plugins/plugin-template.global.js` (global)

### Example: MapExtractor (Specular Map)

Works without Node via script tags:

```html
<script src="./src/img2css.js"></script>
<script src="./src/plugins/map-extractor.global.js"></script>
<script>
  const mapPlugin = window.MapExtractor({
    type: 'specular',
    computeAt: 'original',
    threshold: 0.2,
    whitenessBlend: 0.5,
    on: {
      onMap({ type, dataURL }) {
        // Example: show preview
        if (dataURL) {
          const img = new Image(); img.src = dataURL; document.body.appendChild(img);
        }
      }
    }
  });

  new img2css({ source: '/image.jpg', plugins: [mapPlugin] }).toCSS();
</script>
```


### MapExtractor Types

Supported `types` values (can be combined):
- `specular`: high‑value/low‑saturation highlights.
- `albedo`: Retinex‑like deshaded base color (multi‑scale log‑ratio).
- `normal`: image‑height Sobel normals (RGB encoded).
- `roughness`: local gradient variance as roughness proxy (grayscale).
- `subjectnormal`: subject‑focused normal map (CSS from stops).
- `depth`: heuristic depth approximation (grayscale).
- `object`: largest connected region mask (binary RGBA).
- `irradiance`: large‑radius Gaussian blur (RGB low‑frequency).

Controls:
- `normalStrength`, `roughnessWindow`, `irradianceRadius`, `albedoDeshade`.

Note: CSS emission is delivered for `specular`, `normal`, `roughness`, and `subjectnormal` via `onMapCSS`. Other maps emit pixel data via `onMap` (`dataURL`) for display or saving.

Usage mapping in demo UI:
- Specularity CSS uses the Roughness map output (derived spec look).
- Reflection CSS uses the Subject Normal map output (work‑in‑progress proxy).
