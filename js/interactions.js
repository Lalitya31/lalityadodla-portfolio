/**
 * Balanced Engineering Portfolio - Interactive Features
 * 
 * Features:
 * 1. Layer Focus Mode
 * 2. Cursor-aware Hover Descriptions
 * 3. Scroll-based Section Highlighting
 * 4. System Status Indicator
 * 5. Keyboard Navigation
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  
  const CONFIG = {
    hoverDelay: 300,
    hoverOffset: { x: 15, y: 15 },
    statusRotationInterval: 4000,
    fadeTransition: 300
  };

  const LAYER_DESCRIPTIONS = {
    'layer-1': 'Engineering Projects - The core of practical engineering',
    'layer-2': 'Research & Publications - Pushing boundaries through investigation',
    'layer-3': 'Leadership & Project Management - Orchestrating teams and initiatives',
    'layer-4': 'Academics - The theoretical foundation of computer science',
    'layer-5': 'Achievements - Recognition and milestones earned through dedication',
    'layer-6': 'Balance & Discipline - The foundation of sustainable excellence'
  };

  const STATUS_MESSAGES = [
    'System operational',
    'All layers synchronized',
    'Engineering excellence active',
    'Balanced state maintained',
    'Innovation in progress',
    'Knowledge systems online'
  ];

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const state = {
    activeLayer: null,
    focusedLayerIndex: -1,
    hoverTimeout: null,
    statusInterval: null,
    currentStatusIndex: 0,
    observers: []
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  function getAllLayers() {
    return Array.from(document.querySelectorAll('.layer'));
  }

  function getLayerId(layer) {
    return layer.classList[1]; // e.g., 'layer-1', 'layer-2', etc.
  }

  function getInfoPanel(layerId) {
    const layerNum = layerId.split('-')[1];
    return document.querySelector(`.panel-${layerNum}`);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // ============================================================================
  // FEATURE 1: LAYER FOCUS MODE
  // ============================================================================
  
  function activateLayer(layer) {
    if (state.activeLayer === layer) return;
    
    deactivateAllLayers();
    
    state.activeLayer = layer;
    const layerId = getLayerId(layer);
    const panel = getInfoPanel(layerId);
    
    // Add active class to the clicked layer
    layer.classList.add('active');
    
    // Dim all other layers
    getAllLayers().forEach(l => {
      if (l !== layer) {
        l.classList.add('dimmed');
      }
    });
    
    // Show corresponding info panel
    if (panel) {
      panel.classList.add('visible');
    }
    
    // Update focused index for keyboard navigation
    const layers = getAllLayers();
    state.focusedLayerIndex = layers.indexOf(layer);
  }

  function deactivateAllLayers() {
    state.activeLayer = null;
    
    getAllLayers().forEach(layer => {
      layer.classList.remove('active', 'dimmed', 'keyboard-focused');
    });
    
    document.querySelectorAll('.info-panel').forEach(panel => {
      panel.classList.remove('visible');
    });
  }

  function setupLayerFocusMode() {
    const layers = getAllLayers();
    
    layers.forEach(layer => {
      layer.addEventListener('click', (e) => {
        e.preventDefault();
        activateLayer(layer);
      });
    });
    
    // Click outside to deactivate
    document.addEventListener('click', (e) => {
      const clickedLayer = e.target.closest('.layer');
      const clickedPanel = e.target.closest('.info-panel');
      
      if (!clickedLayer && !clickedPanel && state.activeLayer) {
        deactivateAllLayers();
      }
    });
    
    // Close panel buttons
    document.querySelectorAll('.close-panel').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deactivateAllLayers();
      });
    });
  }

  // ============================================================================
  // FEATURE 2: CURSOR-AWARE HOVER DESCRIPTIONS
  // ============================================================================
  
  function createHoverBox() {
    const box = document.createElement('div');
    box.className = 'hover-description-box';
    box.style.cssText = `
      position: fixed;
      background: rgba(30, 58, 138, 0.95);
      color: #E5E7EB;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid rgba(147, 197, 253, 0.6);
      font-size: 0.875rem;
      pointer-events: none;
      opacity: 0;
      z-index: 10000;
      max-width: 280px;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
      transition: opacity ${CONFIG.fadeTransition}ms ease;
      white-space: normal;
      line-height: 1.4;
    `;
    document.body.appendChild(box);
    return box;
  }

  function positionHoverBox(box, e) {
    const boxRect = box.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = e.clientX + CONFIG.hoverOffset.x;
    let y = e.clientY + CONFIG.hoverOffset.y;
    
    // Keep box within viewport horizontally
    if (x + boxRect.width > viewportWidth) {
      x = e.clientX - boxRect.width - CONFIG.hoverOffset.x;
    }
    
    // Keep box within viewport vertically
    if (y + boxRect.height > viewportHeight) {
      y = e.clientY - boxRect.height - CONFIG.hoverOffset.y;
    }
    
    x = clamp(x, 0, viewportWidth - boxRect.width);
    y = clamp(y, 0, viewportHeight - boxRect.height);
    
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
  }

  function setupHoverDescriptions() {
    const hoverBox = createHoverBox();
    const layers = getAllLayers();
    
    layers.forEach(layer => {
      const layerId = getLayerId(layer);
      const description = LAYER_DESCRIPTIONS[layerId];
      
      if (!description) return;
      
      layer.addEventListener('mouseenter', (e) => {
        // Don't show hover box if layer is active
        if (layer.classList.contains('active')) return;
        
        clearTimeout(state.hoverTimeout);
        
        state.hoverTimeout = setTimeout(() => {
          hoverBox.textContent = description;
          positionHoverBox(hoverBox, e);
          
          // Trigger reflow for transition
          hoverBox.offsetHeight;
          hoverBox.style.opacity = '1';
        }, CONFIG.hoverDelay);
      });
      
      layer.addEventListener('mousemove', (e) => {
        if (hoverBox.style.opacity === '1') {
          positionHoverBox(hoverBox, e);
        }
      });
      
      layer.addEventListener('mouseleave', () => {
        clearTimeout(state.hoverTimeout);
        hoverBox.style.opacity = '0';
      });
    });
  }

  // ============================================================================
  // FEATURE 3: SCROLL-BASED SECTION HIGHLIGHTING
  // ============================================================================
  
  function setupScrollHighlighting() {
    const sections = [
      { selector: '#projects-section', layerId: 'layer-1', navHref: 'projects.html' },
      { selector: '#research-section', layerId: 'layer-2', navHref: 'research.html' },
      { selector: '#leadership-section', layerId: 'layer-3', navHref: 'leadership.html' },
      { selector: '#academics-section', layerId: 'layer-4', navHref: 'academics.html' },
      { selector: '#achievements-section', layerId: 'layer-5', navHref: 'achievements.html' },
      { selector: '#balance-section', layerId: 'layer-6', navHref: 'balance.html' }
    ];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1.0]
    };
    
    sections.forEach(({ selector, layerId, navHref }) => {
      const section = document.querySelector(selector);
      if (!section) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            highlightLayerAndNav(layerId, navHref);
          }
        });
      }, observerOptions);
      
      observer.observe(section);
      state.observers.push(observer);
    });
  }

  function highlightLayerAndNav(layerId, navHref) {
    // Don't override active layer
    if (state.activeLayer) return;
    
    // Highlight layer
    getAllLayers().forEach(layer => {
      layer.classList.remove('scroll-highlighted');
    });
    
    const targetLayer = document.querySelector(`.${layerId}`);
    if (targetLayer) {
      targetLayer.classList.add('scroll-highlighted');
    }
    
    // Highlight nav item
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(navHref)) {
        link.classList.add('active');
      }
    });
  }

  // ============================================================================
  // FEATURE 4: SYSTEM STATUS INDICATOR
  // ============================================================================
  
  function createStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'system-status-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: rgba(11, 13, 16, 0.9);
      border: 1px solid rgba(147, 197, 253, 0.3);
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #60A5FA;
      z-index: 900;
      font-family: 'Courier New', monospace;
      opacity: 0;
      transition: opacity ${CONFIG.fadeTransition}ms ease;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;
    
    const dot = document.createElement('span');
    dot.style.cssText = `
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #60A5FA;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    `;
    
    const text = document.createElement('span');
    text.className = 'status-text';
    
    indicator.appendChild(dot);
    indicator.appendChild(text);
    document.body.appendChild(indicator);
    
    return indicator;
  }

  function rotateStatusMessage(indicator) {
    const textEl = indicator.querySelector('.status-text');
    
    function updateMessage() {
      // Fade out
      textEl.style.opacity = '0';
      
      setTimeout(() => {
        // Update text
        state.currentStatusIndex = (state.currentStatusIndex + 1) % STATUS_MESSAGES.length;
        textEl.textContent = STATUS_MESSAGES[state.currentStatusIndex];
        
        // Fade in
        textEl.style.opacity = '1';
      }, CONFIG.fadeTransition);
    }
    
    // Initial message
    textEl.style.transition = `opacity ${CONFIG.fadeTransition}ms ease`;
    textEl.textContent = STATUS_MESSAGES[0];
    textEl.style.opacity = '1';
    
    // Show indicator
    setTimeout(() => {
      indicator.style.opacity = '1';
    }, 100);
    
    // Start rotation
    state.statusInterval = setInterval(updateMessage, CONFIG.statusRotationInterval);
  }

  function setupStatusIndicator() {
    const indicator = createStatusIndicator();
    rotateStatusMessage(indicator);
  }

  // ============================================================================
  // FEATURE 5: KEYBOARD NAVIGATION
  // ============================================================================
  
  function setupKeyboardNavigation() {
    const layers = getAllLayers();
    
    document.addEventListener('keydown', (e) => {
      // Left Arrow - Previous layer
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (state.focusedLayerIndex <= 0) {
          state.focusedLayerIndex = layers.length - 1;
        } else {
          state.focusedLayerIndex--;
        }
        focusLayer(layers[state.focusedLayerIndex]);
      }
      
      // Right Arrow - Next layer
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (state.focusedLayerIndex >= layers.length - 1) {
          state.focusedLayerIndex = 0;
        } else {
          state.focusedLayerIndex++;
        }
        focusLayer(layers[state.focusedLayerIndex]);
      }
      
      // Enter - Activate focused layer
      else if (e.key === 'Enter') {
        if (state.focusedLayerIndex >= 0 && state.focusedLayerIndex < layers.length) {
          e.preventDefault();
          const layer = layers[state.focusedLayerIndex];
          activateLayer(layer);
        }
      }
      
      // Escape - Exit active layer
      else if (e.key === 'Escape') {
        if (state.activeLayer) {
          e.preventDefault();
          deactivateAllLayers();
          state.focusedLayerIndex = -1;
        }
      }
    });
  }

  function focusLayer(layer) {
    // Remove keyboard focus from all layers
    getAllLayers().forEach(l => {
      l.classList.remove('keyboard-focused');
    });
    
    // Add keyboard focus to target layer
    layer.classList.add('keyboard-focused');
    
    // Scroll into view if needed
    layer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    try {
      setupLayerFocusMode();
      setupHoverDescriptions();
      setupScrollHighlighting();
      setupStatusIndicator();
      setupKeyboardNavigation();
      
      console.log('✅ All interactive features initialized');
    } catch (error) {
      console.error('❌ Error initializing interactive features:', error);
    }
  }

  // Add necessary CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
  `;
  document.head.appendChild(style);

  // Start initialization
  init();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (state.statusInterval) {
      clearInterval(state.statusInterval);
    }
    if (state.hoverTimeout) {
      clearTimeout(state.hoverTimeout);
    }
    state.observers.forEach(observer => observer.disconnect());
  });

})();
