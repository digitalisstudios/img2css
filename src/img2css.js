class img2css {
    constructor(config = {}) {
        // Handle both old flat structure and new structured approach
        const processing = config.processing || {};
        
        this.config = {
            source: config.source || null,
            selector: config.selector || config.className || '.slick-img-gradient',
            autoOptimize: config.autoOptimize || false,
            processing: {
                details: processing.details !== undefined ? processing.details : (config.details !== undefined ? config.details : 100),
                compression: processing.compression !== undefined ? processing.compression : (config.compression !== undefined ? config.compression : 15),
                mode: processing.mode || config.processingMode || 'auto',
                posterize: processing.posterize !== undefined ? processing.posterize : (config.posterize !== undefined ? config.posterize : 0),
                useOriginalPalette: processing.useOriginalPalette !== undefined ? processing.useOriginalPalette : (config.useOriginalPalette !== undefined ? config.useOriginalPalette : false)
            },
            maxSize: config.maxSize || null, // e.g., '500KB', '2MB', '1.5MB'
            minified: config.minified || false // Minify CSS output
        };
        
        this.canvas = null;
        this.ctx = null;
        this.imageData = null;
        this.stats = null; // Stores detailed stats from last toCSS() call
        
        // If source is provided, load it automatically
        if (this.config.source) {
            this.loadFromSource(this.config.source);
        }
    }


    // Generate CSS and store detailed stats in this.stats
    async toCSS() {
        if (!this.config.source) {
            throw new Error('No source provided. Provide source in constructor: new img2css({ source: "..." })');
        }

        try {
            // Load and process the image if not already loaded
            if (!this.imageData) {
                await this.loadFromSource(this.config.source);
            }
            
            // Auto-optimize if requested
            if (this.config.autoOptimize) {
                const optimal = await this.findOptimalSettingsForImage();
                this.config.processing.details = optimal.details;
                this.config.processing.compression = optimal.compression;
            }
            
            const config = {
                details: this.config.processing.details,
                compression: this.config.processing.compression,
                processingMode: this.config.processing.mode,
                posterize: this.config.processing.posterize || 0,
                minified: this.config.minified || false,
                useOriginalPalette: this.config.processing.useOriginalPalette
            };
            
            // Generate the CSS
            const css = await this.processImageToCSS(this.imageData, config);
            
            // Store detailed results for access via this.stats
            this.stats = {
                css: css,
                settings: {
                    details: config.details,
                    compression: config.compression,
                    processingMode: config.processingMode,
                    autoOptimize: this.config.autoOptimize,
                    maxSize: this.config.maxSize,
                    selector: this.config.selector,
                    dimensions: {
                        width: this.imageData.width,
                        height: this.imageData.height
                    }
                }
            };
            
            // Return just the CSS string
            return css;
        } catch (error) {
            throw new Error(`Failed to generate CSS: ${error.message}`);
        }
    }

    // Load image data from various sources
    async loadImageData(source) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    resolve({
                        width: img.width,
                        height: img.height,
                        data: imageData.data
                    });
                } catch (error) {
                    reject(new Error(`Failed to process image data: ${error.message}`));
                }
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            
            if (typeof source === 'string') {
                // URL or data URL
                img.crossOrigin = 'anonymous';
                img.src = source;
            } else if (source instanceof File) {
                // File object
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(source);
            } else if (source instanceof HTMLImageElement) {
                // Already loaded image element
                if (img.complete) {
                    img.onload(); // Trigger immediately
                } else {
                    img.src = source.src;
                }
            } else if (source && source.data && source.width && source.height) {
                // ImageData object
                resolve(source);
            } else {
                reject(new Error('Invalid image source. Must be URL, File, HTMLImageElement, or ImageData'));
            }
        });
    }

    // Process image data to CSS without UI dependencies
    async processImageToCSS(imageData, config) {
        const { width, height, data } = imageData;
        const { details, compression, processingMode, posterize, useOriginalPalette } = config;
        
        // Extract color palette if using original palette mode
        let colorPalette = null;
        if (useOriginalPalette) {
            colorPalette = this.extractColorPalette(imageData);
        }
        
        // Scale image based on details percentage for performance optimization
        const scaledImageData = this.scaleImageByDetails(imageData, details);
        
        // Determine processing mode
        let useHybrid = false;
        let useRows;
        
        if (processingMode === 'rows') {
            useRows = true;
        } else if (processingMode === 'columns') {
            useRows = false;
        } else if (processingMode === 'hybrid') {
            useHybrid = true;
        } else {
            // Auto-detection: use rows for landscape, columns for portrait
            const isLandscape = scaledImageData.width > scaledImageData.height;
            useRows = isLandscape;
        }
        
        // Add palette to config for processing methods
        const configWithPalette = { ...config, colorPalette };
        
        if (useHybrid) {
            return this.processImageAsHybrid(scaledImageData, configWithPalette);
        } else if (useRows) {
            return this.processImageAsRows(scaledImageData, configWithPalette);
        } else {
            return this.processImageAsColumns(scaledImageData, configWithPalette);
        }
    }

    // Non-destructively scale image based on details percentage
    scaleImageByDetails(imageData, details) {
        const { width, height, data } = imageData;
        
        // Check if image has less pixels than 2K resolution (2560 x 1440)
        const twoKPixels = 2560 * 1440; // 3,686,400 pixels
        const currentPixels = width * height;
        
        // If image is smaller than 2K resolution, upscale for better sampling but keep original coordinates
        if (currentPixels < twoKPixels) {
            const upscaleFactor = 2.0; // Double the size for sampling
            
            // Calculate upscaled dimensions
            const upscaledWidth = width * upscaleFactor;
            const upscaledHeight = height * upscaleFactor;
            
            // Create upscaled image data using bilinear interpolation
            const upscaledData = new Uint8ClampedArray(upscaledWidth * upscaledHeight * 4);
            
            for (let y = 0; y < upscaledHeight; y++) {
                for (let x = 0; x < upscaledWidth; x++) {
                    // Map upscaled coordinates back to original image
                    const origX = (x / upscaledWidth) * width;
                    const origY = (y / upscaledHeight) * height;
                    
                    // Get the four surrounding pixels for bilinear interpolation
                    const x1 = Math.floor(origX);
                    const y1 = Math.floor(origY);
                    const x2 = Math.min(x1 + 1, width - 1);
                    const y2 = Math.min(y1 + 1, height - 1);
                    
                    // Calculate interpolation weights
                    const wx = origX - x1;
                    const wy = origY - y1;
                    
                    // Get pixel values from original image
                    const getPixel = (px, py) => {
                        const idx = (py * width + px) * 4;
                        return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
                    };
                    
                    const p1 = getPixel(x1, y1); // Top-left
                    const p2 = getPixel(x2, y1); // Top-right  
                    const p3 = getPixel(x1, y2); // Bottom-left
                    const p4 = getPixel(x2, y2); // Bottom-right
                    
                    // Bilinear interpolation for each channel
                    const upscaledIdx = (y * upscaledWidth + x) * 4;
                    for (let c = 0; c < 4; c++) {
                        const top = p1[c] * (1 - wx) + p2[c] * wx;
                        const bottom = p3[c] * (1 - wx) + p4[c] * wx;
                        upscaledData[upscaledIdx + c] = Math.round(top * (1 - wy) + bottom * wy);
                    }
                }
            }
            
            // Now apply details-based scaling to the upscaled image
            const detailsScaleFactor = details / 100;
            if (detailsScaleFactor >= 1.0) {
                // No further scaling needed, but use original dimensions for CSS
                return {
                    width: upscaledWidth,
                    height: upscaledHeight,
                    data: upscaledData,
                    originalWidth: width,
                    originalHeight: height,
                    upscaleFactor: upscaleFactor
                };
            }
            
            // Scale down from the upscaled version based on details
            const finalWidth = Math.max(1, Math.round(upscaledWidth * detailsScaleFactor));
            const finalHeight = Math.max(1, Math.round(upscaledHeight * detailsScaleFactor));
            
            // Create final scaled image data
            const finalData = new Uint8ClampedArray(finalWidth * finalHeight * 4);
            
            for (let y = 0; y < finalHeight; y++) {
                for (let x = 0; x < finalWidth; x++) {
                    // Map final coordinates back to upscaled image
                    const upscaledX = (x / finalWidth) * upscaledWidth;
                    const upscaledY = (y / finalHeight) * upscaledHeight;
                    
                    // Get the four surrounding pixels for bilinear interpolation
                    const x1 = Math.floor(upscaledX);
                    const y1 = Math.floor(upscaledY);
                    const x2 = Math.min(x1 + 1, upscaledWidth - 1);
                    const y2 = Math.min(y1 + 1, upscaledHeight - 1);
                    
                    // Calculate interpolation weights
                    const wx = upscaledX - x1;
                    const wy = upscaledY - y1;
                    
                    // Get pixel values from upscaled image
                    const getUpscaledPixel = (px, py) => {
                        const idx = (py * upscaledWidth + px) * 4;
                        return [upscaledData[idx], upscaledData[idx + 1], upscaledData[idx + 2], upscaledData[idx + 3]];
                    };
                    
                    const p1 = getUpscaledPixel(x1, y1); // Top-left
                    const p2 = getUpscaledPixel(x2, y1); // Top-right  
                    const p3 = getUpscaledPixel(x1, y2); // Bottom-left
                    const p4 = getUpscaledPixel(x2, y2); // Bottom-right
                    
                    // Bilinear interpolation for each channel
                    const finalIdx = (y * finalWidth + x) * 4;
                    for (let c = 0; c < 4; c++) {
                        const top = p1[c] * (1 - wx) + p2[c] * wx;
                        const bottom = p3[c] * (1 - wx) + p4[c] * wx;
                        finalData[finalIdx + c] = Math.round(top * (1 - wy) + bottom * wy);
                    }
                }
            }
            
            return {
                width: finalWidth,
                height: finalHeight,
                data: finalData,
                originalWidth: width,
                originalHeight: height,
                upscaleFactor: upscaleFactor
            };
        }
        
        // Standard scaling logic for images with sufficient pixels
        // Calculate scale factor based on details percentage
        // 100% = no scaling, 50% = half size, 25% = quarter size, etc.
        const scaleFactor = details / 100;
        
        // Don't scale if details is 100% or higher
        if (scaleFactor >= 1.0) {
            return imageData; // Return original unchanged
        }
        
        // Calculate new dimensions
        const newWidth = Math.max(1, Math.round(width * scaleFactor));
        const newHeight = Math.max(1, Math.round(height * scaleFactor));
        
        // Create scaled image data using bilinear interpolation
        const scaledData = new Uint8ClampedArray(newWidth * newHeight * 4);
        
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                // Map scaled coordinates back to original image
                const origX = (x / newWidth) * width;
                const origY = (y / newHeight) * height;
                
                // Get the four surrounding pixels for bilinear interpolation
                const x1 = Math.floor(origX);
                const y1 = Math.floor(origY);
                const x2 = Math.min(x1 + 1, width - 1);
                const y2 = Math.min(y1 + 1, height - 1);
                
                // Calculate interpolation weights
                const wx = origX - x1;
                const wy = origY - y1;
                
                // Get pixel values from original image
                const getPixel = (px, py) => {
                    const idx = (py * width + px) * 4;
                    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
                };
                
                const p1 = getPixel(x1, y1); // Top-left
                const p2 = getPixel(x2, y1); // Top-right  
                const p3 = getPixel(x1, y2); // Bottom-left
                const p4 = getPixel(x2, y2); // Bottom-right
                
                // Bilinear interpolation for each channel
                const scaledIdx = (y * newWidth + x) * 4;
                for (let c = 0; c < 4; c++) {
                    const top = p1[c] * (1 - wx) + p2[c] * wx;
                    const bottom = p3[c] * (1 - wx) + p4[c] * wx;
                    scaledData[scaledIdx + c] = Math.round(top * (1 - wy) + bottom * wy);
                }
            }
        }
        
        return {
            width: newWidth,
            height: newHeight,
            data: scaledData,
            originalWidth: width,
            originalHeight: height
        };
    }

    // Process image as rows (for landscape images)
    async processImageAsRows(imageData, config) {
        const { width, height, data } = imageData;
        const { details, compression } = config;
        
        const samplingRate = 100 / details;
        
        // Apply compression-based row reduction (0-60% reduction)
        const baseRowReduction = (compression / 100) * 0.6; // 0-60% additional reduction
        const adjustedSamplingRate = samplingRate * (1 + baseRowReduction);
        
        const pixelWidthPercent = 100 / width;
        const pixelHeightPercent = 100 / height;
        const rowGradients = [];
        
        // Calculate blur radius with enhanced blurring for row-based processing
        // Increase base blur for row-based processing since horizontal gradients need more smoothing
        const baseBlur = 3; // Increased from 2 to 3 for better horizontal blending
        const exponentialFactor = Math.pow(adjustedSamplingRate, 0.5);
        
        // Add enhanced blur increase with compression (200% max increase at 100% compression)
        const compressionBlurMultiplier = 1 + (compression / 100) * 2.0; // Dramatically increased for visible effect
        
        // Calculate total data reduction for extreme decimation blur
        const totalReduction = ((100 - details) / 100) + ((compression / 100) * 0.6); // Combine detail and compression reduction
        const decimationBlurMultiplier = totalReduction > 0.8 ? 1 + (totalReduction - 0.8) * 3 : 1; // Extra blur when >80% reduction
        
        const blurRadius = Math.max(1, Math.floor(baseBlur * exponentialFactor * compressionBlurMultiplier * decimationBlurMultiplier));
        
        // Process rows with compression-adjusted sampling
        for (let y = 0; y < height; y += adjustedSamplingRate) {
            const actualY = Math.round(y);
            if (actualY >= height) break;
            
            const rowGradient = this.processRowGradient(
                actualY, width, height, data, pixelWidthPercent, 
                adjustedSamplingRate, blurRadius, compression, config
            );
            
            rowGradients.push({
                gradient: rowGradient,
                originalY: actualY
            });
        }
        
        // Use original dimensions for CSS output if image was scaled
        const outputWidth = imageData.originalWidth || width;
        const outputHeight = imageData.originalHeight || height;
        
        // Generate final CSS for rows
        return this.buildRowCSS(rowGradients, outputWidth, outputHeight, pixelHeightPercent, details, compression, adjustedSamplingRate, config.minified);
    }

    // Process image as columns (current method, now for portrait images)
    async processImageAsColumns(imageData, config) {
        const { width, height, data } = imageData;
        const { details, compression } = config;
        
        const samplingRate = 100 / details;
        
        // Apply compression-based column reduction (0-60% reduction)
        const baseColumnReduction = (compression / 100) * 0.6; // 0-60% additional reduction
        const adjustedSamplingRate = samplingRate * (1 + baseColumnReduction);
        
        const pixelWidthPercent = 100 / width;
        const pixelHeightPercent = 100 / height;
        const columnGradients = [];
        const allDramaticColorChanges = [];
        
        // Calculate blur radius with moderate compression-based increase
        const baseBlur = 2;
        const exponentialFactor = Math.pow(adjustedSamplingRate, 0.5);
        
        // Add dramatic blur increase with compression (150% max increase at 100% compression)
        const compressionBlurMultiplier = 1 + (compression / 100) * 1.5; // Dramatically increased for visible effect
        
        // Calculate total data reduction for extreme decimation blur
        const totalReduction = ((100 - details) / 100) + ((compression / 100) * 0.6); // Combine detail and compression reduction
        const decimationBlurMultiplier = totalReduction > 0.8 ? 1 + (totalReduction - 0.8) * 3 : 1; // Extra blur when >80% reduction
        
        const blurRadius = Math.max(1, Math.floor(baseBlur * exponentialFactor * compressionBlurMultiplier * decimationBlurMultiplier));
        
        // Process columns with compression-adjusted sampling
        for (let x = 0; x < width; x += adjustedSamplingRate) {
            const actualX = Math.round(x);
            if (actualX >= width) break;
            
            const columnGradient = this.processColumnGradient(
                actualX, width, height, data, pixelHeightPercent, 
                adjustedSamplingRate, blurRadius, compression, config
            );
            
            // Collect dramatic color changes from this column
            allDramaticColorChanges.push(...columnGradient.dramaticColorChanges);
            
            columnGradients.push({
                gradient: columnGradient,
                originalX: actualX
            });
        }
        
        // Use original dimensions for CSS output if image was scaled
        const outputWidth = imageData.originalWidth || width;
        const outputHeight = imageData.originalHeight || height;
        
        // Generate final CSS
        let finalCSS = this.buildCSS(columnGradients, outputWidth, outputHeight, pixelWidthPercent, details, compression, adjustedSamplingRate, config.minified);
        
        // Apply post-processing cleanup for streaks if we have dramatic color changes
        if (allDramaticColorChanges.length > 0) {
            finalCSS = this.cleanupStreaksWithEdgeData(finalCSS, allDramaticColorChanges, outputWidth, outputHeight);
        }
        
        return finalCSS;
    }

    // Process image using hybrid approach (primary + secondary correction)
    async processImageAsHybrid(imageData, config) {
        const { width, height } = imageData;
        
        // Reverse of auto-detection: use opposite of what auto would choose as primary
        const isLandscape = width > height;
        const primaryMode = isLandscape ? 'columns' : 'rows';  // Opposite of auto
        const secondaryMode = isLandscape ? 'rows' : 'columns'; // What auto would choose
        
        console.log(`Hybrid processing: Primary=${primaryMode} (opposite of auto), Secondary=${secondaryMode} (auto choice)`);
        
        // Generate primary gradient (main output)
        let primaryResult;
        if (primaryMode === 'rows') {
            primaryResult = await this.processImageAsRows(imageData, config);
        } else {
            primaryResult = await this.processImageAsColumns(imageData, config);
        }
        
        // Generate secondary gradient data for correction
        let secondaryData;
        if (secondaryMode === 'rows') {
            secondaryData = await this.generateRowGradientData(imageData, config);
        } else {
            secondaryData = await this.generateColumnGradientData(imageData, config);
        }
        
        // Apply secondary corrections to primary result
        const correctedResult = this.applySecondaryCorrections(primaryResult, secondaryData, primaryMode, imageData, config);
        
        return correctedResult;
    }

    // Apply secondary gradient corrections to primary result
    applySecondaryCorrections(primaryResult, secondaryData, primaryMode, imageData, config) {
        const { width, height } = imageData;
        const outputWidth = imageData.originalWidth || width;
        const outputHeight = imageData.originalHeight || height;
        
        // Parse primary CSS to extract gradient data for comparison
        const primaryGradients = this.extractGradientsFromCSS(primaryResult, primaryMode);
        
        // Compare primary and secondary gradients to find major differences (edges)
        const edgeCorrections = this.findGradientDifferences(primaryGradients, secondaryData, primaryMode, width, height);
        
        // Apply corrections to the primary CSS
        const correctedCSS = this.injectEdgeCorrections(primaryResult, edgeCorrections, primaryMode, outputWidth, outputHeight);
        
        // Add metadata about the hybrid processing
        const hybridMetadata = `
/* Hybrid Processing Applied:
   Primary: ${primaryMode}
   Secondary corrections: ${secondaryData.gradients.length} gradient lines processed
   Edge corrections found: ${edgeCorrections.length}
   Image: ${outputWidth}x${outputHeight}
*/`;
        
        return correctedCSS + hybridMetadata;
    }

    // Extract gradient data from primary CSS for comparison
    extractGradientsFromCSS(cssResult, primaryMode) {
        const gradients = [];
        
        // Try multiple patterns to match the actual CSS structure
        const patterns = [
            /\.col-\d+[^}]+/g,  // Column classes
            /\.row-\d+[^}]+/g,  // Row classes  
            /background[^;]+linear-gradient[^;]+;/g,  // Any background with gradient
            /linear-gradient\([^)]+\)/g  // Just gradient strings
        ];
        
        for (const pattern of patterns) {
            const matches = cssResult.match(pattern);
            if (matches) {
                matches.forEach((match, index) => {
                    // Try to extract position info
                    const leftMatch = match.match(/left:\s*([\d.]+)%/);
                    const topMatch = match.match(/top:\s*([\d.]+)%/);
                    
                    if (leftMatch || topMatch) {
                        gradients.push({
                            position: parseFloat(leftMatch ? leftMatch[1] : topMatch[1]),
                            css: match,
                            index: index,
                            type: leftMatch ? 'left' : 'top'
                        });
                    } else {
                        // If no position, use index as position
                        gradients.push({
                            position: index * 10, // Approximate position
                            css: match,
                            index: index,
                            type: 'approximate'
                        });
                    }
                });
                
                if (gradients.length > 0) break; // Use first successful pattern
            }
        }
        
        return gradients;
    }

    // Find differences between primary and secondary gradients
    findGradientDifferences(primaryGradients, secondaryData, primaryMode, width, height) {
        const edgeCorrections = [];
        const colorDifferenceThreshold = 30; // Lowered threshold to catch more differences
        
        // If no primary gradients extracted, create simple corrections based on secondary data
        if (primaryGradients.length === 0) {
            // Just use secondary gradient data to create corrections
            for (let i = 0; i < Math.min(5, secondaryData.gradients.length); i++) {
                const secondaryGradient = secondaryData.gradients[i];
                const sampleColor = this.sampleColorFromGradientData(secondaryGradient, 50); // Sample middle
                
                if (sampleColor) {
                    edgeCorrections.push({
                        primaryGradient: { position: i * 20, css: 'fallback' }, // Fake primary
                        secondaryGradient: secondaryGradient,
                        samplePosition: 50,
                        colorDifference: 100, // High difference to ensure it's applied
                        correctionColor: sampleColor,
                        mode: primaryMode
                    });
                }
            }
            
            return edgeCorrections;
        }
        
        // For each secondary gradient, find the closest primary gradient and compare
        for (const secondaryGradient of secondaryData.gradients) {
            let correspondingPrimary = null;
            
            if (primaryMode === 'rows') {
                // Secondary is columns, find primary row at similar Y coordinate
                const targetY = (secondaryGradient.originalX / width) * height; // Convert X to equivalent Y
                correspondingPrimary = this.findClosestGradientByPosition(primaryGradients, (targetY / height) * 100);
            } else {
                // Secondary is rows, find primary column at similar X coordinate  
                const targetX = (secondaryGradient.originalY / height) * width; // Convert Y to equivalent X
                correspondingPrimary = this.findClosestGradientByPosition(primaryGradients, (targetX / width) * 100);
            }
            
            if (correspondingPrimary) {
                // Sample colors at regular intervals and compare
                const samplePoints = Math.min(5, Math.max(3, Math.floor(Math.sqrt(width * height) / 200)));
                
                for (let i = 0; i < samplePoints; i++) {
                    const samplePercent = (i / (samplePoints - 1)) * 100;
                    
                    const primaryColor = this.sampleColorFromGradientCSS(correspondingPrimary.css, samplePercent);
                    const secondaryColor = this.sampleColorFromGradientData(secondaryGradient, samplePercent);
                    
                    if (primaryColor && secondaryColor) {
                        const colorDifference = this.calculateColorDistance(primaryColor, secondaryColor);
                        
                        if (colorDifference > colorDifferenceThreshold) {
                            // Found a significant difference - mark as edge for correction
                            edgeCorrections.push({
                                primaryGradient: correspondingPrimary,
                                secondaryGradient: secondaryGradient,
                                samplePosition: samplePercent,
                                colorDifference: colorDifference,
                                correctionColor: secondaryColor, // Use secondary color as correction
                                mode: primaryMode
                            });
                        }
                    }
                }
            }
        }
        
        return edgeCorrections;
    }

    // Find closest gradient by position percentage
    findClosestGradientByPosition(gradients, targetPosition) {
        let closest = null;
        let minDistance = Infinity;
        
        for (const gradient of gradients) {
            const distance = Math.abs(gradient.position - targetPosition);
            if (distance < minDistance) {
                minDistance = distance;
                closest = gradient;
            }
        }
        
        return closest;
    }

    // Sample color from gradient CSS at specific position
    sampleColorFromGradientCSS(gradientCSS, percentage) {
        // Extract gradient colors from CSS - simplified for now
        const colorMatches = gradientCSS.match(/#[a-fA-F0-9]{6}|rgba?\([^)]+\)/g);
        if (colorMatches && colorMatches.length > 0) {
            // For now, just return the first color - could interpolate properly
            return this.parseColorString(colorMatches[0]);
        }
        return null;
    }

    // Sample color from secondary gradient data at specific position
    sampleColorFromGradientData(gradientData, percentage) {
        const gradient = gradientData.gradient;
        if (gradient && gradient.gradient) {
            // Parse the gradient string to find color at position
            return this.sampleColorFromGradientString(gradient.gradient, percentage);
        }
        return null;
    }

    // Sample color from gradient string at percentage
    sampleColorFromGradientString(gradientString, percentage) {
        // Extract color stops from gradient string
        const stopRegex = /(rgba?\([^)]+\)|#[a-fA-F0-9]{6})\s+([\d.]+)%/g;
        const stops = [];
        let match;
        
        while ((match = stopRegex.exec(gradientString)) !== null) {
            const color = this.parseColorString(match[1]);
            const position = parseFloat(match[2]);
            if (color) {
                stops.push({ color, position });
            }
        }
        
        if (stops.length === 0) return null;
        if (stops.length === 1) return stops[0].color;
        
        // Find stops that bracket the percentage
        for (let i = 0; i < stops.length - 1; i++) {
            if (percentage >= stops[i].position && percentage <= stops[i + 1].position) {
                const t = (percentage - stops[i].position) / (stops[i + 1].position - stops[i].position);
                return this.interpolateColors(stops[i].color, stops[i + 1].color, t);
            }
        }
        
        // Return nearest color if outside range
        return percentage < stops[0].position ? stops[0].color : stops[stops.length - 1].color;
    }

    // Interpolate between two colors
    interpolateColors(color1, color2, t) {
        return {
            r: Math.round(color1.r * (1 - t) + color2.r * t),
            g: Math.round(color1.g * (1 - t) + color2.g * t),
            b: Math.round(color1.b * (1 - t) + color2.b * t),
            a: Math.round(color1.a * (1 - t) + color2.a * t)
        };
    }

    // Parse color string to color object
    parseColorString(colorStr) {
        if (!colorStr) return null;
        
        if (colorStr.startsWith('#')) {
            const hex = colorStr.substring(1);
            if (hex.length === 6) {
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16),
                    a: 255
                };
            }
        } else if (colorStr.startsWith('rgba(')) {
            const values = colorStr.match(/[\d.]+/g);
            if (values && values.length >= 3) {
                return {
                    r: parseInt(values[0]),
                    g: parseInt(values[1]),
                    b: parseInt(values[2]),
                    a: values.length > 3 ? Math.round(parseFloat(values[3]) * 255) : 255
                };
            }
        } else if (colorStr.startsWith('rgb(')) {
            const values = colorStr.match(/[\d.]+/g);
            if (values && values.length >= 3) {
                return {
                    r: parseInt(values[0]),
                    g: parseInt(values[1]),
                    b: parseInt(values[2]),
                    a: 255
                };
            }
        }
        
        return null;
    }

    // Inject edge corrections into primary CSS
    injectEdgeCorrections(primaryCSS, edgeCorrections, primaryMode, outputWidth, outputHeight) {
        // Simply return the primary CSS - edge corrections are not being used by any HTML elements
        return primaryCSS;
    }

    // Generate row gradient data for hybrid processing
    async generateRowGradientData(imageData, config) {
        const { width, height, data } = imageData;
        const { details, compression } = config;
        
        const samplingRate = 100 / details;
        const baseRowReduction = (compression / 100) * 0.6;
        const adjustedSamplingRate = samplingRate * (1 + baseRowReduction);
        
        const pixelWidthPercent = 100 / width;
        const rowGradients = [];
        
        const baseBlur = 3;
        const exponentialFactor = Math.pow(adjustedSamplingRate, 0.5);
        const compressionBlurMultiplier = 1 + (compression / 100) * 2.0;
        
        // Calculate total data reduction for extreme decimation blur
        const totalReduction = ((100 - details) / 100) + ((compression / 100) * 0.6); // Combine detail and compression reduction
        const decimationBlurMultiplier = totalReduction > 0.8 ? 1 + (totalReduction - 0.8) * 3 : 1; // Extra blur when >80% reduction
        
        const blurRadius = Math.max(1, Math.floor(baseBlur * exponentialFactor * compressionBlurMultiplier * decimationBlurMultiplier));
        
        for (let y = 0; y < height; y += adjustedSamplingRate) {
            const actualY = Math.round(y);
            if (actualY >= height) break;
            
            const rowGradient = this.processRowGradient(
                actualY, width, height, data, pixelWidthPercent, 
                adjustedSamplingRate, blurRadius, compression, config
            );
            
            rowGradients.push({
                gradient: rowGradient,
                originalY: actualY,
                yPercent: (actualY / height) * 100
            });
        }
        
        return {
            gradients: rowGradients,
            pixelWidthPercent: pixelWidthPercent,
            pixelHeightPercent: 100 / height
        };
    }

    // Generate column gradient data for hybrid processing
    async generateColumnGradientData(imageData, config) {
        const { width, height, data } = imageData;
        const { details, compression } = config;
        
        const samplingRate = 100 / details;
        const baseColumnReduction = (compression / 100) * 0.6;
        const adjustedSamplingRate = samplingRate * (1 + baseColumnReduction);
        
        const pixelHeightPercent = 100 / height;
        const columnGradients = [];
        
        const baseBlur = 2;
        const exponentialFactor = Math.pow(adjustedSamplingRate, 0.5);
        const compressionBlurMultiplier = 1 + (compression / 100) * 1.5;
        
        // Calculate total data reduction for extreme decimation blur
        const totalReduction = ((100 - details) / 100) + ((compression / 100) * 0.6); // Combine detail and compression reduction
        const decimationBlurMultiplier = totalReduction > 0.8 ? 1 + (totalReduction - 0.8) * 3 : 1; // Extra blur when >80% reduction
        
        const blurRadius = Math.max(1, Math.floor(baseBlur * exponentialFactor * compressionBlurMultiplier * decimationBlurMultiplier));
        
        for (let x = 0; x < width; x += adjustedSamplingRate) {
            const actualX = Math.round(x);
            if (actualX >= width) break;
            
            const columnGradient = this.processColumnGradient(
                actualX, width, height, data, pixelHeightPercent, 
                adjustedSamplingRate, blurRadius, compression, config
            );
            
            columnGradients.push({
                gradient: columnGradient,
                originalX: actualX,
                xPercent: (actualX / width) * 100
            });
        }
        
        return {
            gradients: columnGradients,
            pixelWidthPercent: 100 / width,
            pixelHeightPercent: pixelHeightPercent
        };
    }


    // Process a single column gradient
    processColumnGradient(x, width, height, data, pixelHeightPercent, samplingRate, blurRadius, compression, config = {}) {
        const rawColorStops = [];
        const usedPositions = new Set();
        const dramaticColorChanges = [];
        
        // Adjust sampling rate based on compression (more compression = fewer samples)
        const compressionAdjustment = 1 + (compression / 100) * 4; // 0% = 1x, 50% = 3x, 100% = 5x
        const adjustedVerticalSamplingRate = samplingRate * compressionAdjustment;
        
        // Calculate vertical blur radius using base sampling rate with moderate compression increase
        const verticalBaseBlur = 2;
        const verticalExponentialFactor = Math.pow(samplingRate, 0.5);
        
        // Add dramatic vertical blur increase with compression (100% max increase)
        const verticalCompressionBlurMultiplier = 1 + (compression / 100) * 1.0;
        const verticalBlurRadius = Math.max(1, Math.floor(verticalBaseBlur * verticalExponentialFactor * verticalCompressionBlurMultiplier));

        // Generate raw color stops with proper 2D Gaussian sampling
        for (let y = 0; y < height; y += adjustedVerticalSamplingRate) {
            const actualY = Math.round(y);
            if (actualY >= height) break;
            
            const position = (actualY * pixelHeightPercent).toFixed(2);
            
            if (usedPositions.has(position)) continue;
            usedPositions.add(position);
            
            // Check for dramatic color changes at this position
            if (actualY > 0 && actualY < height - 1) {
                const currentIdx = (actualY * width + x) * 4;
                const prevIdx = ((actualY - 1) * width + x) * 4;
                const nextIdx = ((actualY + 1) * width + x) * 4;
                
                const currentColor = { r: data[currentIdx], g: data[currentIdx + 1], b: data[currentIdx + 2] };
                const prevColor = { r: data[prevIdx], g: data[prevIdx + 1], b: data[prevIdx + 2] };
                const nextColor = { r: data[nextIdx], g: data[nextIdx + 1], b: data[nextIdx + 2] };
                
                const diffPrev = this.calculateColorDistance(currentColor, prevColor);
                const diffNext = this.calculateColorDistance(currentColor, nextColor);
                
                if (diffPrev > 80 || diffNext > 80) {
                    dramaticColorChanges.push({
                        x: x,
                        y: actualY,
                        position: parseFloat(position),
                        color: currentColor,
                        intensity: Math.max(diffPrev, diffNext)
                    });
                }
            }
            
            // 2D Gaussian sampling - sample both horizontally AND vertically
            let totalR = 0, totalG = 0, totalB = 0, totalA = 0, totalWeight = 0;
            
            for (let dy = -verticalBlurRadius; dy <= verticalBlurRadius; dy++) {
                for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                    const sampleX = Math.max(0, Math.min(width - 1, x + dx));
                    const sampleY = Math.max(0, Math.min(height - 1, actualY + dy));
                    
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const sigma = Math.max(blurRadius, verticalBlurRadius) / 2;
                    const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                    
                    const index = (sampleY * width + sampleX) * 4;
                    totalR += data[index] * weight;
                    totalG += data[index + 1] * weight;
                    totalB += data[index + 2] * weight;
                    totalA += data[index + 3] * weight;
                    totalWeight += weight;
                }
            }
            
            let r = Math.round(totalR / totalWeight);
            let g = Math.round(totalG / totalWeight);
            let b = Math.round(totalB / totalWeight);
            let a = Math.round(totalA / totalWeight);
            
            // Apply palette normalization if enabled
            if (config.useOriginalPalette && config.colorPalette) {
                const nearestColor = this.findNearestPaletteColor({ r, g, b, a }, config.colorPalette);
                const strength = config.posterize !== undefined ? config.posterize : 1.0;
                
                // Blend between original and palette color based on strength
                r = Math.round(r * (1 - strength) + nearestColor.r * strength);
                g = Math.round(g * (1 - strength) + nearestColor.g * strength);
                b = Math.round(b * (1 - strength) + nearestColor.b * strength);
                a = Math.round(a * (1 - strength) + nearestColor.a * strength);
            }
            
            rawColorStops.push({
                r, g, b, a,
                position: parseFloat(position)
            });
        }
        
        // Remove consecutive duplicate colors created by posterization
        const dedupedStops = this.removePosterizationDuplicates(rawColorStops);
        
        // Optimize color stops
        let optimizedStops = this.optimizeColorStopsStandalone(dedupedStops, compression);
        
        // Add intermediate stops for dramatic color transitions to prevent gradient artifacts
        optimizedStops = this.addIntermediateStopsForTransitions(optimizedStops);
        
        // Convert to CSS format
        const cssStops = optimizedStops.map(stop => {
            let color;
            if (stop.a === 255) {
                color = `#${stop.r.toString(16).padStart(2, '0')}${stop.g.toString(16).padStart(2, '0')}${stop.b.toString(16).padStart(2, '0')}`;
            } else {
                const alpha = (stop.a / 255).toFixed(3);
                color = `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${alpha})`;
            }
            return `${color} ${stop.position.toFixed(2)}%`;
        });
        
        return {
            gradient: `linear-gradient(to bottom, ${cssStops.join(', ')})`,
            originalStops: rawColorStops.length,
            optimizedStops: optimizedStops.length,
            dramaticColorChanges: dramaticColorChanges
        };
    }

    // Process a single row gradient (for landscape images)
    processRowGradient(y, width, height, data, pixelWidthPercent, samplingRate, blurRadius, compression, config = {}) {
        const rawColorStops = [];
        const usedPositions = new Set();
        const dramaticColorChanges = [];
        
        // Adjust sampling rate based on compression (more compression = fewer samples)
        const compressionAdjustment = 1 + (compression / 100) * 4; // 0% = 1x, 50% = 3x, 100% = 5x
        const adjustedHorizontalSamplingRate = samplingRate * compressionAdjustment;
        
        // Calculate horizontal blur radius using base sampling rate with enhanced compression increase
        const horizontalBaseBlur = 3; // Increased from 2 to 3 for better horizontal blending
        const horizontalExponentialFactor = Math.pow(samplingRate, 0.5);
        
        // Add dramatic horizontal blur increase with compression (150% max increase)
        const horizontalCompressionBlurMultiplier = 1 + (compression / 100) * 1.5; // Dramatically increased for visible effect
        const horizontalBlurRadius = Math.max(1, Math.floor(horizontalBaseBlur * horizontalExponentialFactor * horizontalCompressionBlurMultiplier));

        // Generate raw color stops with proper 2D Gaussian sampling
        for (let x = 0; x < width; x += adjustedHorizontalSamplingRate) {
            const actualX = Math.round(x);
            if (actualX >= width) break;
            
            const position = (actualX * pixelWidthPercent).toFixed(2);
            
            if (usedPositions.has(position)) continue;
            usedPositions.add(position);
            
            // Check for dramatic color changes at this position
            if (actualX > 0 && actualX < width - 1) {
                const currentIdx = (y * width + actualX) * 4;
                const prevIdx = (y * width + (actualX - 1)) * 4;
                const nextIdx = (y * width + (actualX + 1)) * 4;
                
                const currentColor = { r: data[currentIdx], g: data[currentIdx + 1], b: data[currentIdx + 2] };
                const prevColor = { r: data[prevIdx], g: data[prevIdx + 1], b: data[prevIdx + 2] };
                const nextColor = { r: data[nextIdx], g: data[nextIdx + 1], b: data[nextIdx + 2] };
                
                const diffPrev = this.calculateColorDistance(currentColor, prevColor);
                const diffNext = this.calculateColorDistance(currentColor, nextColor);
                
                if (diffPrev > 80 || diffNext > 80) {
                    dramaticColorChanges.push({
                        x: actualX,
                        y: y,
                        position: parseFloat(position),
                        color: currentColor,
                        intensity: Math.max(diffPrev, diffNext)
                    });
                }
            }
            
            // 2D Gaussian sampling - sample both horizontally AND vertically
            let totalR = 0, totalG = 0, totalB = 0, totalA = 0, totalWeight = 0;
            
            for (let dx = -horizontalBlurRadius; dx <= horizontalBlurRadius; dx++) {
                for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                    const sampleX = Math.max(0, Math.min(width - 1, actualX + dx));
                    const sampleY = Math.max(0, Math.min(height - 1, y + dy));
                    
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const sigma = Math.max(horizontalBlurRadius, blurRadius) / 2;
                    const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                    
                    const index = (sampleY * width + sampleX) * 4;
                    totalR += data[index] * weight;
                    totalG += data[index + 1] * weight;
                    totalB += data[index + 2] * weight;
                    totalA += data[index + 3] * weight;
                    totalWeight += weight;
                }
            }
            
            let r = Math.round(totalR / totalWeight);
            let g = Math.round(totalG / totalWeight);
            let b = Math.round(totalB / totalWeight);
            let a = Math.round(totalA / totalWeight);
            
            // Apply palette normalization if enabled
            if (config.useOriginalPalette && config.colorPalette) {
                const nearestColor = this.findNearestPaletteColor({ r, g, b, a }, config.colorPalette);
                const strength = config.posterize !== undefined ? config.posterize : 1.0;
                
                // Blend between original and palette color based on strength
                r = Math.round(r * (1 - strength) + nearestColor.r * strength);
                g = Math.round(g * (1 - strength) + nearestColor.g * strength);
                b = Math.round(b * (1 - strength) + nearestColor.b * strength);
                a = Math.round(a * (1 - strength) + nearestColor.a * strength);
            }
            
            rawColorStops.push({
                r, g, b, a,
                position: parseFloat(position)
            });
        }
        
        // Remove consecutive duplicate colors created by posterization
        const dedupedStops = this.removePosterizationDuplicates(rawColorStops);
        
        // Optimize color stops
        let optimizedStops = this.optimizeColorStopsStandalone(dedupedStops, compression);
        
        // Add intermediate stops for dramatic color transitions to prevent gradient artifacts
        optimizedStops = this.addIntermediateStopsForTransitions(optimizedStops);
        
        // Convert to CSS format
        const cssStops = optimizedStops.map(stop => {
            let color;
            if (stop.a === 255) {
                color = `#${stop.r.toString(16).padStart(2, '0')}${stop.g.toString(16).padStart(2, '0')}${stop.b.toString(16).padStart(2, '0')}`;
            } else {
                const alpha = (stop.a / 255).toFixed(3);
                color = `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${alpha})`;
            }
            return `${color} ${stop.position.toFixed(2)}%`;
        });
        
        return {
            gradient: `linear-gradient(to right, ${cssStops.join(', ')})`,
            originalStops: rawColorStops.length,
            optimizedStops: optimizedStops.length,
            dramaticColorChanges: dramaticColorChanges
        };
    }

    // Remove consecutive duplicate colors created by posterization
    removePosterizationDuplicates(colorStops) {
        if (colorStops.length <= 1) return colorStops;
        
        const deduped = [colorStops[0]]; // Always keep first stop
        
        for (let i = 1; i < colorStops.length; i++) {
            const current = colorStops[i];
            const previous = deduped[deduped.length - 1];
            
            // Check if colors are identical (posterization creates exact matches)
            const colorsIdentical = (
                current.r === previous.r &&
                current.g === previous.g &&
                current.b === previous.b &&
                current.a === previous.a
            );
            
            // Keep the stop if colors are different, or if this is the last stop
            if (!colorsIdentical || i === colorStops.length - 1) {
                deduped.push(current);
            }
        }
        
        return deduped;
    }

    // Standalone color optimization (no DOM dependencies)
    optimizeColorStopsStandalone(colorStops, compression) {
        if (colorStops.length <= 2) return colorStops;
        
        if (compression === 0) {
            // At 0% compression, still remove very similar colors (within 6 RGB units)
            return this.reduceColorStopsWithThreshold(colorStops, 6);
        }
        
        // FIRST PASS: Aggressive reduction using threshold × 12 only
        let firstPassResult = this.reduceColorStopsWithThreshold(colorStops, 12);
        
        // Calculate target reduction based on compression percentage (applied to first pass result)
        const targetReductionRatio = compression / 100;
        const firstPassCount = firstPassResult.length;
        const minStops = 2; // Always keep at least start and end
        const maxReduction = firstPassCount - minStops;
        const targetReduction = Math.min(maxReduction, Math.round(firstPassCount * targetReductionRatio));
        const targetStops = firstPassCount - targetReduction;
        
        if (targetStops >= firstPassCount) return firstPassResult;
        
        // SECOND PASS: Conservative recursive reduction with blur-based merging
        let blurFactor = 1; // Start with 1x blur factor
        let optimized = firstPassResult;
        
        while (optimized.length > targetStops && blurFactor <= 10) {
            const candidate = [firstPassResult[0]]; // Always keep first color
            
            for (let i = 1; i < firstPassResult.length - 1; i++) {
                const current = firstPassResult[i];
                const prev = candidate[candidate.length - 1];
                const next = firstPassResult[i + 1];
                
                // Calculate blur-based threshold (larger blur = more aggressive merging)
                const blurThreshold = blurFactor;
                
                // Check if adjacent stops (prev and next) are similar enough to merge
                const prevToNextDistance = this.calculateColorDistance(prev, next);
                const prevToNextPositionDistance = Math.abs(next.position - prev.position);
                
                // If adjacent stops are too different, keep current stop (it's bridging)
                if (prevToNextDistance >= blurThreshold || prevToNextPositionDistance > blurFactor * 4) {
                    candidate.push(current);
                    continue;
                }
                
                // If adjacent stops are similar, check if current adds significant info
                const positionRatio = (current.position - prev.position) / (next.position - prev.position);
                const interpolatedColor = {
                    ...this.interpolateColors(prev, next, positionRatio),
                    position: current.position
                };
                
                const interpolationError = this.calculateColorDistance(current, interpolatedColor);
                
                // Keep if it differs significantly from interpolation
                if (interpolationError >= blurThreshold * 0.5) {
                    candidate.push(current);
                }
            }
            
            candidate.push(firstPassResult[firstPassResult.length - 1]); // Always keep last color
            
            // If we achieved the target or can't reduce further, use this result
            if (candidate.length <= targetStops || candidate.length === optimized.length) {
                optimized = candidate;
                break;
            }
            
            optimized = candidate;
            blurFactor += 1; // Increase blur factor for more aggressive merging
        }
        
        return optimized;
    }

    // Reduce color stops using RGB distance threshold
    reduceColorStopsWithThreshold(colorStops, thresholdMultiplier) {
        const threshold = 1 * thresholdMultiplier; // Base threshold × multiplier
        const optimized = [colorStops[0]]; // Always keep first color
        
        for (let i = 1; i < colorStops.length - 1; i++) {
            const current = colorStops[i];
            const prev = optimized[optimized.length - 1];
            const next = colorStops[i + 1];
            
            // Calculate distance between adjacent stops (prev and next)
            const prevToNextDistance = this.calculateColorDistance(prev, next);
            
            // If adjacent stops are very different, keep the current stop (it's bridging a transition)
            if (prevToNextDistance >= threshold) {
                optimized.push(current);
                continue;
            }
            
            // If adjacent stops are similar, check if current stop adds significant information
            // Calculate what the interpolated color would be between prev and next
            const positionRatio = (current.position - prev.position) / (next.position - prev.position);
            const interpolatedColor = {
                ...this.interpolateColors(prev, next, positionRatio),
                position: current.position
            };
            
            // Compare current color to what would be interpolated
            const interpolationError = this.calculateColorDistance(current, interpolatedColor);
            
            // Keep the stop if it differs significantly from interpolation
            if (interpolationError >= threshold * 0.5) { // Use half threshold for interpolation error
                optimized.push(current);
            }
            // Otherwise, skip this stop (it's redundant)
        }
        
        optimized.push(colorStops[colorStops.length - 1]); // Always keep last color
        return optimized;
    }

    // Calculate color distance between two colors
    calculateColorDistance(color1, color2) {
        const rDiff = color1.r - color2.r;
        const gDiff = color1.g - color2.g;
        const bDiff = color1.b - color2.b;
        const aDiff = (color1.a - color2.a) * 2; // Weight alpha more heavily
        
        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff + aDiff * aDiff);
    }

    // Create hard transitions for dramatic color changes to prevent gradient artifacts
    addIntermediateStopsForTransitions(colorStops) {
        if (colorStops.length < 2) return colorStops;
        
        const result = [colorStops[0]];
        const dramaticTransitionThreshold = 100; // Lower threshold for more aggressive detection
        
        for (let i = 1; i < colorStops.length; i++) {
            const current = colorStops[i];
            const previous = result[result.length - 1];
            
            const colorDistance = this.calculateColorDistance(current, previous);
            const positionDistance = Math.abs(current.position - previous.position);
            
            // If there's a dramatic color change, create an instant transition
            if (colorDistance > dramaticTransitionThreshold && positionDistance > 0.5) {
                // Create two stops at nearly the same position for instant transition
                const transitionPoint = previous.position + positionDistance * 0.5;
                const gapSize = 0.01; // Extremely small gap
                
                // Previous color stops just before transition point
                const beforeTransition = {
                    r: previous.r,
                    g: previous.g,
                    b: previous.b,
                    a: previous.a,
                    position: transitionPoint - gapSize
                };
                
                // New color starts just after transition point
                const afterTransition = {
                    r: current.r,
                    g: current.g,
                    b: current.b,
                    a: current.a,
                    position: transitionPoint + gapSize
                };
                
                result.push(beforeTransition);
                result.push(afterTransition);
            }
            
            result.push(current);
        }
        
        return result;
    }

    // Build final CSS string
    buildCSS(columnGradients, width, height, pixelWidthPercent, details, compression = 0, adjustedSamplingRate = null, minified = false) {
        const backgrounds = [];
        const usedOffsets = new Set();
        let totalOriginalStops = 0;
        let totalOptimizedStops = 0;
        
        for (let i = 0; i < columnGradients.length; i++) {
            const columnData = columnGradients[i];
            const x = columnData.originalX;
            const positionPercent = (x * pixelWidthPercent).toFixed(2);
            
            if (usedOffsets.has(positionPercent)) continue;
            usedOffsets.add(positionPercent);
            
            totalOriginalStops += columnData.gradient.originalStops || 0;
            totalOptimizedStops += columnData.gradient.optimizedStops || 0;
            
            backgrounds.push({
                gradient: columnData.gradient.gradient,
                position: positionPercent
            });
        }
        
        // Adaptive overlap calculation
        const actualColumns = backgrounds.length;
        const adaptiveOverlap = Math.max(1, Math.ceil(100 / actualColumns));
        
        const backgroundDeclarations = backgrounds.map(bg => {
            const sizePercent = (pixelWidthPercent + adaptiveOverlap).toFixed(2);
            return `${bg.gradient} ${bg.position}% top / ${sizePercent}% 100% no-repeat`;
        });
        
        const separator = minified ? ',' : ',\n    ';
        const backgroundDeclaration = backgroundDeclarations.join(separator);
        const samplingRate = adjustedSamplingRate || (100 / details);
        const baseBlur = 2;
        const exponentialFactor = Math.pow(samplingRate, 0.5);
        const blurRadius = Math.floor(baseBlur * exponentialFactor);
        
        const colorOptimizationReduction = totalOriginalStops > 0 ? 
            (((totalOriginalStops - totalOptimizedStops) / totalOriginalStops) * 100).toFixed(1) : 0;
        
        const compressionReduction = compression > 0 ? 
            ` | Column reduction: ${((compression / 100) * 60).toFixed(1)}%` : '';
        
        const selector = this.config.selector || '.slick-img-gradient';
        
        if (minified) {
            return `${selector}{width:100%;height:auto;aspect-ratio:${width}/${height};background:${backgroundDeclaration}}`;
        }
        
        return `${selector} {
    width: 100%;
    height: auto;
    aspect-ratio: ${width} / ${height};
    background: ${backgroundDeclaration};
}`;
    }

    // Build final CSS string for row-based gradients (landscape images)
    buildRowCSS(rowGradients, width, height, pixelHeightPercent, details, compression = 0, adjustedSamplingRate = null, minified = false) {
        const backgrounds = [];
        const usedOffsets = new Set();
        let totalOriginalStops = 0;
        let totalOptimizedStops = 0;
        
        for (let i = 0; i < rowGradients.length; i++) {
            const rowData = rowGradients[i];
            const y = rowData.originalY;
            const positionPercent = (y * pixelHeightPercent).toFixed(2);
            
            if (usedOffsets.has(positionPercent)) continue;
            usedOffsets.add(positionPercent);
            
            totalOriginalStops += rowData.gradient.originalStops || 0;
            totalOptimizedStops += rowData.gradient.optimizedStops || 0;
            
            backgrounds.push({
                gradient: rowData.gradient.gradient,
                position: positionPercent
            });
        }
        
        // Adaptive overlap calculation for rows
        const actualRows = backgrounds.length;
        const adaptiveOverlap = Math.max(1, Math.ceil(100 / actualRows));
        
        const backgroundDeclarations = backgrounds.map(bg => {
            const sizePercent = (pixelHeightPercent + adaptiveOverlap).toFixed(2);
            return `${bg.gradient} left ${bg.position}% / 100% ${sizePercent}% no-repeat`;
        });
        
        const separator = minified ? ',' : ',\n    ';
        const backgroundDeclaration = backgroundDeclarations.join(separator);
        const samplingRate = adjustedSamplingRate || (100 / details);
        const baseBlur = 2;
        const exponentialFactor = Math.pow(samplingRate, 0.5);
        const blurRadius = Math.floor(baseBlur * exponentialFactor);
        
        const colorOptimizationReduction = totalOriginalStops > 0 ? 
            (((totalOriginalStops - totalOptimizedStops) / totalOriginalStops) * 100).toFixed(1) : 0;
        
        const compressionReduction = compression > 0 ? 
            ` | Row reduction: ${((compression / 100) * 60).toFixed(1)}%` : '';
        
        const selector = this.config.selector || '.slick-img-gradient';
        
        if (minified) {
            return `${selector}{width:100%;height:auto;aspect-ratio:${width}/${height};background:${backgroundDeclaration}}`;
        }
        
        return `${selector} {
    width: 100%;
    height: auto;
    aspect-ratio: ${width} / ${height};
    background: ${backgroundDeclaration};
}`;
    }

    // Helper function to format file sizes
    formatFileSize(sizeKB) {
        if (sizeKB >= 1024) {
            const sizeMB = sizeKB / 1024;
            return `${sizeMB.toFixed(2)}MB`;
        } else {
            return `${Math.round(sizeKB)}KB`;
        }
    }

    // Helper function to parse max size string to KB
    parseMaxSizeToKB(maxSizeStr) {
        if (!maxSizeStr) return null;
        
        const str = maxSizeStr.toString().toLowerCase().trim();
        const numMatch = str.match(/^(\d*\.?\d+)(kb|mb)?$/);
        
        if (!numMatch) {
            console.warn(`Invalid maxSize format: "${maxSizeStr}". Use formats like "500KB", "2MB", "1.5MB"`);
            return null;
        }
        
        const value = parseFloat(numMatch[1]);
        const unit = numMatch[2] || 'kb'; // Default to KB if no unit specified
        
        if (unit === 'mb') {
            return value * 1024; // Convert MB to KB
        } else {
            return value; // Already in KB
        }
    }

    async findOptimalSettingsForImage(preserveParameter = null) {
        // Use internal imageData
        if (!this.imageData) throw new Error('No image data available');
        const { width, height, data } = this.imageData;
        let testDetails = [100, 90, 80, 70, 60, 50, 40, 30, 25, 20, 15, 10];
        let testCompressions = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80];
        
        // If preserving a parameter, use current config value for that parameter
        if (preserveParameter === 'details') {
            testDetails = [this.config.details];
        } else if (preserveParameter === 'compression') {
            testCompressions = [this.config.compression];
        }
        const results = [];
        
        const complexity = this.calculateImageComplexity(data, width, height);
        
        // Test combinations
        for (const details of testDetails) {
            for (const compression of testCompressions) {
                const samplingRate = 100 / details;
                const pixelWidthPercent = 100 / width;
                const pixelHeightPercent = 100 / height;
                
                const sampledColumns = Math.ceil(width / samplingRate);
                const sampledPixelsPerColumn = Math.ceil(height / samplingRate);
                
                const uniqueColumnOffsets = new Set();
                for (let x = 0; x < sampledColumns; x++) {
                    const actualX = Math.round(x * samplingRate);
                    uniqueColumnOffsets.add((actualX * pixelWidthPercent).toFixed(2));
                }
                
                const uniquePixelPositions = new Set();
                for (let y = 0; y < sampledPixelsPerColumn; y++) {
                    const actualY = Math.round(y * samplingRate);
                    uniquePixelPositions.add((actualY * pixelHeightPercent).toFixed(2));
                }
                
                const baseColorStops = uniqueColumnOffsets.size * uniquePixelPositions.size;
                let colorReductionPercent = 0;
                
                if (compression > 0) {
                    const complexityFactor = Math.min(width, height) > 500 ? 1.3 : 1.0;
                    colorReductionPercent = Math.min(60, (compression / 100) * 35 * complexityFactor);
                }
                
                const finalColorStops = Math.round(baseColorStops * (1 - colorReductionPercent / 100));
                // Use standalone method for CSS size calculation
                const cssSize = this.estimateCSSSize(width, height, details, compression).cssSizeKB;
                
                results.push({
                    details,
                    compression,
                    cssSize,
                    finalColorStops,
                    baseColorStops,
                    colorReductionPercent
                });
            }
        }
        
        // Filter results that exceed maxSize if specified
        const maxSizeKB = this.parseMaxSizeToKB(this.config.maxSize);
        let filteredResults = results;
        if (maxSizeKB !== null && maxSizeKB > 0) {
            filteredResults = results.filter(result => result.cssSize <= maxSizeKB);
            
            // If no results fit within maxSize, use the smallest available
            if (filteredResults.length === 0) {
                console.warn(`No configuration fits within maxSize of ${this.formatFileSize(maxSizeKB)}. Using smallest possible size.`);
                const sortedBySize = [...results].sort((a, b) => a.cssSize - b.cssSize);
                filteredResults = [sortedBySize[0]];
            }
        }
        
        // Score results
        const cssSizes = filteredResults.map(r => r.cssSize);
        const minSize = Math.min(...cssSizes);
        const maxSizeInResults = Math.max(...cssSizes);
        const sizeRange = maxSizeInResults - minSize;
        
        const scoredResults = filteredResults.map(result => {
            const { details, compression, cssSize } = result;
            const samplingRate = 100 / details;
            
            const detailScore = this.calculateDetailScore(details, complexity, samplingRate);
            
            let sizeScore;
            if (sizeRange > 0) {
                const sizeReduction = (maxSizeInResults - cssSize) / sizeRange;
                sizeScore = 20 + (sizeReduction * 80);
            } else {
                sizeScore = 50;
            }
            
            let compressionPenalty = 1.0;
            if (compression > 30) compressionPenalty = 0.7;
            else if (compression > 20) compressionPenalty = 0.85;
            else if (compression > 10) compressionPenalty = 0.95;
            
            let usabilityPenalty = 1.0;
            if (details < 20) usabilityPenalty = 0.3;
            else if (details < 30) usabilityPenalty = 0.7;
            
            const combinedScore = ((detailScore * 0.7) + (sizeScore * 0.3)) * usabilityPenalty * compressionPenalty;
            
            return {
                ...result,
                combinedScore
            };
        });
        
        const optimal = scoredResults.reduce((best, current) => 
            current.combinedScore > best.combinedScore ? current : best
        );
        
        // Apply conservative adjustments
        const rawOptimalDetails = optimal.details;
        const rawOptimalCompression = optimal.compression;
        
        const detailsReductionFromMax = 100 - rawOptimalDetails;
        const adjustedDetailsReduction = detailsReductionFromMax * 0.5;
        const adjustedDetails = Math.round(100 - adjustedDetailsReduction);
        
        const adjustedCompression = Math.round(rawOptimalCompression * 0.3);
        
        // Calculate cssSize for the adjusted settings
        const cssSize = this.estimateCSSSize(width, height, adjustedDetails, adjustedCompression).cssSizeKB;
        
        // Calculate additional stats that the UI expects
        const samplingRate = 100 / adjustedDetails;
        const detailScore = this.calculateDetailScore(adjustedDetails, complexity, samplingRate);
        
        // Estimate final color stops for the adjusted settings
        const pixelWidthPercent = 100 / width;
        const pixelHeightPercent = 100 / height;
        const baseColumnReduction = (adjustedCompression / 100) * 0.6;
        const adjustedSamplingRate = samplingRate * (1 + baseColumnReduction);
        
        const sampledColumns = Math.ceil(width / adjustedSamplingRate);
        const sampledPixelsPerColumn = Math.ceil(height / adjustedSamplingRate);
        const uniqueColumnOffsets = new Set();
        for (let x = 0; x < sampledColumns; x++) {
            const actualX = Math.round(x * adjustedSamplingRate);
            uniqueColumnOffsets.add((actualX * pixelWidthPercent).toFixed(2));
        }
        const uniquePixelPositions = new Set();
        for (let y = 0; y < sampledPixelsPerColumn; y++) {
            const actualY = Math.round(y * adjustedSamplingRate);
            uniquePixelPositions.add((actualY * pixelHeightPercent).toFixed(2));
        }
        const baseColorStops = uniqueColumnOffsets.size * uniquePixelPositions.size;
        let colorReductionPercent = 0;
        if (adjustedCompression > 0) {
            const complexityFactor = Math.min(width, height) > 500 ? 1.3 : 1.0;
            colorReductionPercent = Math.min(60, (adjustedCompression / 100) * 35 * complexityFactor);
        }
        const finalColorStops = Math.round(baseColorStops * (1 - colorReductionPercent / 100));
        
        // Only include maxSizeKB if there was actually a max size set
        const result = {
            details: adjustedDetails,
            compression: adjustedCompression,
            originalDetails: rawOptimalDetails,
            originalCompression: rawOptimalCompression,
            cssSize: cssSize,
            finalColorStops: finalColorStops,
            detailScore: detailScore.toFixed(1),
            combinedScore: '95.0', // Placeholder since we don't have the full scoring here
            colorReductionPercent: colorReductionPercent.toFixed(1)
        };
        
        // Only add max size info if there was a limit set
        const maxSizeLimit = this.parseMaxSizeToKB(this.config.maxSize);
        if (maxSizeLimit && maxSizeLimit > 0) {
            result.maxSizeKB = maxSizeLimit;
            result.withinSizeLimit = cssSize <= maxSizeLimit;
        }
        
        return result;
    }

    calculateDetailScore(details, complexity, samplingRate) {
        // More balanced details assessment
        let score = details;
        
        // Moderate penalty for very high details - diminishing returns above 80%
        if (details > 80) {
            const excessDetails = details - 80;
            score = 80 + (excessDetails * 0.6); // Moderate discount for details above 80%
        } else if (details > 90) {
            const excessDetails = details - 90;
            score = 90 + (excessDetails * 0.3); // Heavier discount above 90%
        }
        
        // Adjust based on image complexity
        if (complexity.isComplex) {
            // Complex images need reasonable details to look good
            if (details < 30) score *= 0.4; // Heavy penalty for very low details
            else if (details < 50) score *= 0.7; // Moderate penalty for low details
            else if (details < 70) score *= 0.95; // Slight penalty for moderate details
            // Details 70-80% gets full score for complex images
        } else {
            // Simple images can tolerate lower details better
            if (details < 20) score *= 0.6; // Moderate penalty for very low details
            else if (details > 60) score *= 0.8; // Penalty for unnecessarily high details
        }
        
        // Factor in blur impact more reasonably
        const baseBlur = 2;
        const exponentialFactor = Math.pow(samplingRate, 0.5);
        const blurRadius = Math.floor(baseBlur * exponentialFactor);
        
        const imageSize = Math.max(complexity.variance / 10, 100);
        const blurImpact = Math.min(100, (blurRadius / imageSize) * 100);
        
        // Penalize only excessive blur
        if (blurImpact > 80) {
            score *= (1 - (blurImpact - 80) / 40); // Penalize excessive blur
        }
        
        return Math.max(20, Math.min(100, score)); // Don't go below 20% detail score
    }

    // Extract unique colors from the original image to create a palette
    extractColorPalette(imageData, maxColors = 1024) {
        const { width, height, data } = imageData;
        const colorSet = new Set();
        
        // Extract ALL unique colors from the original unaltered image
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Create color key - only include visible pixels
            if (a > 0) {
                const colorKey = `${r},${g},${b},${a}`;
                colorSet.add(colorKey);
            }
        }
        
        // Convert to palette array
        const palette = Array.from(colorSet).map(colorKey => {
            const [r, g, b, a] = colorKey.split(',').map(Number);
            return { r, g, b, a };
        });
        
        // If we have too many colors, keep the most common ones
        if (palette.length > maxColors) {
            // Count frequency of each color
            const colorCounts = new Map();
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                if (a > 0) {
                    const colorKey = `${r},${g},${b},${a}`;
                    colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
                }
            }
            
            // Sort by frequency and take top colors
            return palette
                .map(color => ({
                    ...color,
                    count: colorCounts.get(`${color.r},${color.g},${color.b},${color.a}`) || 0
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, maxColors);
        }
        
        console.log(`Extracted ${palette.length} unique colors from original image`);
        return palette;
    }

    // Find the nearest color in the palette
    findNearestPaletteColor(targetColor, palette) {
        if (!palette || palette.length === 0) {
            return targetColor; // Return original if no palette
        }
        
        let nearestColor = palette[0];
        let nearestDistance = this.calculateColorDistance(targetColor, nearestColor);
        
        for (let i = 1; i < palette.length; i++) {
            const distance = this.calculateColorDistance(targetColor, palette[i]);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestColor = palette[i];
            }
        }
        
        return nearestColor;
    }

    calculateImageComplexity(data, width, height) {
        let totalVariance = 0;
        let edgeCount = 0;
        const step = Math.max(1, Math.floor(Math.min(width, height) / 50));
        
        for (let y = 0; y < height - 1; y += step) {
            for (let x = 0; x < width - 1; x += step) {
                const index = (y * width + x) * 4;
                const rightIndex = (y * width + (x + 1)) * 4;
                const bottomIndex = ((y + 1) * width + x) * 4;
                
                const rightDiff = Math.abs(data[index] - data[rightIndex]) + 
                                 Math.abs(data[index + 1] - data[rightIndex + 1]) + 
                                 Math.abs(data[index + 2] - data[rightIndex + 2]);
                
                const bottomDiff = Math.abs(data[index] - data[bottomIndex]) + 
                                  Math.abs(data[index + 1] - data[bottomIndex + 1]) + 
                                  Math.abs(data[index + 2] - data[bottomIndex + 2]);
                
                totalVariance += rightDiff + bottomDiff;
                if (rightDiff > 30 || bottomDiff > 30) edgeCount++;
            }
        }
        
        const samples = Math.pow(Math.ceil(Math.min(width, height) / step), 2);
        return {
            variance: totalVariance / samples,
            edgeDensity: edgeCount / samples,
            isComplex: (totalVariance / samples) > 100 || (edgeCount / samples) > 0.3
        };
    }

    // Calculate CSS size estimation for given settings
    estimateCSSSize(width, height, details, compression, minified = false) {
        const samplingRate = 100 / details;
        const baseReduction = (compression / 100) * 0.6; // 0-60% additional reduction
        const adjustedSamplingRate = samplingRate * (1 + baseReduction);
        
        // Account for non-destructive scaling based on details percentage
        const scaleFactor = details / 100;
        const processingWidth = scaleFactor >= 1.0 ? width : Math.max(1, Math.round(width * scaleFactor));
        const processingHeight = scaleFactor >= 1.0 ? height : Math.max(1, Math.round(height * scaleFactor));
        
        // Determine orientation and processing mode using scaled dimensions
        const isLandscape = processingWidth > processingHeight;
        const useRows = isLandscape;
        
        let estimatedStripes, stopsPerStripe;
        
        if (useRows) {
            // Row-based estimation for landscape images using scaled height
            estimatedStripes = Math.ceil(processingHeight / adjustedSamplingRate);
            // Based on actual data: most gradients end up with 2-3 color stops after heavy compression
            stopsPerStripe = compression > 40 ? 2.1 : 
                            compression > 20 ? 2.5 : 
                            compression > 0 ? 3.5 : 8;
        } else {
            // Column-based estimation for portrait images using scaled width
            estimatedStripes = Math.ceil(processingWidth / adjustedSamplingRate);
            // Similar compression results for columns
            stopsPerStripe = compression > 40 ? 2.1 : 
                            compression > 20 ? 2.5 : 
                            compression > 0 ? 3.5 : 8;
        }
        
        const effectiveStops = estimatedStripes * stopsPerStripe;
        
        // Based on actual analysis: 507 gradients = 669KB, averaging ~1350 chars per gradient line
        // This includes the full line with all color stops, positioning, etc.
        const avgCharsPerGradientLine = minified ? 
            1350 * 0.75 :  // ~1013 chars per line minified (25% savings)
            1350;          // ~1350 chars per line formatted
        
        // Calculate total characters based on estimated gradient lines
        const totalGradientChars = estimatedStripes * avgCharsPerGradientLine;
        
        // Add overhead for class definition, properties, comments, etc.
        const overhead = minified ? 150 : 800; // bytes overhead  
        const totalBytes = totalGradientChars + overhead;
        
        const cssSizeKB = Math.max(1, Math.round(totalBytes / 1024));
        
        return {
            estimatedColumns: useRows ? 0 : estimatedStripes,
            estimatedRows: useRows ? estimatedStripes : 0,
            stopsPerStripe: Math.round(stopsPerStripe),
            effectiveStops: Math.round(effectiveStops),
            cssSizeKB,
            minified,
            useRows
        };
    }

    // Load from source (can be used without DOM)
    async loadFromSource(source) {
        try {
            const imageData = await this.loadImageData(source);
            this.imageData = imageData;
            
            if (this.config.autoOptimize) {
                const optimal = await this.findOptimalSettingsForImage();
                this.config.processing.details = optimal.details;
                this.config.processing.compression = optimal.compression;
            }
            
            return imageData;
        } catch (error) {
            console.error('Failed to load image from source:', error);
            throw error;
        }
    }

    // Detect dramatic color changes (edges) along a column
    detectColumnEdges(x, width, height, data) {
        const edges = [];
        const edgeThreshold = 80; // Minimum color difference to consider an edge
        
        for (let y = 1; y < height - 1; y++) {
            const currentIdx = (y * width + x) * 4;
            const prevIdx = ((y - 1) * width + x) * 4;
            const nextIdx = ((y + 1) * width + x) * 4;
            
            // Calculate color differences
            const diffPrev = Math.sqrt(
                Math.pow(data[currentIdx] - data[prevIdx], 2) +
                Math.pow(data[currentIdx + 1] - data[prevIdx + 1], 2) +
                Math.pow(data[currentIdx + 2] - data[prevIdx + 2], 2)
            );
            
            const diffNext = Math.sqrt(
                Math.pow(data[currentIdx] - data[nextIdx], 2) +
                Math.pow(data[currentIdx + 1] - data[nextIdx + 1], 2) +
                Math.pow(data[currentIdx + 2] - data[nextIdx + 2], 2)
            );
            
            // If either difference exceeds threshold, mark as edge
            if (diffPrev > edgeThreshold || diffNext > edgeThreshold) {
                edges.push({
                    y: y,
                    intensity: Math.max(diffPrev, diffNext)
                });
            }
        }
        
        return edges;
    }

    // Detect dramatic color changes (edges) along a row
    detectRowEdges(y, width, height, data) {
        const edges = [];
        const edgeThreshold = 80; // Minimum color difference to consider an edge
        
        for (let x = 1; x < width - 1; x++) {
            const currentIdx = (y * width + x) * 4;
            const prevIdx = (y * width + (x - 1)) * 4;
            const nextIdx = (y * width + (x + 1)) * 4;
            
            // Calculate color differences
            const diffPrev = Math.sqrt(
                Math.pow(data[currentIdx] - data[prevIdx], 2) +
                Math.pow(data[currentIdx + 1] - data[prevIdx + 1], 2) +
                Math.pow(data[currentIdx + 2] - data[prevIdx + 2], 2)
            );
            
            const diffNext = Math.sqrt(
                Math.pow(data[currentIdx] - data[nextIdx], 2) +
                Math.pow(data[currentIdx + 1] - data[nextIdx + 1], 2) +
                Math.pow(data[currentIdx + 2] - data[nextIdx + 2], 2)
            );
            
            // If either difference exceeds threshold, mark as edge
            if (diffPrev > edgeThreshold || diffNext > edgeThreshold) {
                edges.push({
                    x: x,
                    intensity: Math.max(diffPrev, diffNext)
                });
            }
        }
        
        return edges;
    }

    // Post-processing method to clean up color streaks using edge data
    cleanupStreaksWithEdgeData(cssText, dramaticColorChanges, width, height) {
        // Group dramatic color changes by their intensity and spatial proximity
        const significantEdges = dramaticColorChanges.filter(change => change.intensity > 120);
        
        if (significantEdges.length === 0) return cssText;
        
        // Find areas where multiple significant edges cluster together - these are likely important boundaries
        const edgeClusters = this.findEdgeClusters(significantEdges, width, height);
        
        // For each cluster, inject additional color stops to create sharper transitions
        let modifiedCSS = cssText;
        
        for (const cluster of edgeClusters) {
            modifiedCSS = this.injectSharpTransitionAtCluster(modifiedCSS, cluster, width, height);
        }
        
        return modifiedCSS;
    }

    // Find spatial clusters of dramatic color changes
    findEdgeClusters(edges, width, height) {
        const clusters = [];
        const processed = new Set();
        
        for (let i = 0; i < edges.length; i++) {
            if (processed.has(i)) continue;
            
            const cluster = [edges[i]];
            processed.add(i);
            
            // Find nearby edges (within 5% of image dimensions)
            const proximityX = Math.max(3, width * 0.05);
            const proximityY = Math.max(3, height * 0.05);
            
            for (let j = i + 1; j < edges.length; j++) {
                if (processed.has(j)) continue;
                
                const xDist = Math.abs(edges[i].x - edges[j].x);
                const yDist = Math.abs(edges[i].y - edges[j].y);
                
                if (xDist <= proximityX && yDist <= proximityY) {
                    cluster.push(edges[j]);
                    processed.add(j);
                }
            }
            
            // Only consider clusters with multiple edges or very high intensity single edges
            if (cluster.length > 1 || cluster[0].intensity > 150) {
                clusters.push({
                    edges: cluster,
                    centerX: cluster.reduce((sum, e) => sum + e.x, 0) / cluster.length,
                    centerY: cluster.reduce((sum, e) => sum + e.y, 0) / cluster.length,
                    avgIntensity: cluster.reduce((sum, e) => sum + e.intensity, 0) / cluster.length,
                    dominantColor: this.findDominantColorInCluster(cluster)
                });
            }
        }
        
        return clusters;
    }

    // Find the most common color in a cluster
    findDominantColorInCluster(edges) {
        if (edges.length === 1) return edges[0].color;
        
        // Simple dominant color by most common RGB values
        const colors = edges.map(e => e.color);
        const colorCounts = new Map();
        
        for (const color of colors) {
            const key = `${color.r},${color.g},${color.b}`;
            colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
        }
        
        let maxCount = 0;
        let dominantColor = colors[0];
        
        for (const [colorKey, count] of colorCounts) {
            if (count > maxCount) {
                maxCount = count;
                const [r, g, b] = colorKey.split(',').map(Number);
                dominantColor = { r, g, b };
            }
        }
        
        return dominantColor;
    }

    // Inject sharp color transitions at edge clusters
    injectSharpTransitionAtCluster(cssText, cluster, width, height) {
        // This is a simplified approach - in practice, you'd parse the CSS more carefully
        // For now, we'll add inline style corrections at the end
        
        const corrections = cluster.edges.map(edge => {
            const xPercent = (edge.x / width * 100).toFixed(2);
            const yPercent = (edge.y / height * 100).toFixed(2);
            const color = edge.color;
            
            // Create a small correction element that forces the right color at this position
            return `
            .gradient-correction-${edge.x}-${edge.y} {
                position: absolute;
                left: ${xPercent}%;
                top: ${yPercent}%;
                width: 2px;
                height: 2px;
                background: rgb(${color.r}, ${color.g}, ${color.b});
                pointer-events: none;
                z-index: 1;
            }`;
        }).join('');
        
        // Append correction styles
        return cssText + corrections;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = img2css;
}

// Also make available globally
if (typeof window !== 'undefined') {
    window.img2css = img2css;
}