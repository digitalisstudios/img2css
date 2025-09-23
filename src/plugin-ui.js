(function (global) {
  function createEl(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k){
      if (k === 'text') el.textContent = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else el.setAttribute(k, attrs[k]);
    });
    return el;
  }

  function PluginUI(opts) {
    this.mount = opts.mount;
    this.plugins = opts.plugins || [];
    this.hooks = opts.hooks || {};
    this.onChange = typeof opts.onChange === 'function' ? opts.onChange : function(){};
    this.state = {};
    this.render();
  }

  PluginUI.prototype.render = function() {
    var container = this.mount;
    container.innerHTML = '';
    var self = this;

    this.plugins.forEach(function(p){
      var ui = p.ui; if (!ui || !ui.controls) return;
      var wrap = createEl('div', { class: 'option-group' });
      var title = createEl('label', { text: ui.name || ui.id });
      wrap.appendChild(title);

      self.state[ui.id] = self.state[ui.id] || {};

      ui.controls.forEach(function(ctrl){
        var row;
        if (ctrl.type === 'switch') {
          row = createEl('div', { class: 'switch-container', style: 'margin:6px 0;' });
          var span = createEl('span', { class: 'switch-label', text: ctrl.label || ctrl.key });
          var label = createEl('label', { class: 'switch' });
          var input = createEl('input'); input.type = 'checkbox'; input.id = ui.id + '_' + ctrl.key;
          if (ctrl.default === true) input.checked = true;
          self.state[ui.id][ctrl.key] = ctrl.default === true; // Initialize state with default value
          var slider = createEl('span', { class: 'slider' });
          label.appendChild(input); label.appendChild(slider);
          row.appendChild(span); row.appendChild(label);
          input.addEventListener('change', function(){ self.state[ui.id][ctrl.key] = input.checked; self.onChange(ui.id, Object.assign({}, self.state[ui.id])); });
        } else if (ctrl.type === 'slider') {
          row = createEl('div');
          var lab = createEl('label', { for: ui.id + '_' + ctrl.key, text: (ctrl.label || ctrl.key) + ': ' });
          var valueSpan = createEl('span', { id: ui.id + '_' + ctrl.key + '_value', text: String(ctrl.default) });
          lab.appendChild(valueSpan);
          row.appendChild(lab);
          var input = createEl('input');
          input.type = 'range'; input.id = ui.id + '_' + ctrl.key;
          if (ctrl.min != null) input.min = ctrl.min;
          if (ctrl.max != null) input.max = ctrl.max;
          if (ctrl.step != null) input.step = ctrl.step;
          if (ctrl.default != null) input.value = ctrl.default;
          self.state[ui.id][ctrl.key] = ctrl.default;
          input.addEventListener('input', function(){
            valueSpan.textContent = input.value;
            self.state[ui.id][ctrl.key] = input.value;
            self.onChange(ui.id, Object.assign({}, self.state[ui.id]));
          });
          row.appendChild(input);
        } else if (ctrl.type === 'select') {
          row = createEl('div');
          var lab = createEl('label', { for: ui.id + '_' + ctrl.key, text: (ctrl.label || ctrl.key) });
          row.appendChild(lab);
          var sel = createEl('select', { id: ui.id + '_' + ctrl.key });
          (ctrl.options || []).forEach(function(opt){
            var o = createEl('option'); o.value = opt.value; o.textContent = opt.label;
            if (ctrl.default != null && String(ctrl.default) === String(opt.value)) o.selected = true;
            sel.appendChild(o);
          });
          self.state[ui.id][ctrl.key] = ctrl.default;
          sel.addEventListener('change', function(){ self.state[ui.id][ctrl.key] = sel.value; self.onChange(ui.id, Object.assign({}, self.state[ui.id])); });
          row.appendChild(sel);
        } else if (ctrl.type === 'color') {
          row = createEl('div');
          var lab = createEl('label', { for: ui.id + '_' + ctrl.key, text: (ctrl.label || ctrl.key) });
          row.appendChild(lab);
          var input = createEl('input'); input.type = 'color'; input.id = ui.id + '_' + ctrl.key; input.value = ctrl.default || '#ffffff';
          self.state[ui.id][ctrl.key] = input.value;
          input.addEventListener('input', function(){ self.state[ui.id][ctrl.key] = input.value; self.onChange(ui.id, Object.assign({}, self.state[ui.id])); });
          row.appendChild(input);
        }
        if (ctrl.help) {
          var help = createEl('div', { class: 'help-text', text: ctrl.help });
          row.appendChild(help);
        }
        wrap.appendChild(row);
      });

      // Add custom content if provided
      if (ui.customContent && typeof ui.customContent === 'function') {
        var customEl = ui.customContent(self.state[ui.id] || {});
        if (customEl) {
          customEl.className = 'plugin-custom-content';
          customEl.setAttribute('data-plugin-id', ui.id);
          wrap.appendChild(customEl);
        }
      }

      container.appendChild(wrap);
    });
  };

  PluginUI.prototype.build = function() {
    var instances = [];
    var self = this;
    this.plugins.forEach(function(p){
      var ui = p.ui; if (!ui || typeof ui.build !== 'function') return;
      var values = self.state[ui.id] || {};
      var userLocal = (self.hooks && self.hooks[ui.id]) || {};
      // Pass plugin-local hooks via ctx.hooks so ui.build can forward as options.on
      var inst = ui.build(values, { factory: p.factory, hooks: userLocal });
      if (!inst) return;
      // Plugin-local hooks are passed via ctx.hooks to ui.build, not merged into inst.hooks
      // Only merge core processing hooks that affect the main img2css pipeline
      var coreHooks = {};
      Object.keys(userLocal).forEach(function(k){ if (!/^on[A-Z]/.test(k)) coreHooks[k] = userLocal[k]; });
      if (inst.hooks && Object.keys(coreHooks).length) {
        inst = { hooks: Object.assign({}, inst.hooks) };
        Object.keys(coreHooks).forEach(function(k){ inst.hooks[k] = coreHooks[k]; });
      }
      instances.push(inst);
    });
    return instances;
  };

  PluginUI.prototype.getValues = function() {
    // Return a shallow copy of current state
    var out = {};
    for (var k in this.state) if (Object.prototype.hasOwnProperty.call(this.state, k)) {
      out[k] = Object.assign({}, this.state[k]);
    }
    return out;
  };

  PluginUI.prototype.updateControlValue = function(pluginId, controlKey, value) {
    // Update both the state and the UI control element
    if (!this.state[pluginId]) return;
    
    this.state[pluginId][controlKey] = value;
    var elementId = pluginId + '_' + controlKey;
    var element = document.getElementById(elementId);
    
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = !!value;
      } else if (element.type === 'range') {
        element.value = value;
        // Also update the value display span
        var valueSpan = document.getElementById(elementId + '_value');
        if (valueSpan) valueSpan.textContent = String(value);
      } else if (element.tagName === 'SELECT') {
        element.value = value;
      } else if (element.type === 'color') {
        element.value = value;
      } else {
        element.value = value;
      }
    }
    
    // Update custom content if plugin has it (but respect noAutoRerender flag)
    var plugin = this.plugins.find(function(p) { return p.ui && p.ui.id === pluginId; });
    if (!plugin || !plugin.ui.noAutoRerender) {
      this.updateCustomContent(pluginId);
    }
  };

  PluginUI.prototype.updateCustomContent = function(pluginId, force) {
    var plugin = this.plugins.find(function(p) { return p.ui && p.ui.id === pluginId; });
    if (!plugin || !plugin.ui.customContent) return;
    
    // Don't auto-rerender if plugin has noAutoRerender flag, unless forced
    if (!force && plugin.ui.noAutoRerender) return;
    
    var existingCustom = this.mount.querySelector('[data-plugin-id="' + pluginId + '"]');
    if (existingCustom && existingCustom.parentNode) {
      var newCustomEl = plugin.ui.customContent(this.state[pluginId] || {});
      if (newCustomEl) {
        newCustomEl.className = 'plugin-custom-content';
        newCustomEl.setAttribute('data-plugin-id', pluginId);
        existingCustom.parentNode.replaceChild(newCustomEl, existingCustom);
      }
    }
  };

  PluginUI.prototype.forceUpdateCustomContent = function(pluginId) {
    this.updateCustomContent(pluginId, true);
  };

  global.PluginUI = PluginUI;
})(typeof window !== 'undefined' ? window : this);
