# img2css

A powerful JavaScript class for converting images into pure CSS gradients with advanced processing options including posterization, hybrid processing modes, and intelligent compression.

## Installation

Include the standalone JavaScript class in your project:

```html
<script src="img2css.js"></script>
```

Or import as a module:

```javascript
import img2css from './img2css.js';
```

## Basic Usage

### Simple Usage (Recommended)

```javascript
// Create converter with image source and options
const converter = new img2css({ 
    source: '/path/to/image.jpg',
    details: 80,
    compression: 15,
    processingMode: 'auto'
});

// Generate CSS - that's it!
const css = await converter.toCSS();
console.log(css); // CSS class string ready to use

// Optional: Access detailed stats from last conversion
console.log(converter.stats.settings); // Applied settings and dimensions
```

### Minimal Usage

```javascript
// Use defaults (details: 100, compression: 15, processingMode: 'auto')
const converter = new img2css({ source: '/path/to/image.jpg' });
const css = await converter.toCSS();
```

### From File Upload

```javascript
// Simple one-liner
const css = await (new img2css({ 
    source: fileInput.files[0],
    details: 80,
    compression: 15 
})).toCSS();
```

### From Data URL String

```javascript
// Usage with base64 data URL
const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
const css = await (new img2css({ 
    source: dataUrl,
    details: 80,
    compression: 15 
})).toCSS();
```

### From Canvas ImageData

```javascript
// Direct usage with existing canvas ImageData
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// Simple one-liner
const css = await (new img2css({ 
    source: imageData,
    details: 90,
    compression: 10,
    processingMode: 'hybrid'
})).toCSS();
```

## Configuration Options

### Core Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `details` | number | 80 | 0-100 | Processing detail level (higher = more detail, larger output) |
| `compression` | number | 15 | 0-100 | Color reduction level (higher = smaller output, less accuracy) |
| `processingMode` | string | 'auto' | See modes | Gradient direction processing mode |
| `posterize` | number | 0 | 0.0-1.0 | Posterization strength (0 = off, 1 = full palette limiting) |
| `minified` | boolean | false | - | Minify CSS output |
| `maxSize` | string\|number\|null | null | - | Target file size limit (numeric values default to KB, supports "MB" suffix) |

### Processing Modes

- **`'auto'`**: Automatically detects image orientation and chooses optimal gradient direction
- **`'rows'`**: Generates horizontal gradients (left-to-right)
- **`'columns'`**: Generates vertical gradients (top-to-bottom)
- **`'hybrid'`**: Combines both directions with edge detection for superior accuracy

## Advanced Features

### Posterization

Limit gradients to colors from the original image palette:

```javascript
const css = await converter.toCSS(imageData, {
    details: 80,
    compression: 10,
    posterize: 0.7  // 70% blend to original palette
});
```

Posterization strength controls the blend between sampled colors and nearest palette colors:
- `0.0`: No posterization (normal gradient sampling)
- `0.5`: 50% blend between sampled and palette colors
- `1.0`: Full posterization (colors snap to original palette)

### Hybrid Processing

Best quality output by combining multiple gradient directions:

```javascript
const css = await converter.toCSS(imageData, {
    details: 90,
    compression: 5,
    processingMode: 'hybrid'  // Uses both row and column analysis
});
```

Hybrid mode:
1. Generates primary gradient (opposite of auto-detection)
2. Generates secondary gradient for edge detection
3. Uses edge analysis to improve primary gradient accuracy
4. Returns single optimized CSS gradient

### Automatic Upscaling

Images smaller than 2K resolution are automatically upscaled 2x using bilinear interpolation for better sampling quality while maintaining original coordinate mapping.

### Intelligent Compression

Even at 0% compression, the system removes colors within 6 RGB units to clean up output:

```javascript
// Still removes near-duplicate colors
const css = await converter.toCSS(imageData, {
    details: 100,
    compression: 0  // Removes colors within 6 RGB unit similarity
});
```

## API Reference

### Constructor

```javascript
new img2css(config = {})
```

Optional configuration object with default values for all processing options.

### Methods

#### `toCSS(imageData, options = {})`

Main processing method that converts ImageData to CSS gradient.

**Parameters:**
- `imageData`: HTML5 ImageData object from canvas
- `options`: Configuration object (see Configuration Options)

**Returns:** Promise resolving to CSS class string

#### `extractColorPalette(imageData, maxColors = 1024)`

Extract unique colors from image for posterization.

**Parameters:**
- `imageData`: HTML5 ImageData object
- `maxColors`: Maximum colors to extract

**Returns:** Array of color objects `{r, g, b, a}`

#### `scaleImageByDetails(imageData, details)`

Scale image based on detail level and automatic upscaling rules.

**Parameters:**
- `imageData`: Source image data
- `details`: Detail percentage (0-100)

**Returns:** Scaled ImageData object

#### `optimizeColorStopsStandalone(colorStops, compression)`

Optimize color stops for smaller CSS output.

**Parameters:**
- `colorStops`: Array of color stop objects
- `compression`: Compression percentage (0-100)

**Returns:** Optimized color stops array

## Processing Pipeline

1. **Input Validation**: Verify ImageData format and dimensions
2. **Auto-Upscaling**: 2x upscale for images < 2K resolution
3. **Detail Scaling**: Scale based on detail percentage
4. **Color Palette Extraction**: Extract unique colors (if posterization enabled)
5. **Gradient Generation**: Process rows, columns, or hybrid mode
6. **Color Sampling**: Sample with Gaussian blur and posterization
7. **Duplicate Removal**: Remove consecutive identical colors
8. **Compression**: Optimize color stops based on compression level
9. **CSS Generation**: Convert to CSS gradient syntax

## Performance Characteristics

### Processing Speed
- Optimized for real-time preview updates
- Gaussian sampling with configurable blur radius
- Efficient canvas operations with minimal memory allocation

### Output Quality
- Typically achieves 94%+ data reduction from original image
- Adaptive blur prevents pixelation at high compression
- Smart color stop optimization maintains visual fidelity

### Memory Usage
- Non-destructive processing (original image unchanged)
- Efficient ImageData handling
- Automatic cleanup of intermediate processing data

## Examples

### Basic Gradient Conversion

```javascript
// High quality, minimal compression
const css = await (new img2css({
    source: '/path/to/image.jpg',
    details: 95,
    compression: 5,
    processingMode: 'auto'
})).toCSS();

// Apply to element
document.querySelector('.gradient-bg').innerHTML = `<style>${css}</style>`;
document.querySelector('.gradient-bg').className = 'slick-img-gradient';
```

### Posterized Art Style

```javascript
// Create posterized effect limited to original colors
const css = await (new img2css({
    source: '/path/to/image.jpg',
    details: 80,
    compression: 20,
    posterize: 0.8,  // Strong posterization
    processingMode: 'hybrid'
})).toCSS();
```

### High Compression for Performance

```javascript
// Optimized for small file size
const css = await (new img2css({
    source: '/path/to/image.jpg',
    details: 60,
    compression: 40,
    minified: true,
    processingMode: 'auto'
})).toCSS();
```

### Custom Processing Pipeline

```javascript
// Process multiple images with same settings
const sharedConfig = { details: 85, compression: 12 };

const results = await Promise.all([
    (new img2css({ source: '/path/to/image1.jpg', ...sharedConfig })).toCSS(),
    (new img2css({ source: '/path/to/image2.jpg', ...sharedConfig })).toCSS(),
    (new img2css({ source: '/path/to/image3.jpg', ...sharedConfig })).toCSS()
]);
```

## Browser Compatibility

- **Canvas Support**: Requires HTML5 Canvas and ImageData
- **ES6 Features**: Uses async/await, classes, arrow functions
- **Modern Browsers**: Chrome 55+, Firefox 52+, Safari 10+, Edge 79+

## Error Handling

The class includes comprehensive error handling:

```javascript
try {
    const css = await (new img2css({
        source: '/path/to/image.jpg',
        details: 80,
        compression: 15
    })).toCSS();
} catch (error) {
    console.error('Gradient conversion failed:', error.message);
    // Handle error appropriately
}
```

Common error scenarios:
- Invalid ImageData object
- Corrupted image data
- Insufficient memory for large images
- Invalid configuration parameters

## Performance Tips

1. **Optimize detail level**: Start with 80% for good quality/performance balance
2. **Use appropriate compression**: 10-20% compression often provides good results
3. **Consider image size**: Larger images require more processing time
4. **Batch processing**: Reuse converter instance for multiple images
5. **Posterization**: Only enable when needed, as it adds processing overhead

## License

This class is designed for integration into web applications requiring dynamic image-to-CSS gradient conversion capabilities.