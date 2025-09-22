(function (global) {
  function MapExtractor(options) {
    options = options || {};

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

    var resolved = emit('resolveOptions', { options: Object.assign({}, options) });
    if (resolved && resolved.options) options = resolved.options;

    var cfg = {
      type: options.type || 'specular',
      strength: (options.strength == null ? 1.0 : options.strength),
      threshold: (options.threshold == null ? 0.2 : options.threshold),
      whitenessBlend: (options.whitenessBlend == null ? 0.5 : options.whitenessBlend),
      gamma: (options.gamma == null ? 1.0 : options.gamma),
      computeAt: options.computeAt || 'original',
      dataUrl: (options.dataUrl == null ? true : options.dataUrl),
      selector: options.selector || '.specular-gradient',
      emitCSS: options.emitCSS === true,
      edgeBoost: (options.edgeBoost == null ? 0.8 : options.edgeBoost), // reflection enhancer 0..3
      // Multi-map support
      types: Array.isArray(options.types) ? options.types.slice() : (options.type ? [options.type] : ['specular']),
      selectors: options.selectors || {
        specular: '.specular-gradient-preview',
        reflection: '.reflection-gradient-preview',
        albedo: '.albedo-gradient-preview',
        normal: '.normal-gradient-preview',
        roughness: '.roughness-gradient-preview',
        subjectnormal: '.subjectnormal-gradient-preview',
        irradiance: '.irradiance-gradient-preview',
        depth: '.depth-gradient-preview',
        object: '.object-mask-preview'
      },
      // Extra parameters
      normalStrength: (options.normalStrength == null ? 1.0 : options.normalStrength),
      roughnessWindow: (options.roughnessWindow == null ? 3 : options.roughnessWindow),
      irradianceRadius: (options.irradianceRadius == null ? 8 : options.irradianceRadius),
      albedoDeshade: (options.albedoDeshade == null ? 0.7 : options.albedoDeshade),
      // Depth parameters
      depthRadius: (options.depthRadius == null ? 3 : options.depthRadius),
      depthStrength: (options.depthStrength == null ? 1.0 : options.depthStrength),
      depthGamma: (options.depthGamma == null ? 1.2 : options.depthGamma),
      depthInvert: (options.depthInvert == null ? false : options.depthInvert),
      depthLuminanceWeight: (options.depthLuminanceWeight == null ? 0.3 : options.depthLuminanceWeight),
      depthContrastWeight: (options.depthContrastWeight == null ? 0.4 : options.depthContrastWeight),
      depthEdgeWeight: (options.depthEdgeWeight == null ? 0.2 : options.depthEdgeWeight),
      depthSaturationWeight: (options.depthSaturationWeight == null ? 0.1 : options.depthSaturationWeight),
      // Object isolation parameters
      objectRadius: (options.objectRadius == null ? 2 : options.objectRadius),
      objectThreshold: (options.objectThreshold == null ? 0.6 : options.objectThreshold),
      objectDepthPercentile: (options.objectDepthPercentile == null ? 0.7 : options.objectDepthPercentile),
      objectRoughnessThreshold: (options.objectRoughnessThreshold == null ? 0.05 : options.objectRoughnessThreshold),
      objectSmoothness: (options.objectSmoothness == null ? 0.08 : options.objectSmoothness),
      objectColorThreshold: (options.objectColorThreshold == null ? 0.1 : options.objectColorThreshold),
      objectDepthWeight: (options.objectDepthWeight == null ? 0.5 : options.objectDepthWeight),
      objectRoughnessWeight: (options.objectRoughnessWeight == null ? 0.2 : options.objectRoughnessWeight),
      objectSmoothnessWeight: (options.objectSmoothnessWeight == null ? 0.2 : options.objectSmoothnessWeight),
      objectColorWeight: (options.objectColorWeight == null ? 0.1 : options.objectColorWeight)
    };

    // Quality presets affect blur radii and iteration counts
    cfg.quality = options.quality || 'balanced'; // 'fast' | 'balanced' | 'high'
    function qualityRadius(base) {
      if (cfg.quality === 'fast') return Math.max(1, Math.round(base * 0.5));
      if (cfg.quality === 'high') return Math.max(1, Math.round(base * 1.5));
      return base;
    }

    // --- Small Gaussian helpers (separable) ---
    function gaussianKernel(radius) {
      var sigma = Math.max(1, radius / 2);
      var size = radius * 2 + 1;
      var k = new Float32Array(size);
      var sum = 0;
      for (var i = -radius; i <= radius; i++) {
        var v = Math.exp(-(i*i)/(2*sigma*sigma));
        k[i+radius] = v; sum += v;
      }
      for (var j=0;j<size;j++) k[j]/=sum;
      return k;
    }
    function blurGray(width, height, src, radius) {
      var k = gaussianKernel(radius);
      var tmp = new Float32Array(width*height);
      var dst = new Float32Array(width*height);
      // horizontal
      for (var y=0;y<height;y++){
        for (var x=0;x<width;x++){
          var s=0; for (var i=-radius;i<=radius;i++){
            var xx = Math.min(width-1, Math.max(0, x+i));
            s += src[y*width+xx]*k[i+radius];
          }
          tmp[y*width+x]=s;
        }
      }
      // vertical
      for (var x=0;x<width;x++){
        for (var y=0;y<height;y++){
          var s=0; for (var i=-radius;i<=radius;i++){
            var yy = Math.min(height-1, Math.max(0, y+i));
            s += tmp[yy*width+x]*k[i+radius];
          }
          dst[y*width+x]=s;
        }
      }
      return dst;
    }
    function blurRGB(imageData, radius) {
      var width=imageData.width, height=imageData.height, data=imageData.data;
      var r=new Float32Array(width*height), g=new Float32Array(width*height), b=new Float32Array(width*height);
      for (var y=0;y<height;y++){
        for (var x=0;x<width;x++){
          var i=(y*width+x)*4; r[y*width+x]=data[i]/255; g[y*width+x]=data[i+1]/255; b[y*width+x]=data[i+2]/255;
        }
      }
      var br=blurGray(width,height,r,radius), bg=blurGray(width,height,g,radius), bb=blurGray(width,height,b,radius);
      var out=new Uint8ClampedArray(width*height*4);
      for (var y=0;y<height;y++){
        for (var x=0;x<width;x++){
          var i=(y*width+x)*4; out[i]=Math.round(br[y*width+x]*255); out[i+1]=Math.round(bg[y*width+x]*255); out[i+2]=Math.round(bb[y*width+x]*255); out[i+3]=255;
        }
      }
      return { width: width, height: height, data: out };
    }

    function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

    function extractSpecularity(imageData) {
      var width = imageData.width, height = imageData.height, data = imageData.data;
      var out = new Uint8ClampedArray(width * height * 4);
      for (var i = 0; i < data.length; i += 4) {
        var r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255, a = data[i + 3] / 255;
        var maxCh = Math.max(r, g, b), minCh = Math.min(r, g, b);
        var V = maxCh;
        var S = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;
        var whiteness = 1 - Math.sqrt(((1 - r) * (1 - r) + (1 - g) * (1 - g) + (1 - b) * (1 - b)) / 3);
        var specBase = (1 - S) * V;
        var spec = cfg.whitenessBlend * whiteness + (1 - cfg.whitenessBlend) * specBase;
        if (spec < cfg.threshold) spec = 0; else spec = (spec - cfg.threshold) / (1 - cfg.threshold);
        spec = clamp01(spec * cfg.strength);
        if (cfg.gamma && cfg.gamma !== 1.0) { spec = Math.pow(spec, cfg.gamma); }
        var gray = Math.round(spec * 255);
        out[i] = gray; out[i + 1] = gray; out[i + 2] = gray; out[i + 3] = Math.round(a * 255);
      }
      return { width: width, height: height, data: out };
    }

    function extractReflection(imageData) {
      var width = imageData.width, height = imageData.height, data = imageData.data;
      var out = new Uint8ClampedArray(width * height * 4);
      // Simple luminance + desaturation emphasis + edge boost
      function idx(x,y){ return (y*width + x)*4; }
      for (var y=0; y<height; y++) {
        for (var x=0; x<width; x++) {
          var i = idx(x,y);
          var r = data[i]/255, g=data[i+1]/255, b=data[i+2]/255, a=data[i+3]/255;
          var maxCh = Math.max(r,g,b), minCh = Math.min(r,g,b);
          var V = maxCh;
          var S = maxCh === 0 ? 0 : (maxCh - minCh)/maxCh;
          var Y = 0.2126*r + 0.7152*g + 0.0722*b; // luminance
          var whiteness = 1 - Math.sqrt(((1-r)*(1-r) + (1-g)*(1-g) + (1-b)*(1-b))/3);

          // Edge: compare to right and bottom neighbors
          var xr = Math.min(width-1, x+1); var yb = Math.min(height-1, y+1);
          var ir = idx(xr,y); var ib = idx(x,yb);
          var Yr = 0.2126*(data[ir]/255) + 0.7152*(data[ir+1]/255) + 0.0722*(data[ir+2]/255);
          var Yb = 0.2126*(data[ib]/255) + 0.7152*(data[ib+1]/255) + 0.0722*(data[ib+2]/255);
          var edge = Math.min(1, Math.abs(Y-Yr) + Math.abs(Y-Yb));

          // Reflection base: bright + slightly desaturated + white bias
          var base = (Y * (1 - S) * 0.7) + (whiteness * 0.3);
          var refl = base * (1 + cfg.edgeBoost * edge);
          // Threshold/strength/gamma
          if (refl < cfg.threshold) refl = 0; else refl = (refl - cfg.threshold) / (1 - cfg.threshold);
          refl = Math.max(0, Math.min(1, refl * cfg.strength));
          if (cfg.gamma && cfg.gamma !== 1.0) refl = Math.pow(refl, cfg.gamma);

          var gray = Math.round(refl * 255);
          out[i] = gray; out[i+1] = gray; out[i+2] = gray; out[i+3] = Math.round(a*255);
        }
      }
      return { width: width, height: height, data: out };
    }

    // --- Additional maps ---
    function extractAlbedo(imageData) {
      // Multi-scale Retinex approximation in log domain
      var width=imageData.width, height=imageData.height, data=imageData.data;
      var out=new Uint8ClampedArray(width*height*4);
      var scalesBase=[3, qualityRadius(9), qualityRadius(21)]; if (cfg.quality==='fast') scalesBase=[3,9]; if (cfg.quality==='high') scalesBase=[3,15,31];
      function idx(x,y){ return (y*width+x)*4; }
      // log(I)
      var Ir=new Float32Array(width*height), Ig=new Float32Array(width*height), Ib=new Float32Array(width*height);
      for (var y=0;y<height;y++) for (var x=0;x<width;x++){
        var i=idx(x,y); Ir[y*width+x]=Math.log(1e-3+data[i]/255); Ig[y*width+x]=Math.log(1e-3+data[i+1]/255); Ib[y*width+x]=Math.log(1e-3+data[i+2]/255);
      }
      var R=new Float32Array(width*height), G=new Float32Array(width*height), B=new Float32Array(width*height);
      for (var s=0;s<scalesBase.length;s++){
        var r=Math.max(1, Math.floor(scalesBase[s]));
        var Br=blurGray(width,height,Ir,r), Bg=blurGray(width,height,Ig,r), Bb=blurGray(width,height,Ib,r);
        for (var j=0;j<width*height;j++){ R[j]+=Ir[j]-Br[j]; G[j]+=Ig[j]-Bg[j]; B[j]+=Ib[j]-Bb[j]; }
      }
      var inv=1/scalesBase.length;
      for (var y=0;y<height;y++) for (var x=0;x<width;x++){
        var j=y*width+x; var rr=Math.exp(R[j]*inv)*cfg.albedoDeshade; var gg=Math.exp(G[j]*inv)*cfg.albedoDeshade; var bb=Math.exp(B[j]*inv)*cfg.albedoDeshade;
        var i=idx(x,y); out[i]=Math.round(Math.max(0,Math.min(1,rr))*255); out[i+1]=Math.round(Math.max(0,Math.min(1,gg))*255); out[i+2]=Math.round(Math.max(0,Math.min(1,bb))*255); out[i+3]=255;
      }
      return { width: width, height: height, data: out };
    }

    function extractNormal(imageData) {
      var width=imageData.width, height=imageData.height, data=imageData.data;
      var out=new Uint8ClampedArray(width*height*4);
      function idx(x,y){return (y*width+x)*4;}
      function lumAt(x,y){var i=idx(x,y); return 0.2126*(data[i]/255)+0.7152*(data[i+1]/255)+0.0722*(data[i+2]/255);}
      // Pre-smooth based on quality
      var rad = qualityRadius(2);
      var L=new Float32Array(width*height);
      for (var y=0;y<height;y++) for (var x=0;x<width;x++) L[y*width+x]=lumAt(x,y);
      if (rad>1) L=blurGray(width,height,L,rad);
      var s=Math.max(0.001,cfg.normalStrength);
      var sobelX=[[ -1,0,1],[-2,0,2],[-1,0,1]]; var sobelY=[[ -1,-2,-1],[0,0,0],[1,2,1]];
      for (var y=0;y<height;y++){
        for (var x=0;x<width;x++){
          var gx=0, gy=0;
          for (var ky=-1;ky<=1;ky++){
            var yy=Math.min(height-1,Math.max(0,y+ky));
            for (var kx=-1;kx<=1;kx++){
              var xx=Math.min(width-1,Math.max(0,x+kx));
              var v=L[yy*width+xx]; gx+=v*sobelX[ky+1][kx+1]; gy+=v*sobelY[ky+1][kx+1];
            }
          }
          var nx=-gx*s, ny=-gy*s, nz=1.0; var len=Math.sqrt(nx*nx+ny*ny+nz*nz); nx/=len; ny/=len; nz/=len;
          var i=idx(x,y); out[i]=Math.round((nx*0.5+0.5)*255); out[i+1]=Math.round((ny*0.5+0.5)*255); out[i+2]=Math.round((nz*0.5+0.5)*255); out[i+3]=255;
        }
      }
      return { width: width, height: height, data: out };
    }

    function extractSubjectNormal(imageData) {
      var width=imageData.width, height=imageData.height, data=imageData.data;
      var out=new Uint8ClampedArray(width*height*4);
      function idx(x,y){return (y*width+x)*4;}
      function lumAt(x,y){var i=idx(x,y); return 0.2126*(data[i]/255)+0.7152*(data[i+1]/255)+0.0722*(data[i+2]/255);}
      // Pre-smooth based on quality
      var rad = qualityRadius(2);
      var L=new Float32Array(width*height);
      for (var y=0;y<height;y++) for (var x=0;x<width;x++) L[y*width+x]=lumAt(x,y);
      if (rad>1) L=blurGray(width,height,L,rad);
      var s=Math.max(0.001,cfg.normalStrength);
      var sobelX=[[ -1,0,1],[-2,0,2],[-1,0,1]]; var sobelY=[[ -1,-2,-1],[0,0,0],[1,2,1]];
      for (var y=0;y<height;y++){
        for (var x=0;x<width;x++){
          var gx=0, gy=0;
          for (var ky=-1;ky<=1;ky++){
            var yy=Math.min(height-1,Math.max(0,y+ky));
            for (var kx=-1;kx<=1;kx++){
              var xx=Math.min(width-1,Math.max(0,x+kx));
              var v=L[yy*width+xx]; gx+=v*sobelX[ky+1][kx+1]; gy+=v*sobelY[ky+1][kx+1];
            }
          }
          var nx=-gx*s, ny=-gy*s, nz=1.0; var len=Math.sqrt(nx*nx+ny*ny+nz*nz); nx/=len; ny/=len; nz/=len;
          var i=idx(x,y); out[i]=Math.round((nx*0.5+0.5)*255); out[i+1]=Math.round((ny*0.5+0.5)*255); out[i+2]=Math.round((nz*0.5+0.5)*255); out[i+3]=255;
        }
      }
      return { width: width, height: height, data: out };
    }

    function extractRoughness(imageData) {
      var width=imageData.width, height=imageData.height, data=imageData.data;
      var out=new Uint8ClampedArray(width*height*4);
      var win=Math.max(1, Math.floor(cfg.roughnessWindow));
      function idx(x,y){ return (y*width+x)*4; }
      function lumAt(x,y){ var i=idx(x,y); return 0.2126*(data[i]/255)+0.7152*(data[i+1]/255)+0.0722*(data[i+2]/255); }
      // compute gradient magnitude map
      var G=new Float32Array(width*height);
      for (var y=0;y<height;y++){
        for (var x=0;x<width;x++){
          var xm=Math.max(0,x-1), xp=Math.min(width-1,x+1);
          var ym=Math.max(0,y-1), yp=Math.min(height-1,y+1);
          var dx=lumAt(xp,y)-lumAt(xm,y); var dy=lumAt(x,yp)-lumAt(x,ym);
          G[y*width+x]=Math.sqrt(dx*dx+dy*dy);
        }
      }
      for (var y=0; y<height; y++){
        for (var x=0; x<width; x++){
          var s=0, ss=0, c=0;
          for (var dy=-win; dy<=win; dy++){
            var yy=Math.min(height-1, Math.max(0,y+dy));
            for (var dx=-win; dx<=win; dx++){
              var xx=Math.min(width-1, Math.max(0,x+dx));
              var v=G[yy*width+xx]; s+=v; ss+=v*v; c++;
            }
          }
          var mean=s/c; var varc=Math.max(0, ss/c - mean*mean);
          var rough=Math.min(1, Math.sqrt(varc)*2);
          var g=Math.round(rough*255); var i=idx(x,y); out[i]=g; out[i+1]=g; out[i+2]=g; out[i+3]=255;
        }
      }
      return { width: width, height: height, data: out };
    }

    function extractIrradiance(imageData) {
      var width=imageData.width, height=imageData.height, data=imageData.data;
      var radius=qualityRadius(Math.max(3, Math.floor(cfg.irradianceRadius)));
      return blurRGB(imageData, radius);
    }

    function extractDepth(imageData, objectMask) {
      // Enhanced depth estimation using object mask guidance
      var width = imageData.width, height = imageData.height, data = imageData.data;
      var out = new Uint8ClampedArray(width * height * 4);
      var depthRadius = Math.max(1, Math.floor(cfg.depthRadius || 3));
      
      function idx(x, y) { return (y * width + x) * 4; }
      
      // Convert to luminance and calculate local contrast
      var luminance = new Float32Array(width * height);
      for (var i = 0; i < data.length; i += 4) {
        var r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
        luminance[Math.floor(i / 4)] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
      
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var i = idx(x, y);
          var centerLum = luminance[y * width + x];
          
          // Use object mask as primary depth cue if available
          var objectDepth = 0;
          if (objectMask && objectMask.data) {
            objectDepth = objectMask.data[i] / 255; // Object = closer (1), background = farther (0)
          }
          
          // Calculate local contrast and edge strength for depth cues
          var contrast = 0;
          var edgeStrength = 0;
          var sampleCount = 0;
          
          for (var dy = -depthRadius; dy <= depthRadius; dy++) {
            for (var dx = -depthRadius; dx <= depthRadius; dx++) {
              var nx = Math.max(0, Math.min(width - 1, x + dx));
              var ny = Math.max(0, Math.min(height - 1, y + dy));
              var neighborLum = luminance[ny * width + nx];
              
              if (dx !== 0 || dy !== 0) {
                contrast += Math.abs(centerLum - neighborLum);
                edgeStrength += Math.abs(centerLum - neighborLum) * (1 / Math.sqrt(dx*dx + dy*dy));
                sampleCount++;
              }
            }
          }
          
          contrast /= sampleCount;
          edgeStrength /= sampleCount;
          
          var depth;
          if (objectMask && objectMask.data) {
            // Object mask guided depth estimation
            // Objects get base depth + visual cue modulation
            if (objectDepth > 0.5) {
              // Object pixels: start with foreground depth and add local detail
              var localDetail = Math.pow(contrast, 0.3) * 0.2 + Math.pow(edgeStrength, 0.5) * 0.1;
              depth = 0.7 + localDetail; // Objects are closer (0.7-1.0 range)
            } else {
              // Background pixels: use traditional visual cues with lower base
              var luminanceDepth = centerLum * 0.2;
              var contrastDepth = Math.pow(contrast, 0.8) * 0.2;
              var edgeDepth = Math.pow(edgeStrength, 0.9) * 0.1;
              depth = Math.min(0.6, luminanceDepth + contrastDepth + edgeDepth); // Background is farther (0.0-0.6 range)
            }
          } else {
            // Fallback to original visual cue method if no object mask
            var luminanceDepth = centerLum * (cfg.depthLuminanceWeight || 0.3);
            var contrastDepth = Math.pow(contrast, 0.5) * (cfg.depthContrastWeight || 0.4);
            var edgeDepth = Math.pow(edgeStrength, 0.7) * (cfg.depthEdgeWeight || 0.2);
            
            // Saturation: More saturated colors often appear closer
            var r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
            var maxCh = Math.max(r, g, b), minCh = Math.min(r, g, b);
            var saturation = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;
            var saturationDepth = saturation * (cfg.depthSaturationWeight || 0.1);
            
            depth = luminanceDepth + contrastDepth + edgeDepth + saturationDepth;
          }
          
          // Apply depth curve and normalization
          depth = Math.pow(depth, cfg.depthGamma || 1.2); // Enhance depth perception
          depth = Math.max(0, Math.min(1, depth * (cfg.depthStrength || 1.0)));
          
          // Invert if needed (closer = brighter vs closer = darker)
          if (cfg.depthInvert) depth = 1 - depth;
          
          var gray = Math.round(depth * 255);
          out[i] = gray; out[i + 1] = gray; out[i + 2] = gray; out[i + 3] = data[i + 3];
        }
      }
      
      return { width: width, height: height, data: out };
    }

    function extractObjectMask(imageData) {
      // Simple and efficient object isolation using scanline flood fill
      var width = imageData.width, height = imageData.height, data = imageData.data;
      var out = new Uint8ClampedArray(width * height * 4);
      
      // Extract roughness map for edge detection
      var roughnessMap = extractRoughness(imageData);
      
      function idx(x, y) { return (y * width + x) * 4; }
      
      // Convert roughness to Uint32Array for faster processing
      var roughnessU32 = new Uint32Array(roughnessMap.data.buffer);
      var outU32 = new Uint32Array(out.buffer);
      
      // Simple edge detection - find strong transitions in roughness
      var edgeThreshold = 40; // Adjust based on cfg.objectThreshold
      var isEdge = new Uint8Array(width * height);
      
      for (var y = 1; y < height - 1; y++) {
        for (var x = 1; x < width - 1; x++) {
          var i = y * width + x;
          var center = roughnessMap.data[i * 4];
          
          // Check 4-connected neighbors for strong transitions
          var maxDiff = 0;
          var neighbors = [
            roughnessMap.data[((y-1) * width + x) * 4], // top
            roughnessMap.data[((y+1) * width + x) * 4], // bottom
            roughnessMap.data[(y * width + (x-1)) * 4], // left
            roughnessMap.data[(y * width + (x+1)) * 4]  // right
          ];
          
          for (var n = 0; n < neighbors.length; n++) {
            var diff = Math.abs(center - neighbors[n]);
            if (diff > maxDiff) maxDiff = diff;
          }
          
          isEdge[i] = maxDiff > edgeThreshold ? 1 : 0;
        }
      }
      
      // Find largest connected region using scanline flood fill
      var visited = new Uint8Array(width * height);
      var largestRegion = [];
      var largestSize = 0;
      
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var i = y * width + x;
          if (!visited[i] && !isEdge[i]) {
            // Start flood fill from this non-edge pixel
            var region = [];
            var stack = [{x: x, y: y}];
            
            while (stack.length > 0) {
              var point = stack.pop();
              var px = point.x, py = point.y;
              var pi = py * width + px;
              
              if (px < 0 || px >= width || py < 0 || py >= height || 
                  visited[pi] || isEdge[pi]) continue;
              
              visited[pi] = 1;
              region.push(pi);
              
              // Add 4-connected neighbors to stack
              stack.push({x: px + 1, y: py});
              stack.push({x: px - 1, y: py});
              stack.push({x: px, y: py + 1});
              stack.push({x: px, y: py - 1});
            }
            
            // Keep track of largest region (likely the object)
            if (region.length > largestSize) {
              largestSize = region.length;
              largestRegion = region;
            }
          }
        }
      }
      
      // Create object mask - largest region is the object
      var objectMask = new Uint8Array(width * height);
      for (var i = 0; i < largestRegion.length; i++) {
        objectMask[largestRegion[i]] = 1;
      }
      
      // Optional: Clean up small holes in the object using simple dilation
      var cleaned = new Uint8Array(width * height);
      var cleanRadius = 1;
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var i = y * width + x;
          var hasObject = false;
          
          // Check if any nearby pixel is object
          for (var dy = -cleanRadius; dy <= cleanRadius && !hasObject; dy++) {
            for (var dx = -cleanRadius; dx <= cleanRadius && !hasObject; dx++) {
              var nx = Math.max(0, Math.min(width - 1, x + dx));
              var ny = Math.max(0, Math.min(height - 1, y + dy));
              if (objectMask[ny * width + nx] === 1) {
                hasObject = true;
              }
            }
          }
          
          cleaned[i] = hasObject ? 1 : 0;
        }
      }
      
      // Convert to RGBA output format efficiently using Uint32Array
      var white = 0xFFFFFFFF; // White (object)
      var black = 0xFF000000; // Black (background)
      
      for (var i = 0; i < width * height; i++) {
        outU32[i] = cleaned[i] === 1 ? white : black;
      }
      
      return { width: width, height: height, data: out };
    }

    function toDataURL(map) {
      try {
        if (typeof document === 'undefined') return null;
        var canvas = document.createElement('canvas');
        canvas.width = map.width; canvas.height = map.height;
        var ctx = canvas.getContext('2d');
        var imgData = new ImageData(map.data, map.width, map.height);
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL('image/png');
      } catch (_) { return null; }
    }

    function emitMap(type, map, stage) {
      var payload = { type: type, map: map, stage: stage, dataURL: cfg.dataUrl ? toDataURL(map) : null };
      
      // For roughness maps only, convert the analyzed map to CSS using img2css
      // Normal maps use the CSS generated from gradient stops in buildLayer hook
      if (type === 'roughness' && payload.dataURL) {
        convertMapToCSS(payload.dataURL, type);
      }
      
      emit('onMap', payload);
      return payload;
    }
    
    function convertMapToCSS(dataURL, type) {
      // Use a completely new instance of img2css to convert the exact analyzed map image to CSS
      if (typeof window !== 'undefined' && window.img2css) {
        try {
          // Create a fresh img2css instance
          var mapConverter = new window.img2css({
            source: dataURL,
            processing: {
              details: 50, // Good detail level for maps
              compression: 20, // Lower compression to preserve map details
              mode: 'auto' // Let it choose the best direction
            },
            minified: false // Readable CSS
          });
          
          // Convert the base64 image using img2css processing pipeline
          mapConverter.toCSS().then(function(css) {
            if (css) {
              // Replace the default selector with our map-specific selector
              var selector = (cfg.selectors && cfg.selectors[type]) || ('.' + type + '-gradient-preview');
              var finalCSS = css.replace(/\.slick-img-gradient/g, selector);
              emit('onMapCSS', { type: type, css: finalCSS });
            }
          }).catch(function(err) {
            console.warn('Failed to convert ' + type + ' map to CSS:', err);
          });
        } catch (e) {
          console.warn('Error converting ' + type + ' map to CSS:', e);
        }
      }
    }

    function maybeCompute(imageData, stage) {
      var out = [];
      var objectMask = null;
      
      // First pass: compute object mask if needed (it will guide depth generation)
      var needsObjectMask = (cfg.types || []).indexOf('object') !== -1;
      var needsDepthWithObject = (cfg.types || []).indexOf('depth') !== -1;
      
      if (needsObjectMask || needsDepthWithObject) {
        objectMask = extractObjectMask(imageData);
        if (needsObjectMask) {
          out.push(emitMap('object', objectMask, stage));
        }
      }
      
      // Second pass: compute other maps, using object mask for depth if available
      (cfg.types || ['specular']).forEach(function(t){
        if (t === 'specular') out.push(emitMap('specular', extractSpecularity(imageData), stage));
        else if (t === 'reflection') out.push(emitMap('reflection', extractReflection(imageData), stage));
        else if (t === 'albedo') out.push(emitMap('albedo', extractAlbedo(imageData), stage));
        else if (t === 'normal') out.push(emitMap('normal', extractNormal(imageData), stage));
        else if (t === 'roughness') out.push(emitMap('roughness', extractRoughness(imageData), stage));
        else if (t === 'subjectnormal') out.push(emitMap('subjectnormal', extractSubjectNormal(imageData), stage));
        else if (t === 'irradiance') out.push(emitMap('irradiance', extractIrradiance(imageData), stage));
        else if (t === 'depth') out.push(emitMap('depth', extractDepth(imageData, objectMask), stage));
        // object is handled in first pass above
      });
      return out;
    }

    // Secondary CSS via core per-line stops (no re-analysis)
    var lineLayersByType = { specular: [], reflection: [], albedo: [], normal: [], roughness: [], subjectnormal: [], irradiance: [], depth: [], object: [] };
    var lastDimensions = null;
    function colorToSpecGray(c) {
      var r = c.r / 255, g = c.g / 255, b = c.b / 255;
      var maxCh = Math.max(r, g, b), minCh = Math.min(r, g, b);
      var V = maxCh;
      var S = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;
      var whiteness = 1 - Math.sqrt(((1 - r)*(1 - r) + (1 - g)*(1 - g) + (1 - b)*(1 - b)) / 3);
      var spec = cfg.whitenessBlend * whiteness + (1 - cfg.whitenessBlend) * ((1 - S) * V);
      if (spec < cfg.threshold) spec = 0; else spec = (spec - cfg.threshold) / (1 - cfg.threshold);
      spec = Math.max(0, Math.min(1, spec * cfg.strength));
      if (cfg.gamma && cfg.gamma !== 1.0) spec = Math.pow(spec, cfg.gamma);
      var gray = Math.round(spec * 255);
      return { r: gray, g: gray, b: gray, a: 255 };
    }
    function colorToReflectionGray(c) {
      var r = c.r / 255, g = c.g / 255, b = c.b / 255;
      var maxCh = Math.max(r, g, b), minCh = Math.min(r, g, b);
      var S = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;
      var Y = 0.2126*r + 0.7152*g + 0.0722*b;
      var whiteness = 1 - Math.sqrt(((1 - r)*(1 - r) + (1 - g)*(1 - g) + (1 - b)*(1 - b)) / 3);
      var base = (Y * (1 - S) * 0.7) + (whiteness * 0.3);
      var refl = base; // no edge term available from stops
      if (refl < cfg.threshold) refl = 0; else refl = (refl - cfg.threshold) / (1 - cfg.threshold);
      refl = Math.max(0, Math.min(1, refl * cfg.strength));
      if (cfg.gamma && cfg.gamma !== 1.0) refl = Math.pow(refl, cfg.gamma);
      var gray = Math.round(refl * 255);
      return { r: gray, g: gray, b: gray, a: 255 };
    }
    
    function colorToNormalMap(c) {
      // Convert original color to normal map representation
      // Normal maps show surface details as XY gradients encoded in RG channels
      var r = c.r / 255, g = c.g / 255, b = c.b / 255;
      var Y = 0.2126*r + 0.7152*g + 0.0722*b; // luminance
      
      // Simulate normal mapping by using luminance gradients
      // Higher contrast areas become more pronounced normals
      var normalX = (r - Y) * cfg.normalStrength + 0.5; // X component in red channel
      var normalY = (g - Y) * cfg.normalStrength + 0.5; // Y component in green channel
      var normalZ = 0.5 + 0.5; // Z component in blue channel (pointing up)
      
      normalX = Math.max(0, Math.min(1, normalX));
      normalY = Math.max(0, Math.min(1, normalY));
      normalZ = Math.max(0, Math.min(1, normalZ));
      
      return { 
        r: Math.round(normalX * 255), 
        g: Math.round(normalY * 255), 
        b: Math.round(normalZ * 255), 
        a: 255 
      };
    }
    
    function colorToSubjectNormalMap(c) {
      // Convert original color to subject normal map representation (identical to normal map)
      // Normal maps show surface details as XY gradients encoded in RG channels
      var r = c.r / 255, g = c.g / 255, b = c.b / 255;
      var Y = 0.2126*r + 0.7152*g + 0.0722*b; // luminance
      
      // Simulate normal mapping by using luminance gradients
      // Higher contrast areas become more pronounced normals
      var normalX = (r - Y) * cfg.normalStrength + 0.5; // X component in red channel
      var normalY = (g - Y) * cfg.normalStrength + 0.5; // Y component in green channel
      var normalZ = 0.5 + 0.5; // Z component in blue channel (pointing up)
      
      normalX = Math.max(0, Math.min(1, normalX));
      normalY = Math.max(0, Math.min(1, normalY));
      normalZ = Math.max(0, Math.min(1, normalZ));
      
      return { 
        r: Math.round(normalX * 255), 
        g: Math.round(normalY * 255), 
        b: Math.round(normalZ * 255), 
        a: 255 
      };
    }
    
    function colorToRoughnessMap(c) {
      // Convert original color to roughness map
      // Roughness represents surface micro-detail variance
      var r = c.r / 255, g = c.g / 255, b = c.b / 255;
      var maxCh = Math.max(r, g, b), minCh = Math.min(r, g, b);
      var variance = maxCh - minCh; // Color variance as roughness indicator
      var Y = 0.2126*r + 0.7152*g + 0.0722*b; // luminance
      
      // Combine variance and luminance to estimate surface roughness
      var roughness = (variance * 0.7) + ((1 - Y) * 0.3); // High variance + darker = rougher
      roughness = Math.max(0, Math.min(1, roughness));
      
      var gray = Math.round(roughness * 255);
      return { r: gray, g: gray, b: gray, a: 255 };
    }
    function buildStopsToSpec(stops) {
      return (stops || []).map(function(s) {
        var g = colorToSpecGray(s);
        var hex = '#' + g.r.toString(16).padStart(2,'0') + g.g.toString(16).padStart(2,'0') + g.b.toString(16).padStart(2,'0');
        return hex + ' ' + s.position.toFixed(2) + '%';
      });
    }

    return {
      hooks: {
        buildLayer: function (ctx) {
          if (!ctx || !ctx.stops) return;
          var dir = ctx.axis === 'column' ? 'to bottom' : 'to right';
          (cfg.types || ['specular']).forEach(function(t){
            var cssStops;
            if (t === 'specular') {
              cssStops = buildStopsToSpec(ctx.stops);
            } else if (t === 'reflection') {
              cssStops = (ctx.stops || []).map(function(s){
                var g = colorToReflectionGray(s);
                var hex = '#' + g.r.toString(16).padStart(2,'0') + g.g.toString(16).padStart(2,'0') + g.b.toString(16).padStart(2,'0');
                return hex + ' ' + s.position.toFixed(2) + '%';
              });
            } else if (t === 'normal') {
              cssStops = (ctx.stops || []).map(function(s){
                var g = colorToNormalMap(s);
                var hex = '#' + g.r.toString(16).padStart(2,'0') + g.g.toString(16).padStart(2,'0') + g.b.toString(16).padStart(2,'0');
                return hex + ' ' + s.position.toFixed(2) + '%';
              });
            } else if (t === 'subjectnormal') {
              cssStops = (ctx.stops || []).map(function(s){
                var g = colorToSubjectNormalMap(s);
                var hex = '#' + g.r.toString(16).padStart(2,'0') + g.g.toString(16).padStart(2,'0') + g.b.toString(16).padStart(2,'0');
                return hex + ' ' + s.position.toFixed(2) + '%';
              });
            } else if (t === 'roughness') {
              cssStops = (ctx.stops || []).map(function(s){
                var g = colorToRoughnessMap(s);
                var hex = '#' + g.r.toString(16).padStart(2,'0') + g.g.toString(16).padStart(2,'0') + g.b.toString(16).padStart(2,'0');
                return hex + ' ' + s.position.toFixed(2) + '%';
              });
            } else {
              // Default fallback
              cssStops = (ctx.stops || []).map(function(s){
                var hex = '#' + s.r.toString(16).padStart(2,'0') + s.g.toString(16).padStart(2,'0') + s.b.toString(16).padStart(2,'0');
                return hex + ' ' + s.position.toFixed(2) + '%';
              });
            }
            var grad = 'linear-gradient(' + dir + ', ' + cssStops.join(', ') + ')';
            (lineLayersByType[t] || (lineLayersByType[t] = [])).push({ axis: ctx.axis, positionPercent: ctx.positionPercent, sizePercent: ctx.sizePercent, gradient: grad });
          });
        },
        beforeBuildCSS: function (ctx) { lastDimensions = ctx.dimensions; },
        afterBuildCSS: function (ctx) {
          if (!lastDimensions) return;
          var width = lastDimensions.width, height = lastDimensions.height;
          var sep = ctx.minified ? ',' : ',\n    ';
          (cfg.types || ['specular']).forEach(function(t){
            var layers = lineLayersByType[t] || [];
            if (!layers.length) return;
            var decls = layers.map(function(l){
              return l.axis === 'column'
                ? (l.gradient + ' ' + l.positionPercent + '% top / ' + l.sizePercent + '% 100% no-repeat')
                : (l.gradient + ' left ' + l.positionPercent + '% / 100% ' + l.sizePercent + '% no-repeat');
            }).join(sep);
            var sel = (cfg.selectors && cfg.selectors[t]) || cfg.selector;
            var out = ctx.minified
              ? (sel + '{width:100%;height:auto;aspect-ratio:' + width + '/' + height + ';background:' + decls + '}')
              : (sel + ' {\n    width: 100%;\n    height: auto;\n    aspect-ratio: ' + width + ' / ' + height + ';\n    background: ' + decls + ';\n}');
            emit('onMapCSS', { type: t, css: out, dimensions: lastDimensions });
            lineLayersByType[t] = [];
          });
        },
        afterLoad: function (ctx) {
          cfg._lastImageData = ctx.imageData;
          if (cfg.computeAt === 'original') { maybeCompute(ctx.imageData, 'afterLoad'); }
          return { imageData: ctx.imageData };
        },
        afterScale: function (ctx) {
          cfg._lastImageData = ctx.imageData;
          if (cfg.computeAt === 'scaled') { maybeCompute(ctx.imageData, 'afterScale'); }
          return { imageData: ctx.imageData };
        },
        afterProcess: function (ctx) {
          if (!ctx || !ctx.stats) return;
          ctx.stats.plugins = ctx.stats.plugins || {};
          ctx.stats.plugins.mapExtractor = ctx.stats.plugins.mapExtractor || {};
          ctx.stats.plugins.mapExtractor.last = ctx.stats.plugins.mapExtractor.last || {};
          ctx.stats.plugins.mapExtractor.last.type = cfg.type;
          ctx.stats.plugins.mapExtractor.last.computeAt = cfg.computeAt;
          if (cfg._lastImageData) { maybeCompute(cfg._lastImageData, 'afterProcess'); }
        }
      }
    };
  }

  global.MapExtractor = MapExtractor;

  // Standard UI metadata for core UI renderer
  global.MapExtractor.ui = {
    id: 'mapExtractor',
    name: 'MapExtractor (PBR Maps)',
    controls: [
      { type: 'switch', key: 'normalOn', label: 'Normal', default: true },
      { type: 'switch', key: 'roughnessOn', label: 'Roughness', default: true },
      { type: 'switch', key: 'subjectnormalOn', label: 'Subject Normal', default: true },
      { type: 'switch', key: 'enabled', label: 'Enable', default: true },
      { type: 'select', key: 'computeAt', label: 'Compute At', default: 'scaled', options: [
        { label: 'Scaled', value: 'scaled' },
        { label: 'Original', value: 'original' }
      ]},
      { type: 'select', key: 'quality', label: 'Quality', default: 'balanced', options: [
        { label: 'Fast', value: 'fast' },
        { label: 'Balanced', value: 'balanced' },
        { label: 'High', value: 'high' }
      ]},
      { type: 'slider', key: 'normalStrength', label: 'Normal Strength', min: 0.1, max: 5, step: 0.1, default: 1.0 },
      { type: 'slider', key: 'roughnessWindow', label: 'Roughness Window', min: 1, max: 9, step: 1, default: 3 }
    ],
    build(values, ctx) {
      if (!values.enabled) return null;
      var types = [];
      // Only include maps that are explicitly enabled and visible
      if (values.normalOn) types.push('normal');
      if (values.roughnessOn) types.push('roughness');
      if (values.subjectnormalOn) types.push('subjectnormal');
      // Albedo, depth, object isolation, specular, reflection, and irradiance are disabled and hidden
      // if (!types.length) types = ['normal']; // Fallback to normal map if nothing selected
      return MapExtractor({
        types: types,
        emitCSS: true,
        computeAt: values.computeAt || 'scaled',
        quality: values.quality || 'balanced',
        // Use default values for hidden specular/reflection controls
        threshold: 0.2,
        whitenessBlend: 0.5,
        strength: 1.0,
        gamma: 1.0,
        edgeBoost: 0.8,
        normalStrength: parseFloat(values.normalStrength),
        roughnessWindow: parseInt(values.roughnessWindow, 10),
        // Default values for hidden controls
        irradianceRadius: 8,
        albedoDeshade: 0.7,
        depthRadius: 3,
        depthStrength: 1.0,
        depthGamma: 1.2,
        depthInvert: false,
        objectRadius: 2,
        objectThreshold: 0.6,
        objectDepthPercentile: 0.7,
        selectors: { specular: '.specular-gradient-preview', reflection: '.reflection-gradient-preview', albedo: '.albedo-gradient-preview', normal: '.normal-gradient-preview', roughness: '.roughness-gradient-preview', subjectnormal: '.subjectnormal-gradient-preview', irradiance: '.irradiance-gradient-preview', depth: '.depth-gradient-preview', object: '.object-mask-preview' },
        on: (ctx && ctx.hooks) ? ctx.hooks : undefined
      });
    }
  };
})(typeof window !== 'undefined' ? window : this);
