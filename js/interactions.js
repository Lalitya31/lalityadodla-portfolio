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
  
  /**
   * Configuration object containing all timing and positioning constants
   * @type {Object}
   */
  const CONFIG = {
    /** @property {number} hoverDelay - Delay in milliseconds before showing hover description box */
    hoverDelay: 300,
    
    /** @property {Object} hoverOffset - X and Y offset for positioning hover box relative to cursor */
    hoverOffset: { 
      x: 15,  // Horizontal offset in pixels from cursor position
      y: 15   // Vertical offset in pixels from cursor position
    },
    
    /** @property {number} statusRotationInterval - Time in milliseconds between status message rotations */
    statusRotationInterval: 4000,
    
    /** @property {number} fadeTransition - Duration in milliseconds for fade in/out transitions */
    fadeTransition: 300
  };

  /**
   * Object mapping layer IDs to their descriptive text shown on hover
   * @type {Object.<string, string>}
   */
  const LAYER_DESCRIPTIONS = {
    /** @property {string} layer-1 - Description for the Engineering Projects (core) layer */
    'layer-1': 'Engineering Projects - The core of practical engineering',
    
    /** @property {string} layer-2 - Description for the Research & Publications layer */
    'layer-2': 'Research & Publications - Pushing boundaries through investigation',
    
    /** @property {string} layer-3 - Description for the Leadership & Project Management layer */
    'layer-3': 'Leadership & Project Management - Orchestrating teams and initiatives',
    
    /** @property {string} layer-4 - Description for the Academics layer */
    'layer-4': 'Academics - The theoretical foundation of computer science',
    
    /** @property {string} layer-5 - Description for the Achievements layer */
    'layer-5': 'Achievements - Recognition and milestones earned through dedication',
    
    /** @property {string} layer-6 - Description for the Balance & Discipline (outermost) layer */
    'layer-6': 'Balance & Discipline - The foundation of sustainable excellence'
  };

  /**
   * Array of rotating status messages displayed in the system status indicator
   * @type {string[]}
   */
  const STATUS_MESSAGES = [
    'System operational',           // Message 1: Basic operational status
    'All layers synchronized',      // Message 2: Layer coordination status
    'Engineering excellence active', // Message 3: Quality assurance status
    'Balanced state maintained',    // Message 4: Balance confirmation status
    'Innovation in progress',       // Message 5: Active development status
    'Knowledge systems online'      // Message 6: Learning systems status
  ];

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Global state object tracking the current state of all interactive features
   * @type {Object}
   */
  const state = {
    /** @property {HTMLElement|null} activeLayer - Currently active/focused layer element */
    activeLayer: null,
    
    /** @property {number} focusedLayerIndex - Index of currently keyboard-focused layer (-1 if none) */
    focusedLayerIndex: -1,
    
    /** @property {number|null} hoverTimeout - Timeout ID for delayed hover description display */
    hoverTimeout: null,
    
    /** @property {number|null} statusInterval - Interval ID for rotating status messages */
    statusInterval: null,
    
    /** @property {number} currentStatusIndex - Current index in STATUS_MESSAGES array */
    currentStatusIndex: 0,
    
    /** @property {IntersectionObserver[]} observers - Array of IntersectionObserver instances for cleanup */
    observers: []
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  /**
   * Retrieves all layer elements from the DOM
   * @returns {HTMLElement[]} Array of all layer elements
   */
  function getAllLayers() {
    return Array.from(document.querySelectorAll('.layer'));
  }

  /**
   * Extracts the layer ID from a layer element's class list
   * @param {HTMLElement} layer - The layer element
   * @returns {string} The layer ID (e.g., 'layer-1', 'layer-2', etc.)
   */
  function getLayerId(layer) {
    return layer.classList[1]; // Second class is always the layer ID
  }

  /**
   * Finds the info panel corresponding to a layer ID
   * @param {string} layerId - The layer ID (e.g., 'layer-1')
   * @returns {HTMLElement|null} The corresponding info panel element
   */
  function getInfoPanel(layerId) {
    const layerNum = layerId.split('-')[1];  // Extract number from 'layer-N'
    return document.querySelector(`.panel-${layerNum}`);
  }

  /**
   * Restricts a value to be within a specified range
   * @param {number} value - The value to clamp
   * @param {number} min - The minimum allowed value
   * @param {number} max - The maximum allowed value
   * @returns {number} The clamped value
   */
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // ============================================================================
  // FEATURE 1: LAYER FOCUS MODE
  // ============================================================================
  
  /**
   * Activates a specific layer, dimming all others and showing its info panel
   * @param {HTMLElement} layer - The layer element to activate
   */
  function activateLayer(layer) {
    if (state.activeLayer === layer) return;  // Already active, do nothing
    
    deactivateAllLayers();  // Clear any existing active state
    
    state.activeLayer = layer;           // Store reference to active layer
    const layerId = getLayerId(layer);   // Get the layer's ID
    const panel = getInfoPanel(layerId); // Get corresponding info panel
    
    // Add active class to the clicked layer
    layer.classList.add('active');  // Highlight the active layer
    
    // Dim all other layers
    getAllLayers().forEach(l => {
      if (l !== layer) {
        l.classList.add('dimmed');  // Apply dimming effect
      }
    });
    
    // Show corresponding info panel
    if (panel) {
      panel.classList.add('visible');  // Make panel visible
    }
    
    // Update focused index for keyboard navigation
    const layers = getAllLayers();
    state.focusedLayerIndex = layers.indexOf(layer);  // Store index for keyboard nav
  }

  /**
   * Deactivates all layers and hides all info panels
   */
  function deactivateAllLayers() {
    state.activeLayer = null;  // Clear active layer reference
    
    // Remove all active/dimmed states
    getAllLayers().forEach(layer => {
      layer.classList.remove('active', 'dimmed', 'keyboard-focused');  // Clear all interactive states
    });
    
    // Hide all info panels
    document.querySelectorAll('.info-panel').forEach(panel => {
      panel.classList.remove('visible');  // Hide all panels
    });
  }

  /**
   * Sets up layer focus mode event listeners
   */
  function setupLayerFocusMode() {
    const layers = getAllLayers();  // Get all layer elements
    
    // Add click handlers to each layer
    layers.forEach(layer => {
      layer.addEventListener('click', (e) => {
        e.preventDefault();      // Prevent default link behavior
        activateLayer(layer);    // Activate clicked layer
      });
    });
    
    // Click outside to deactivate
    document.addEventListener('click', (e) => {
      const clickedLayer = e.target.closest('.layer');     // Check if clicked on a layer
      const clickedPanel = e.target.closest('.info-panel'); // Check if clicked on a panel
      
      // If clicked outside both layer and panel, deactivate
      if (!clickedLayer && !clickedPanel && state.activeLayer) {
        deactivateAllLayers();  // Clear all active states
      }
    });
    
    // Close panel buttons
    document.querySelectorAll('.close-panel').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();       // Prevent default behavior
        e.stopPropagation();      // Stop event bubbling
        deactivateAllLayers();    // Deactivate everything
      });
    });
  }

  // ============================================================================
  // FEATURE 2: CURSOR-AWARE HOVER DESCRIPTIONS
  // ============================================================================
  
  /**
   * Creates and styles the hover description box element
   * @returns {HTMLElement} The created hover box element
   */
  function createHoverBox() {
    const box = document.createElement('div');  // Create the container element
    box.className = 'hover-description-box';    // Assign class name for reference
    
    // Apply inline styles for dynamic positioning
    box.style.cssText = `
      position: fixed;                                      /* Fixed positioning for cursor tracking */
      background: rgba(30, 58, 138, 0.95);                 /* Semi-transparent blue background */
      color: #E5E7EB;                                      /* Light gray text color */
      padding: 0.75rem 1rem;                               /* Internal spacing */
      border-radius: 8px;                                  /* Rounded corners */
      border: 1px solid rgba(147, 197, 253, 0.6);         /* Light blue border */
      font-size: 0.875rem;                                 /* Text size */
      pointer-events: none;                                /* Don't interfere with mouse events */
      opacity: 0;                                          /* Initially hidden */
      z-index: 10000;                                      /* Render above all other elements */
      max-width: 280px;                                    /* Maximum width constraint */
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);     /* Soft glow shadow */
      transition: opacity ${CONFIG.fadeTransition}ms ease; /* Smooth fade transition */
      white-space: normal;                                 /* Allow text wrapping */
      line-height: 1.4;                                    /* Line height for readability */
    `;
    document.body.appendChild(box);  // Add to DOM
    return box;
  }

  /**
   * Positions the hover box near the cursor while keeping it within viewport bounds
   * @param {HTMLElement} box - The hover box element to position
   * @param {MouseEvent} e - The mouse event containing cursor coordinates
   */
  function positionHoverBox(box, e) {
    const boxRect = box.getBoundingClientRect();  // Get current box dimensions
    const viewportWidth = window.innerWidth;       // Get viewport width
    const viewportHeight = window.innerHeight;     // Get viewport height
    
    // Calculate initial position with offset from cursor
    let x = e.clientX + CONFIG.hoverOffset.x;  // X position with horizontal offset
    let y = e.clientY + CONFIG.hoverOffset.y;  // Y position with vertical offset
    
    // Keep box within viewport horizontally
    if (x + boxRect.width > viewportWidth) {
      x = e.clientX - boxRect.width - CONFIG.hoverOffset.x;  // Position left of cursor if overflow right
    }
    
    // Keep box within viewport vertically
    if (y + boxRect.height > viewportHeight) {
      y = e.clientY - boxRect.height - CONFIG.hoverOffset.y;  // Position above cursor if overflow bottom
    }
    
    // Clamp position to viewport bounds
    x = clamp(x, 0, viewportWidth - boxRect.width);   // Ensure X is within horizontal bounds
    y = clamp(y, 0, viewportHeight - boxRect.height); // Ensure Y is within vertical bounds
    
    // Apply calculated position
    box.style.left = `${x}px`;  // Set horizontal position
    box.style.top = `${y}px`;   // Set vertical position
  }

  /**
   * Sets up hover event listeners on all layers to show descriptions
   */
  function setupHoverDescriptions() {
    const hoverBox = createHoverBox();  // Create the hover box element once
    const layers = getAllLayers();      // Get all layer elements
    
    layers.forEach(layer => {
      const layerId = getLayerId(layer);                 // Get this layer's ID
      const description = LAYER_DESCRIPTIONS[layerId];   // Get corresponding description text
      
      if (!description) return;  // Skip if no description defined
      
      // Show hover box on mouse enter
      layer.addEventListener('mouseenter', (e) => {
        // Don't show hover box if layer is active
        if (layer.classList.contains('active')) return;
        
        clearTimeout(state.hoverTimeout);  // Cancel any pending hover timeout
        
        // Set new timeout to show description after delay
        state.hoverTimeout = setTimeout(() => {
          hoverBox.textContent = description;     // Set description text
          positionHoverBox(hoverBox, e);         // Position near cursor
          
          // Trigger reflow for transition
          hoverBox.offsetHeight;  // Force reflow by accessing property
          hoverBox.style.opacity = '1';  // Fade in the box
        }, CONFIG.hoverDelay);
      });
      
      // Update position as mouse moves
      layer.addEventListener('mousemove', (e) => {
        if (hoverBox.style.opacity === '1') {  // Only if box is visible
          positionHoverBox(hoverBox, e);       // Update position
        }
      });
      
      // Hide hover box on mouse leave
      layer.addEventListener('mouseleave', () => {
        clearTimeout(state.hoverTimeout);   // Cancel pending timeout
        hoverBox.style.opacity = '0';       // Fade out the box
      });
    });
  }

  // ============================================================================
  // FEATURE 3: SCROLL-BASED SECTION HIGHLIGHTING
  // ============================================================================
  
  /**
   * Sets up IntersectionObservers to highlight layers based on scroll position
   */
  function setupScrollHighlighting() {
    /**
     * Configuration array mapping sections to their corresponding layers and navigation items
     * @type {Object[]}
     */
    const sections = [
      { 
        selector: '#projects-section',     // CSS selector for projects section
        layerId: 'layer-1',                // Corresponding layer ID
        navHref: 'projects.html'           // Navigation link for this section
      },
      { 
        selector: '#research-section',     // CSS selector for research section
        layerId: 'layer-2',                // Corresponding layer ID
        navHref: 'research.html'           // Navigation link for this section
      },
      { 
        selector: '#leadership-section',   // CSS selector for leadership section
        layerId: 'layer-3',                // Corresponding layer ID
        navHref: 'leadership.html'         // Navigation link for this section
      },
      { 
        selector: '#academics-section',    // CSS selector for academics section
        layerId: 'layer-4',                // Corresponding layer ID
        navHref: 'academics.html'          // Navigation link for this section
      },
      { 
        selector: '#achievements-section', // CSS selector for achievements section
        layerId: 'layer-5',                // Corresponding layer ID
        navHref: 'achievements.html'       // Navigation link for this section
      },
      { 
        selector: '#balance-section',      // CSS selector for balance section
        layerId: 'layer-6',                // Corresponding layer ID
        navHref: 'balance.html'            // Navigation link for this section
      }
    ];
    
    /**
     * IntersectionObserver options configuration
     * @type {Object}
     */
    const observerOptions = {
      root: null,                           // Use viewport as root
      rootMargin: '-20% 0px -20% 0px',     // Shrink viewport vertically by 20% top/bottom
      threshold: [0, 0.25, 0.5, 0.75, 1.0] // Trigger at these intersection ratios
    };
    
    sections.forEach(({ selector, layerId, navHref }) => {
      const section = document.querySelector(selector);  // Find section element
      if (!section) return;  // Skip if section doesn't exist
      
      /**
       * IntersectionObserver callback to handle visibility changes
       * @param {IntersectionObserverEntry[]} entries - Array of observed entries
       */
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Highlight when section is visible and at least 50% intersecting
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            highlightLayerAndNav(layerId, navHref);
          }
        });
      }, observerOptions);
      
      observer.observe(section);         // Start observing the section
      state.observers.push(observer);    // Store for cleanup later
    });
  }

  /**
   * Highlights a specific layer and its corresponding navigation item
   * @param {string} layerId - The ID of the layer to highlight
   * @param {string} navHref - The href of the navigation link to highlight
   */
  function highlightLayerAndNav(layerId, navHref) {
    // Don't override active layer
    if (state.activeLayer) return;
    
    // Remove highlight from all layers
    getAllLayers().forEach(layer => {
      layer.classList.remove('scroll-highlighted');  // Remove highlight class
    });
    
    // Highlight target layer
    const targetLayer = document.querySelector(`.${layerId}`);
    if (targetLayer) {
      targetLayer.classList.add('scroll-highlighted');  // Add highlight class
    }
    
    // Update navigation highlighting
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');  // Remove active class from all links
      if (link.getAttribute('href').includes(navHref)) {
        link.classList.add('active');   // Add active class to matching link
      }
    });
  }

  // ============================================================================
  // FEATURE 4: SYSTEM STATUS INDICATOR
  // ============================================================================
  
  /**
   * Creates and styles the system status indicator element
   * @returns {HTMLElement} The created status indicator element
   */
  function createStatusIndicator() {
    const indicator = document.createElement('div');  // Create container element
    indicator.className = 'system-status-indicator';  // Assign class name
    
    // Apply inline styles for positioning and appearance
    indicator.style.cssText = `
      position: fixed;                                    /* Fixed positioning at bottom-right */
      bottom: 2rem;                                       /* Distance from bottom edge */
      right: 2rem;                                        /* Distance from right edge */
      background: rgba(11, 13, 16, 0.9);                 /* Dark semi-transparent background */
      border: 1px solid rgba(147, 197, 253, 0.3);        /* Light blue border */
      padding: 0.75rem 1.25rem;                          /* Internal spacing */
      border-radius: 8px;                                 /* Rounded corners */
      font-size: 0.8rem;                                  /* Small text size */
      color: #60A5FA;                                     /* Light blue text color */
      z-index: 900;                                       /* Layer above most content */
      font-family: 'Courier New', monospace;              /* Monospace font for tech feel */
      opacity: 0;                                         /* Initially hidden */
      transition: opacity ${CONFIG.fadeTransition}ms ease; /* Smooth fade transition */
      backdrop-filter: blur(10px);                        /* Background blur effect */
      box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);    /* Subtle blue shadow */
      display: flex;                                      /* Flexbox for alignment */
      align-items: center;                                /* Vertically center content */
      gap: 0.5rem;                                        /* Space between dot and text */
    `;
    
    // Create pulsing status dot
    const dot = document.createElement('span');
    dot.style.cssText = `
      display: inline-block;                              /* Inline block for sizing */
      width: 6px;                                         /* Dot width */
      height: 6px;                                        /* Dot height */
      background: #60A5FA;                                /* Light blue color */
      border-radius: 50%;                                 /* Make it circular */
      animation: pulse 2s ease-in-out infinite;           /* Pulsing animation */
    `;
    
    // Create text container
    const text = document.createElement('span');
    text.className = 'status-text';  // Class for text element
    
    // Assemble the indicator
    indicator.appendChild(dot);   // Add pulsing dot
    indicator.appendChild(text);  // Add text element
    document.body.appendChild(indicator);  // Add to DOM
    
    return indicator;  // Return the created element
  }

  /**
   * Sets up the rotating status message functionality
   * @param {HTMLElement} indicator - The status indicator element
   */
  function rotateStatusMessage(indicator) {
    const textEl = indicator.querySelector('.status-text');  // Get text element
    
    /**
     * Updates the displayed status message with fade effect
     */
    function updateMessage() {
      // Fade out current message
      textEl.style.opacity = '0';
      
      setTimeout(() => {
        // Update to next message
        state.currentStatusIndex = (state.currentStatusIndex + 1) % STATUS_MESSAGES.length;  // Cycle through messages
        textEl.textContent = STATUS_MESSAGES[state.currentStatusIndex];  // Set new message text
        
        // Fade in new message
        textEl.style.opacity = '1';
      }, CONFIG.fadeTransition);  // Wait for fade out to complete
    }
    
    // Set initial message
    textEl.style.transition = `opacity ${CONFIG.fadeTransition}ms ease`;  // Enable fade transition
    textEl.textContent = STATUS_MESSAGES[0];  // Set first message
    textEl.style.opacity = '1';               // Make it visible
    
    // Show indicator with delay
    setTimeout(() => {
      indicator.style.opacity = '1';  // Fade in the indicator
    }, 100);
    
    // Start rotating messages
    state.statusInterval = setInterval(updateMessage, CONFIG.statusRotationInterval);  // Rotate at configured interval
  }

  /**
   * Initializes the system status indicator feature
   */
  function setupStatusIndicator() {
    const indicator = createStatusIndicator();  // Create the indicator element
    rotateStatusMessage(indicator);             // Start rotating messages
  }

  // ============================================================================
  // FEATURE 5: KEYBOARD NAVIGATION
  // ============================================================================
  
  /**
   * Sets up keyboard event listeners for layer navigation
   */
  function setupKeyboardNavigation() {
    const layers = getAllLayers();  // Get all layer elements for navigation
    
    /**
     * Handles keyboard events for navigation
     * @param {KeyboardEvent} e - The keyboard event
     */
    document.addEventListener('keydown', (e) => {
      // Left Arrow - Navigate to previous layer
      if (e.key === 'ArrowLeft') {
        e.preventDefault();  // Prevent default browser behavior
        if (state.focusedLayerIndex <= 0) {
          state.focusedLayerIndex = layers.length - 1;  // Wrap to last layer
        } else {
          state.focusedLayerIndex--;  // Move to previous layer
        }
        focusLayer(layers[state.focusedLayerIndex]);  // Apply focus
      }
      
      // Right Arrow - Navigate to next layer
      else if (e.key === 'ArrowRight') {
        e.preventDefault();  // Prevent default browser behavior
        if (state.focusedLayerIndex >= layers.length - 1) {
          state.focusedLayerIndex = 0;  // Wrap to first layer
        } else {
          state.focusedLayerIndex++;  // Move to next layer
        }
        focusLayer(layers[state.focusedLayerIndex]);  // Apply focus
      }
      
      // Enter - Activate currently focused layer
      else if (e.key === 'Enter') {
        if (state.focusedLayerIndex >= 0 && state.focusedLayerIndex < layers.length) {
          e.preventDefault();  // Prevent default behavior
          const layer = layers[state.focusedLayerIndex];  // Get focused layer
          activateLayer(layer);  // Activate it
        }
      }
      
      // Escape - Exit active layer and clear focus
      else if (e.key === 'Escape') {
        if (state.activeLayer) {
          e.preventDefault();  // Prevent default behavior
          deactivateAllLayers();  // Deactivate all layers
          state.focusedLayerIndex = -1;  // Clear focus index
        }
      }
    });
  }

  /**
   * Applies keyboard focus styling to a specific layer
   * @param {HTMLElement} layer - The layer element to focus
   */
  function focusLayer(layer) {
    // Remove keyboard focus from all layers
    getAllLayers().forEach(l => {
      l.classList.remove('keyboard-focused');  // Remove focus class
    });
    
    // Add keyboard focus to target layer
    layer.classList.add('keyboard-focused');  // Add focus class
    
    // Scroll into view if needed
    layer.scrollIntoView({ 
      behavior: 'smooth',  // Smooth scrolling animation
      block: 'nearest'     // Scroll only if not already in view
    });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  /**
   * Initializes all interactive features
   * Waits for DOM to be ready before initializing
   */
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);  // Wait for DOM ready
      return;
    }
    
    try {
      // Initialize all features
      setupLayerFocusMode();       // Setup layer clicking and focus
      setupHoverDescriptions();    // Setup hover tooltips
      setupScrollHighlighting();   // Setup scroll-based highlighting
      setupStatusIndicator();      // Setup status message display
      setupKeyboardNavigation();   // Setup keyboard controls
      
      console.log('✅ All interactive features initialized');
    } catch (error) {
      console.error('❌ Error initializing interactive features:', error);
    }
  }

  // Add necessary CSS animations
  const style = document.createElement('style');  // Create style element
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }      /* Start and end: full opacity, normal size */
      50% { opacity: 0.5; transform: scale(1.2); }       /* Midpoint: semi-transparent, slightly larger */
    }
  `;
  document.head.appendChild(style);  // Add styles to document

  // Start initialization
  init();

  /**
   * Cleanup function executed before page unload
   * Clears timers and disconnects observers
   */
  window.addEventListener('beforeunload', () => {
    if (state.statusInterval) {
      clearInterval(state.statusInterval);  // Stop status message rotation
    }
    if (state.hoverTimeout) {
      clearTimeout(state.hoverTimeout);     // Cancel pending hover timeout
    }
    state.observers.forEach(observer => observer.disconnect());  // Disconnect all observers
  });

})();
