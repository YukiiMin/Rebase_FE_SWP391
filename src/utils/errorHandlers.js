/**
 * errorHandlers.js
 * Utility file containing error handling functions to prevent common issues
 */

/**
 * Setup safety measures to prevent JSON parsing errors and window.onload conflicts
 */
export const setupErrorHandlers = () => {
  try {
    // 1. Override JSON.parse with a safer version
    const originalJSONParse = JSON.parse;
    window.JSON.parse = function(text) {
      try {
        if (!text || typeof text !== 'string') return {};
        return originalJSONParse(text);
      } catch (e) {
        console.warn(`JSON parse error: ${e.message}`);
        return {};
      }
    };

    // 2. Override window.onload to prevent extension conflicts
    Object.defineProperty(window, 'onload', {
      get: function() { return null; },
      set: function(newValue) { 
        console.warn("Attempt to set window.onload intercepted");
        // Instead of using window.onload, dispatch a custom event that can be listened to
        document.addEventListener('DOMContentLoaded', function() {
          try {
            if (typeof newValue === 'function') {
              // Execute the function safely
              setTimeout(() => {
                try {
                  newValue();
                } catch (e) {
                  console.warn("Error executing onload function:", e);
                }
              }, 0);
            }
          } catch (e) {
            console.warn("Error handling onload:", e);
          }
        });
        return true; 
      },
      configurable: false
    });

    // 3. Global error handler for uncaught exceptions
    window.addEventListener('error', (event) => {
      console.warn('Global error caught:', event.error);
      // Prevent default only for JSON parsing errors
      if (event.error && event.error.toString().includes('JSON')) {
        event.preventDefault();
        return true;
      }
    });

    // 4. Handle promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      // Prevent default for certain types of errors
      if (event.reason && event.reason.toString().includes('JSON')) {
        event.preventDefault();
        return true;
      }
    });

    console.log("Error handlers initialized successfully");
  } catch (e) {
    console.warn("Failed to initialize error handlers:", e);
  }
};

// Other utility functions can be added here

// Automatically run the setup when imported
setupErrorHandlers(); 