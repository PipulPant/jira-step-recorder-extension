// Content script to capture user interactions
let isRecording = false;
let isPaused = false;
let stepCounter = 0;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Jira Recorder: Received message', request.action);
  
  if (request.action === 'startRecording') {
    console.log('Jira Recorder: Starting recording...');
    isRecording = true;
    isPaused = false;
    
    // CRITICAL: Get current step count from background to continue from existing steps
    // This ensures steps persist across page refreshes and redirects
    chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
      if (response && response.steps && response.steps.length > 0) {
        stepCounter = response.steps.length;
        console.log('Jira Recorder: Continuing from step', stepCounter, 'on page navigation');
      } else {
        // Only reset to 0 if this is truly a new recording
        stepCounter = 0;
        console.log('Jira Recorder: Starting fresh recording');
      }
      
      // Wait a bit for DOM to be ready
      setTimeout(() => {
        attachEventListeners();
        showRecordingIndicator();
        console.log('Jira Recorder: Recording started', { isRecording, isPaused, stepCounter });
      }, 100);
    });
    
    sendResponse({ success: true });
  } else if (request.action === 'stopRecording') {
    console.log('Jira Recorder: Stopping recording...');
    isRecording = false;
    isPaused = false;
    removeEventListeners();
    hideRecordingIndicator();
    
    // Show notification with Copy Steps and Preview Steps buttons
    showRecordingStoppedNotification();
    
    sendResponse({ success: true });
  } else if (request.action === 'pauseRecording') {
    isPaused = true;
    updateRecordingIndicator();
    sendResponse({ success: true });
  } else if (request.action === 'resumeRecording') {
    isPaused = false;
    updateRecordingIndicator();
    sendResponse({ success: true });
  }
  return true;
});

// Get element selector
function getElementSelector(element) {
  if (!element || !element.tagName) return '';
  
  // Try ID first
  if (element.id) {
    return `#${element.id}`;
  }
  
  // Try class
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(' ').filter(c => c).join('.');
    if (classes) {
      return `${element.tagName.toLowerCase()}.${classes}`;
    }
  }
  
  // Try data attributes
  if (element.getAttribute('data-testid')) {
    return `[data-testid="${element.getAttribute('data-testid')}"]`;
  }
  
  if (element.getAttribute('name')) {
    return `${element.tagName.toLowerCase()}[name="${element.getAttribute('name')}"]`;
  }
  
  // Fallback to tag name
  return element.tagName.toLowerCase();
}

// Get element description
function getElementDescription(element) {
  if (!element) return '';
  
  const tagName = element.tagName?.toLowerCase();
  
  // Try aria-label
  if (element.getAttribute('aria-label')) {
    return element.getAttribute('aria-label');
  }
  
  // Try title
  if (element.title) {
    return element.title;
  }
  
  // Try text content for buttons/links
  if (['button', 'a'].includes(tagName)) {
    const text = element.textContent?.trim();
    if (text && text.length < 100 && text.length > 0) {
      return text;
    }
  }
  
  // Try placeholder for inputs
  if (element.placeholder) {
    return element.placeholder;
  }
  
  // Try label
  if (element.labels && element.labels.length > 0) {
    const labelText = element.labels[0].textContent?.trim();
    if (labelText) {
      return labelText;
    }
  }
  
  // Try name attribute
  if (element.name) {
    return element.name;
  }
  
  // For divs and spans, try to find meaningful content
  if (tagName === 'div' || tagName === 'span') {
    // Try to find text content
    const text = element.textContent?.trim();
    if (text && text.length > 0 && text.length < 100) {
      return text;
    }
    
    // Try data attributes
    if (element.getAttribute('data-testid')) {
      return element.getAttribute('data-testid');
    }
    
    // Try role attribute
    if (element.getAttribute('role')) {
      return `${element.getAttribute('role')} (${tagName})`;
    }
    
    // Try to find nearby label or heading
    const label = element.closest('label');
    if (label) {
      const labelText = label.textContent?.trim();
      if (labelText && labelText.length < 100) {
        return labelText;
      }
    }
    
    // If no meaningful description found, return empty (will be filtered out)
    return '';
  }
  
  return tagName;
}

// Record a step
function recordStep(action, element, value = null) {
  // Double check recording state
  if (!isRecording) {
    console.log('Jira Recorder: Not recording, skipping step');
    return;
  }
  
  if (isPaused) {
    console.log('Jira Recorder: Recording paused, skipping step');
    return;
  }
  
  stepCounter++;
  const elementDesc = getElementDescription(element);
  const step = {
    action: action,
    element: elementDesc,
    value: value,
    url: window.location.href,
    selector: getElementSelector(element),
    description: `${stepCounter}. ${action} ${elementDesc}${value ? ` with value "${value}"` : ''}`
  };
  
  console.log('Jira Recorder: Recording step', step);
  
  // Show pen writing animation
  try {
    showPenWritingAnimation(element);
  } catch (e) {
    console.error('Jira Recorder: Error showing pen animation', e);
  }
  
  // Add to recent steps for popup
  recentSteps.push({
    action: action,
    element: elementDesc,
    value: value
  });
  
  // Keep only last MAX_RECENT_STEPS + 5 for smooth scrolling
  if (recentSteps.length > MAX_RECENT_STEPS + 5) {
    recentSteps.shift();
  }
  
  // Update popup immediately
  try {
    updateStepsPopup();
  } catch (e) {
    console.error('Jira Recorder: Error updating popup', e);
  }
  
  // Capture screenshot for this step
  captureScreenshotForStep(step);
}

// Capture screenshot for a step
function captureScreenshotForStep(step) {
  // Request screenshot capture from background script
  chrome.runtime.sendMessage({
    action: 'captureScreenshot',
    tabId: null // Will be determined in background script
  }, (screenshotResponse) => {
    if (screenshotResponse && screenshotResponse.success && screenshotResponse.screenshot) {
      // Add screenshot to step
      step.screenshot = screenshotResponse.screenshot;
      console.log('Jira Recorder: Screenshot captured for step');
    } else {
      console.log('Jira Recorder: Screenshot capture failed or not available');
    }
    
    // Send step to background script (with or without screenshot)
    chrome.runtime.sendMessage({
      action: 'addStep',
      step: step
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Jira Recorder: Error sending step', chrome.runtime.lastError);
      } else {
        if (response && response.success) {
          console.log('Jira Recorder: Step recorded successfully');
        } else {
          console.warn('Jira Recorder: Step recording failed', response);
        }
      }
    });
  });
}

// Show pen writing animation
function showPenWritingAnimation(element) {
  if (!element) return;
  
  const rect = element.getBoundingClientRect();
  const pen = document.createElement('div');
  pen.id = 'jira-recorder-pen';
  pen.innerHTML = '✍️';
  pen.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top - 30}px;
    font-size: 24px;
    z-index: 1000000;
    pointer-events: none;
    animation: penWriting 0.8s ease-out forwards;
    transform-origin: center;
  `;
  
  document.body.appendChild(pen);
  
  // Add animation keyframes if not already added
  if (!document.getElementById('pen-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pen-animation-style';
    style.textContent = `
      @keyframes penWriting {
        0% {
          opacity: 0;
          transform: translateY(-10px) scale(0.5) rotate(-10deg);
        }
        50% {
          opacity: 1;
          transform: translateY(0) scale(1.2) rotate(5deg);
        }
        100% {
          opacity: 0;
          transform: translateY(10px) scale(0.8) rotate(10deg);
        }
      }
      
      @keyframes penWritingLine {
        0% {
          width: 0;
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          width: 100%;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove pen after animation
  setTimeout(() => {
    if (pen.parentNode) {
      pen.remove();
    }
  }, 800);
  
  // Add a writing line effect
  const line = document.createElement('div');
  line.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top + rect.height}px;
    height: 2px;
    background: linear-gradient(90deg, #0052CC, transparent);
    z-index: 999999;
    pointer-events: none;
    animation: penWritingLine 0.6s ease-out forwards;
  `;
  line.style.width = `${rect.width}px`;
  document.body.appendChild(line);
  
  setTimeout(() => {
    if (line.parentNode) {
      line.remove();
    }
  }, 600);
}

// Store observer reference for cleanup
let urlObserver = null;

// Attach event listeners
function attachEventListeners() {
  // Remove existing listeners first to avoid duplicates
  removeEventListeners();
  
  // Use capture phase to catch events early
  document.addEventListener('click', handleClick, true);
  document.addEventListener('input', handleInput, true);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('change', handleChange, true);
  document.addEventListener('submit', handleSubmit, true);
  
  // Track navigation
  let lastUrl = window.location.href;
  if (urlObserver) {
    urlObserver.disconnect();
  }
  
  urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      if (isRecording && !isPaused) {
        recordStep('Navigate to', document.body, window.location.href);
      }
    }
  });
  
  if (document.body) {
    urlObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  // Also listen to popstate for browser navigation
  window.addEventListener('popstate', () => {
    if (isRecording && !isPaused) {
      recordStep('Navigate to', document.body, window.location.href);
    }
  });
  
  // Listen for pushState/replaceState (SPA navigation)
  if (!window._jiraRecorderOriginalPushState) {
    window._jiraRecorderOriginalPushState = history.pushState;
    window._jiraRecorderOriginalReplaceState = history.replaceState;
  }
  
  history.pushState = function(...args) {
    window._jiraRecorderOriginalPushState.apply(history, args);
    setTimeout(() => {
      if (isRecording && !isPaused) {
        recordStep('Navigate to', document.body, window.location.href);
      }
    }, 100);
  };
  
  history.replaceState = function(...args) {
    window._jiraRecorderOriginalReplaceState.apply(history, args);
    setTimeout(() => {
      if (isRecording && !isPaused) {
        recordStep('Navigate to', document.body, window.location.href);
      }
    }, 100);
  };
  
  console.log('Jira Recorder: Event listeners attached', { isRecording, isPaused });
}

// Remove event listeners
function removeEventListeners() {
  try {
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('input', handleInput, true);
    document.removeEventListener('keydown', handleKeyDown, true);
    document.removeEventListener('change', handleChange, true);
    document.removeEventListener('submit', handleSubmit, true);
  } catch (e) {
    console.error('Jira Recorder: Error removing listeners', e);
  }
  
  if (urlObserver) {
    urlObserver.disconnect();
    urlObserver = null;
  }
  
  // Restore original history methods
  if (window._jiraRecorderOriginalPushState) {
    history.pushState = window._jiraRecorderOriginalPushState;
    history.replaceState = window._jiraRecorderOriginalReplaceState;
    window._jiraRecorderOriginalPushState = null;
    window._jiraRecorderOriginalReplaceState = null;
  }
  
  console.log('Jira Recorder: Event listeners removed');
}

// Event handlers
function handleClick(event) {
  if (!isRecording) return;
  
  const element = event.target;
  const tagName = element.tagName?.toLowerCase();
  
  // Skip if clicking on recording indicator, popup, or their children
  if (element.id === 'jira-recorder-indicator' || 
      element.closest('#jira-recorder-indicator') ||
      element.id === 'jira-recorder-stop-btn' ||
      element.id === 'jira-recorder-popup' ||
      element.closest('#jira-recorder-popup') ||
      element.id === 'jira-recorder-toggle-popup') {
    return;
  }
  
  // Skip if clicking inside an input/textarea (those are handled separately)
  if (tagName === 'input' || tagName === 'textarea') return;
  
  // Get element description - if empty, it means it's a generic element we should skip
  const elementDesc = getElementDescription(element);
  
  // Skip generic divs/spans without meaningful description
  if ((tagName === 'div' || tagName === 'span') && !elementDesc) {
    return; // Don't record generic div/span clicks
  }
  
  // Record clicks on meaningful elements
  if (elementDesc) {
    // Track button clicks to avoid redundant form submissions
    if (tagName === 'button' || 
        element.type === 'submit' || 
        element.getAttribute('type') === 'submit' ||
        (element.closest('form') && (element.textContent?.toLowerCase().includes('submit') || 
                                     element.textContent?.toLowerCase().includes('register') ||
                                     element.textContent?.toLowerCase().includes('save')))) {
      recentButtonClick = true;
      // Clear the flag after 500ms
      if (buttonClickTimeout) {
        clearTimeout(buttonClickTimeout);
      }
      buttonClickTimeout = setTimeout(() => {
        recentButtonClick = false;
        buttonClickTimeout = null;
      }, 500);
    }
    
    recordStep('Click on', element);
  }
}

// Track input fields to avoid duplicate recordings
const inputFields = new WeakMap();

function handleInput(event) {
  if (!isRecording) return;
  
  const element = event.target;
  const tagName = element.tagName?.toLowerCase();
  
  if (tagName === 'input' || tagName === 'textarea') {
    // Skip password fields for security
    if (element.type === 'password') {
      recordStep('Enter password in', element, '***');
      return;
    }
    
    // Use debouncing to record after user stops typing
    clearTimeout(inputFields.get(element));
    
    const timeoutId = setTimeout(() => {
      if (isRecording && element.value && element.value.trim()) {
        recordStep('Type in', element, element.value);
      }
    }, 1000); // Wait 1 second after last keystroke
    
    inputFields.set(element, timeoutId);
  }
}

// Also capture keydown for immediate feedback on typing
function handleKeyDown(event) {
  if (!isRecording) return;
  
  const element = event.target;
  const tagName = element.tagName?.toLowerCase();
  
  // Record Enter key presses
  if (event.key === 'Enter' && (tagName === 'input' || tagName === 'textarea')) {
    // Small delay to let the input event fire first
    setTimeout(() => {
      if (isRecording && element.value && element.value.trim()) {
        recordStep('Type and press Enter in', element, element.value);
      }
    }, 100);
  }
}

function handleChange(event) {
  if (!isRecording) return;
  
  const element = event.target;
  const tagName = element.tagName?.toLowerCase();
  
  if (tagName === 'select' || (tagName === 'input' && element.type === 'checkbox') || (tagName === 'input' && element.type === 'radio')) {
    const value = tagName === 'select' ? element.options[element.selectedIndex]?.text : 
                  element.type === 'checkbox' ? (element.checked ? 'checked' : 'unchecked') :
                  element.value;
    recordStep('Change', element, value);
  }
}

// Track recent button clicks to avoid redundant form submissions
let recentButtonClick = false;
let buttonClickTimeout = null;

function handleSubmit(event) {
  if (!isRecording) return;
  
  // Don't record form submission if a button was recently clicked
  // (the button click is more meaningful)
  if (recentButtonClick) {
    recentButtonClick = false;
    if (buttonClickTimeout) {
      clearTimeout(buttonClickTimeout);
      buttonClickTimeout = null;
    }
    return; // Skip redundant form submission
  }
  
  recordStep('Submit form', event.target);
}

// Store recent steps for the popup
let recentSteps = [];
const MAX_RECENT_STEPS = 5;

// Show recording indicator with steps popup
function showRecordingIndicator() {
  // Wait for body to be ready
  const ensureBodyReady = (callback) => {
    if (document.body) {
      callback();
    } else {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        setTimeout(() => ensureBodyReady(callback), 100);
      }
    }
  };
  
  ensureBodyReady(() => {
    // Remove existing indicator if any
    const existing = document.getElementById('jira-recorder-indicator');
    if (existing) {
      existing.remove();
    }
    
    const existingPopup = document.getElementById('jira-recorder-popup');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.id = 'jira-recorder-indicator';
    indicator.innerHTML = `
      <span style="margin-right: 8px;">${isPaused ? '⏸️ Paused' : '🔴 Recording'}</span>
      <button id="jira-recorder-stop-btn" style="
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        margin-left: 8px;
      ">Stop</button>
    `;
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${isPaused ? '#ffa500' : '#ff4444'};
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      user-select: none;
      cursor: move;
    `;
    
    try {
      document.body.appendChild(indicator);
      console.log('Jira Recorder: Indicator added to page');
    } catch (e) {
      console.error('Jira Recorder: Failed to add indicator', e);
      // Try again after a short delay
      setTimeout(() => {
        try {
          document.body.appendChild(indicator);
        } catch (e2) {
          console.error('Jira Recorder: Failed to add indicator again', e2);
        }
      }, 500);
    }
    
    // Add click handler for stop button
    const stopBtn = document.getElementById('jira-recorder-stop-btn');
    if (stopBtn) {
      stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'stopRecording' }, (response) => {
          if (response && response.success) {
            isRecording = false;
            isPaused = false;
            removeEventListeners();
            hideRecordingIndicator();
            // Show notification with Copy Steps and Preview Steps buttons
            showRecordingStoppedNotification();
          }
        });
      });
      
      stopBtn.addEventListener('mouseenter', () => {
        stopBtn.style.background = 'rgba(255,255,255,0.3)';
      });
      stopBtn.addEventListener('mouseleave', () => {
        stopBtn.style.background = 'rgba(255,255,255,0.2)';
      });
    }
    
    // Create steps popup
    const popup = document.createElement('div');
    popup.id = 'jira-recorder-popup';
    popup.innerHTML = `
      <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #333;
      color: white;
      border-radius: 6px 6px 0 0;
      cursor: move;
    ">
      <span style="font-weight: bold; font-size: 13px;">Recent Steps</span>
      <button id="jira-recorder-toggle-popup" style="
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">−</button>
    </div>
    <div id="jira-recorder-steps-list" style="
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;
      background: white;
      color: #333;
      padding: 8px;
    ">
      <div style="
        padding: 20px;
        text-align: center;
        color: #999;
        font-size: 12px;
      ">No steps recorded yet</div>
    </div>
    <div style="
      padding: 6px 12px;
      background: #f5f5f5;
      border-radius: 0 0 6px 6px;
      font-size: 11px;
      color: #666;
      text-align: center;
    "     id="jira-recorder-step-count">0 steps</div>
    `;
    popup.style.cssText = `
      position: fixed;
      top: 60px;
      right: 10px;
      width: 320px;
      background: white;
      border-radius: 6px;
      font-family: Arial, sans-serif;
      z-index: 999998;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      max-height: 400px;
      pointer-events: auto;
    `;
    
    // Make sure the steps list is scrollable and doesn't interfere
    const stepsListEl = popup.querySelector('#jira-recorder-steps-list');
    if (stepsListEl) {
      stepsListEl.style.pointerEvents = 'auto';
      // Add custom scrollbar styling
      if (!document.getElementById('jira-recorder-scrollbar-style')) {
        const style = document.createElement('style');
        style.id = 'jira-recorder-scrollbar-style';
        style.textContent = `
          #jira-recorder-steps-list::-webkit-scrollbar {
            width: 6px;
          }
          #jira-recorder-steps-list::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          #jira-recorder-steps-list::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
          #jira-recorder-steps-list::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    try {
      document.body.appendChild(popup);
      console.log('Jira Recorder: Popup added to page');
    } catch (e) {
      console.error('Jira Recorder: Failed to add popup', e);
    }
    
    // Make popup draggable
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    const header = popup.querySelector('div');
    if (header) {
      header.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX - popup.offsetLeft;
        initialY = e.clientY - popup.offsetTop;
      });
    }
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        popup.style.left = currentX + 'px';
        popup.style.top = currentY + 'px';
        popup.style.right = 'auto';
      }
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    // Toggle popup collapse
    const toggleBtn = document.getElementById('jira-recorder-toggle-popup');
    if (toggleBtn) {
      let isCollapsed = false;
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isCollapsed = !isCollapsed;
        const stepsList = document.getElementById('jira-recorder-steps-list');
        const stepCount = document.getElementById('jira-recorder-step-count');
        if (isCollapsed) {
          stepsList.style.display = 'none';
          stepCount.style.display = 'none';
          toggleBtn.textContent = '+';
          popup.style.height = 'auto';
        } else {
          stepsList.style.display = 'block';
          stepCount.style.display = 'block';
          toggleBtn.textContent = '−';
        }
      });
    }
    
    // Update steps display - fetch existing steps from background
    loadExistingStepsForPopup();
  }); // End of ensureBodyReady callback
}

// Load existing steps from background script to populate the popup
function loadExistingStepsForPopup() {
  chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
    if (response && response.steps && response.steps.length > 0) {
      // Populate recentSteps with all existing steps
      recentSteps = response.steps.map(step => ({
        action: step.action,
        element: step.element,
        value: step.value
      }));
      
      // Update the popup with all steps
      updateStepsPopup();
      console.log('Jira Recorder: Loaded', recentSteps.length, 'existing steps into popup');
    } else {
      // No existing steps, just update empty popup
      updateStepsPopup();
    }
  });
}

// Update recording indicator based on pause state
function updateRecordingIndicator() {
  const indicator = document.getElementById('jira-recorder-indicator');
  if (!indicator) return;
  
  const statusText = indicator.querySelector('span');
  if (statusText) {
    statusText.textContent = isPaused ? '⏸️ Paused' : '🔴 Recording';
  }
  indicator.style.background = isPaused ? '#ffa500' : '#ff4444';
}

// Hide recording indicator
function hideRecordingIndicator() {
  const indicator = document.getElementById('jira-recorder-indicator');
  if (indicator) {
    indicator.remove();
  }
  const popup = document.getElementById('jira-recorder-popup');
  if (popup) {
    popup.remove();
  }
  recentSteps = [];
}

// Update the steps popup with recent steps
function updateStepsPopup() {
  const stepsList = document.getElementById('jira-recorder-steps-list');
  const stepCount = document.getElementById('jira-recorder-step-count');
  
  if (!stepsList || !stepCount) return;
  
  // If no steps in local array, try to fetch from background script
  if (recentSteps.length === 0) {
    chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
      if (response && response.steps && response.steps.length > 0) {
        // Populate recentSteps with all existing steps
        recentSteps = response.steps.map(step => ({
          action: step.action,
          element: step.element,
          value: step.value
        }));
        // Recursively call to update with fetched steps
        updateStepsPopup();
        return;
      }
      
      // No steps found, show empty state
      stepsList.innerHTML = `
        <div style="
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 12px;
        ">No steps recorded yet</div>
      `;
      stepCount.textContent = '0 steps';
    });
    return;
  }
  
  // Show last MAX_RECENT_STEPS steps (newest first)
  // But if we have fewer than MAX_RECENT_STEPS, show all
  const stepsToShow = recentSteps.length <= MAX_RECENT_STEPS 
    ? recentSteps.slice().reverse() 
    : recentSteps.slice(-MAX_RECENT_STEPS).reverse();
  
  stepsList.innerHTML = stepsToShow.map((step, index) => {
    // Calculate step number (most recent step has highest number)
    const stepNum = recentSteps.length - (stepsToShow.length - 1 - index);
    let valueText = '';
    if (step.value && step.value !== step.url && step.value !== '***') {
      const displayValue = step.value.length > 30 ? step.value.substring(0, 30) + '...' : step.value;
      valueText = `<span style="color: #0052CC; font-size: 11px;">${displayValue}</span>`;
    }
    
    return `
      <div style="
        padding: 8px;
        margin-bottom: 4px;
        background: #f9f9f9;
        border-left: 3px solid #0052CC;
        border-radius: 3px;
        font-size: 12px;
      ">
        <div style="
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        ">
          <span style="
            background: #0052CC;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            margin-right: 8px;
            flex-shrink: 0;
          ">${stepNum}</span>
          <span style="font-weight: 600; color: #333;">${step.action}</span>
        </div>
        <div style="
          margin-left: 28px;
          color: #666;
          font-size: 11px;
        ">
          ${step.element || 'element'}
          ${valueText ? '<br/>' + valueText : ''}
        </div>
      </div>
    `;
  }).join('');
  
  stepCount.textContent = `${recentSteps.length} step${recentSteps.length !== 1 ? 's' : ''} recorded`;
  
  // Auto-scroll to bottom
  stepsList.scrollTop = stepsList.scrollHeight;
}

// Function to check and apply recording state
function checkRecordingState() {
  chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('Jira Recorder: Could not get recording state, retrying...');
      // Retry after a short delay
      setTimeout(checkRecordingState, 500);
      return;
    }
    
    if (response && response.isRecording && !isRecording) {
      isRecording = true;
      isPaused = response.isPaused || false;
      
      // Restore step counter from existing steps
      if (response.steps && response.steps.length > 0) {
        stepCounter = response.steps.length;
        console.log('Jira Recorder: Restored step counter to', stepCounter);
        
        // Also restore recentSteps for the popup
        recentSteps = response.steps.map(step => ({
          action: step.action,
          element: step.element,
          value: step.value
        }));
      }
      
      attachEventListeners();
      showRecordingIndicator();
      console.log('Jira Recorder: Recording resumed on page load', { 
        isRecording, 
        isPaused, 
        stepCount: stepCounter,
        recentStepsCount: recentSteps.length
      });
    }
  });
}

// Show notification when recording stops
function showRecordingStoppedNotification() {
  // Get notification timeout from storage (default 20 seconds)
  chrome.storage.local.get(['notificationTimeout'], (result) => {
    const timeoutSeconds = parseInt(result.notificationTimeout) || 20;
    
    // Get steps from background
    chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
      if (!response || !response.steps || response.steps.length === 0) {
        console.log('Jira Recorder: No steps to show in notification');
        return;
      }
      
      // Remove existing notification if any
      const existing = document.getElementById('jira-recorder-stopped-notification');
      if (existing) {
        existing.remove();
      }
      
      // Create notification element
      const notification = document.createElement('div');
      notification.id = 'jira-recorder-stopped-notification';
      notification.innerHTML = `
        <div style="
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          padding: 16px;
          border-left: 4px solid #4CAF50;
          min-width: 300px;
          max-width: 400px;
        ">
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          ">
            <div style="
              font-size: 24px;
              margin-right: 12px;
            ">📋</div>
            <div style="flex: 1;">
              <div style="
                font-weight: bold;
                font-size: 16px;
                color: #333;
                margin-bottom: 4px;
              ">Recording Stopped!</div>
              <div style="
                font-size: 13px;
                color: #666;
              ">Copy your steps or preview with images</div>
            </div>
            <button id="jira-recorder-close-notification" style="
              background: none;
              border: none;
              font-size: 24px;
              color: #999;
              cursor: pointer;
              padding: 0;
              width: 24px;
              height: 24px;
              line-height: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            ">&times;</button>
          </div>
          <div style="
            display: flex;
            gap: 8px;
            justify-content: flex-end;
          ">
            <button id="jira-recorder-preview-btn" style="
              background: #6c757d;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              min-width: 120px;
            ">👁️ Preview Steps</button>
            <button id="jira-recorder-copy-btn" style="
              background: #0052CC;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              min-width: 120px;
            ">Copy Steps</button>
          </div>
        </div>
      `;
      
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        animation: slideInRight 0.3s ease-out;
      `;
      
      // Add animation keyframes if not already added
      if (!document.getElementById('jira-recorder-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'jira-recorder-notification-styles';
        style.textContent = `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Append to body
      document.body.appendChild(notification);
      
      // Close button handler
      const closeBtn = document.getElementById('jira-recorder-close-notification');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          hideNotification(notification);
        });
      }
      
      // Copy button handler
      const copyBtn = document.getElementById('jira-recorder-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          await copyStepsToClipboard(response.steps);
          // Update button to show success
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied!';
          copyBtn.style.background = '#4CAF50';
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#0052CC';
          }, 2000);
        });
      }
      
      // Preview button handler
      const previewBtn = document.getElementById('jira-recorder-preview-btn');
      if (previewBtn) {
        previewBtn.addEventListener('click', () => {
          previewSteps(response.steps);
        });
      }
      
      // Auto-hide after timeout
      setTimeout(() => {
        hideNotification(notification);
      }, timeoutSeconds * 1000);
    });
  });
}

// Hide notification with animation
function hideNotification(notification) {
  if (!notification) return;
  notification.style.animation = 'slideOutRight 0.3s ease-out';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 300);
}

// Copy steps to clipboard
async function copyStepsToClipboard(steps) {
  try {
    // Format steps for Jira (plain text with Jira markup only)
    // This ensures Jira recognizes the markup syntax
    const jiraText = formatStepsForJira(steps);
    
    // Copy ONLY plain text (Jira markup) - don't include HTML
    // This ensures Jira's editor recognizes the markup syntax correctly
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(jiraText);
      console.log('Jira Recorder: Steps copied to clipboard (Jira markup only)');
      return;
    } else {
      // Fallback - use textarea to ensure plain text copy
      const textarea = document.createElement('textarea');
      textarea.value = jiraText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999); // For mobile devices
      document.execCommand('copy');
      document.body.removeChild(textarea);
      console.log('Jira Recorder: Steps copied to clipboard (fallback method)');
    }
  } catch (err) {
    console.error('Jira Recorder: Error copying steps:', err);
    alert('Failed to copy steps. Please try again.');
  }
}

// Preview steps in new window
function previewSteps(steps) {
  try {
    const formatted = formatStepsForClipboardWithScreenshots(steps);
    const previewWindow = window.open('', '_blank', 'width=1000,height=800');
    if (previewWindow) {
      previewWindow.document.write(formatted.html);
      previewWindow.document.close();
      console.log('Jira Recorder: Preview window opened');
    } else {
      alert('Please allow popups to open the preview window');
    }
  } catch (err) {
    console.error('Jira Recorder: Error opening preview:', err);
    alert('Failed to open preview window. Please try again.');
  }
}

// Format steps for Jira (simplified version)
function formatStepsForJira(steps) {
  if (steps.length === 0) {
    return 'No steps recorded.';
  }
  
  // Clean steps (same logic as popup.js)
  const cleanedSteps = [];
  let lastStep = null;
  let lastUrl = null;
  
  steps.forEach((step, index) => {
    // Skip duplicates
    if (lastStep && 
        lastStep.action === step.action && 
        lastStep.element === step.element && 
        lastStep.url === step.url &&
        lastStep.value === step.value) {
      return;
    }
    
    // Skip generic element clicks
    if (step.action === 'Click on') {
      const elementLower = (step.element || '').toLowerCase().trim();
      if (elementLower === 'div' || elementLower === 'span' || elementLower === 'body' ||
          elementLower === '' || elementLower.length < 2) {
        return;
      }
      if (elementLower.length <= 5 && !step.value) {
        return;
      }
    }
    
    // Skip redundant form submissions
    if (step.action === 'Submit form' && lastStep && 
        lastStep.action === 'Click on' && 
        (lastStep.element.toLowerCase().includes('submit') || 
         lastStep.element.toLowerCase().includes('register') ||
         lastStep.element.toLowerCase().includes('save') ||
         lastStep.element.toLowerCase().includes('confirm'))) {
      return;
    }
    
    cleanedSteps.push(step);
    lastStep = step;
    lastUrl = step.url;
  });
  
  if (cleanedSteps.length === 0) {
    return 'No meaningful steps recorded.';
  }
  
  let output = 'h2. Steps to Reproduce\n\n';
  let stepNum = 0;
  
  cleanedSteps.forEach((step, index) => {
    if (step.action === 'Navigate to') {
      const prevStep = index > 0 ? cleanedSteps[index - 1] : null;
      const urlChanged = !prevStep || prevStep.url !== step.url;
      
      if (index === 0 || urlChanged) {
        stepNum++;
        try {
          const urlObj = new URL(step.url);
          const pathname = urlObj.pathname === '/' ? 'home page' : urlObj.pathname;
          const hash = urlObj.hash ? urlObj.hash : '';
          const displayPath = hash ? `${pathname}${hash}` : pathname;
          output += `${stepNum}. Navigate to ${displayPath}\n`;
          output += `   *URL:* ${step.url}\n\n`;
        } catch (e) {
          output += `${stepNum}. Navigate to ${step.url}\n`;
          output += `   *URL:* ${step.url}\n\n`;
        }
      }
      return;
    }
    
    stepNum++;
    let stepText = `${stepNum}. ${step.action}`;
    let elementDesc = step.element;
    if (elementDesc && elementDesc.length > 0 && elementDesc !== 'body') {
      stepText += ` "${elementDesc}"`;
    }
    if (step.value && step.value !== step.url && step.value !== '***') {
      if (step.value.length > 50) {
        stepText += ` with value "${step.value.substring(0, 50)}..."`;
      } else {
        stepText += ` with value "${step.value}"`;
      }
    } else if (step.value === '***') {
      stepText += ` (password field)`;
    }
    
    output += stepText + '\n';
    output += `   *URL:* ${step.url}\n`;
    
    if (step.screenshot) {
      output += `\n{html}<img src="${step.screenshot}" alt="Screenshot for step ${stepNum}" style="max-width: 800px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; display: block;">{html}\n`;
      output += `\n*Note: If image doesn't appear, upload screenshot-step-${stepNum}.png and reference as !screenshot-step-${stepNum}.png!*\n`;
    }
    output += '\n';
  });
  
  output += '---\n\n';
  output += 'h2. Environment\n\n';
  output += `*Starting URL:* ${cleanedSteps[0].url}\n`;
  output += `*Browser:* Chrome\n`;
  output += `*Recorded:* ${new Date(cleanedSteps[0].timestamp).toLocaleString()}\n`;
  
  return output;
}

// Format steps for clipboard with screenshots
function formatStepsForClipboardWithScreenshots(steps) {
  if (steps.length === 0) {
    return { html: '<p>No steps recorded.</p>', text: 'No steps recorded.' };
  }
  
  // Clean steps (same logic as formatStepsForJira)
  const cleanedSteps = [];
  let lastStep = null;
  let lastUrl = null;
  
  steps.forEach((step, index) => {
    if (lastStep && 
        lastStep.action === step.action && 
        lastStep.element === step.element && 
        lastStep.url === step.url &&
        lastStep.value === step.value) {
      return;
    }
    
    if (step.action === 'Navigate to' && step.url === lastUrl) {
      return;
    }
    
    if (step.action === 'Click on') {
      const elementLower = (step.element || '').toLowerCase().trim();
      if (elementLower === 'div' || elementLower === 'span' || elementLower === 'body' ||
          elementLower === '' || elementLower.length < 2) {
        return;
      }
      if (elementLower.length <= 5 && !step.value) {
        return;
      }
    }
    
    if (step.action === 'Submit form' && lastStep && 
        lastStep.action === 'Click on' && 
        (lastStep.element.toLowerCase().includes('submit') || 
         lastStep.element.toLowerCase().includes('register') ||
         lastStep.element.toLowerCase().includes('save') ||
         lastStep.element.toLowerCase().includes('confirm'))) {
      return;
    }
    
    cleanedSteps.push(step);
    lastStep = step;
    lastUrl = step.url;
  });
  
  if (cleanedSteps.length === 0) {
    return { html: '<p>No meaningful steps recorded.</p>', text: 'No meaningful steps recorded.' };
  }
  
  // Build HTML
  let htmlOutput = '<!DOCTYPE html><html><head><title>Steps to Reproduce</title><style>body{font-family:Arial,sans-serif;line-height:1.6;padding:20px;max-width:900px;margin:0 auto;}h2{color:#0052CC;border-bottom:2px solid #0052CC;padding-bottom:5px;}h3{color:#0052CC;}div.step{margin:15px 0;padding:15px;background:#f9f9f9;border-left:4px solid #0052CC;border-radius:4px;}img{max-width:800px;border:1px solid #ddd;border-radius:4px;margin:10px 0;display:block;}a{color:#0052CC;text-decoration:none;}a:hover{text-decoration:underline;}</style></head><body>';
  htmlOutput += '<h2>Steps to Reproduce</h2>';
  
  let textOutput = 'Steps to Reproduce\n\n';
  let stepNum = 0;
  
  cleanedSteps.forEach((step, index) => {
    if (step.action === 'Navigate to') {
      if (index === 0 || (index > 0 && cleanedSteps[index - 1].url !== step.url)) {
        stepNum++;
        try {
          const urlObj = new URL(step.url);
          const pathname = urlObj.pathname === '/' ? 'home page' : urlObj.pathname;
          const hash = urlObj.hash ? urlObj.hash : '';
          const displayPath = hash ? `${pathname}${hash}` : pathname;
          
          htmlOutput += `<div class="step">`;
          htmlOutput += `<p style="margin:0 0 10px 0;"><strong>${stepNum}.</strong> Navigate to ${escapeHtml(displayPath)}</p>`;
          htmlOutput += `<p style="margin:5px 0;color:#666;font-size:14px;"><strong>URL:</strong> <a href="${escapeHtml(step.url)}" target="_blank" style="color:#0052CC;text-decoration:none;">${escapeHtml(step.url)}</a></p>`;
          
          // Add screenshot if available
          if (step.screenshot) {
            htmlOutput += `<img src="${step.screenshot}" alt="Screenshot for step ${stepNum}" style="max-width:800px;border:1px solid #ddd;border-radius:4px;margin:10px 0;display:block;">`;
          }
          
          htmlOutput += `</div>`;
          
          textOutput += `${stepNum}. Navigate to ${displayPath}\n`;
          textOutput += `   URL: ${step.url}\n\n`;
        } catch (e) {
          htmlOutput += `<div class="step">`;
          htmlOutput += `<p style="margin:0 0 10px 0;"><strong>${stepNum}.</strong> Navigate to ${escapeHtml(step.url)}</p>`;
          htmlOutput += `<p style="margin:5px 0;color:#666;font-size:14px;"><strong>URL:</strong> <a href="${escapeHtml(step.url)}" target="_blank" style="color:#0052CC;text-decoration:none;">${escapeHtml(step.url)}</a></p>`;
          if (step.screenshot) {
            htmlOutput += `<img src="${step.screenshot}" alt="Screenshot for step ${stepNum}" style="max-width:800px;border:1px solid #ddd;border-radius:4px;margin:10px 0;display:block;">`;
          }
          htmlOutput += `</div>`;
          textOutput += `${stepNum}. Navigate to ${step.url}\n`;
          textOutput += `   URL: ${step.url}\n\n`;
        }
      }
      return;
    }
    
    stepNum++;
    let stepText = `${stepNum}. ${step.action}`;
    let elementDesc = step.element;
    if (elementDesc && elementDesc.length > 0 && elementDesc !== 'body') {
      stepText += ` "${elementDesc}"`;
    }
    if (step.value && step.value !== step.url && step.value !== '***') {
      if (step.value.length > 50) {
        stepText += ` with value "${step.value.substring(0, 50)}..."`;
      } else {
        stepText += ` with value "${step.value}"`;
      }
    } else if (step.value === '***') {
      stepText += ` (password field)`;
    }
    
    htmlOutput += `<div class="step">`;
    htmlOutput += `<p style="margin:0 0 10px 0;"><strong>${escapeHtml(stepText)}</strong></p>`;
    htmlOutput += `<p style="margin:5px 0;color:#666;font-size:14px;"><strong>URL:</strong> <a href="${escapeHtml(step.url)}" target="_blank" style="color:#0052CC;text-decoration:none;">${escapeHtml(step.url)}</a></p>`;
    
    // Add screenshot if available
    if (step.screenshot) {
      htmlOutput += `<img src="${step.screenshot}" alt="Screenshot for step ${stepNum}" style="max-width:800px;border:1px solid #ddd;border-radius:4px;margin:10px 0;display:block;">`;
    }
    
    htmlOutput += `</div>`;
    
    textOutput += stepText + '\n';
    textOutput += `   URL: ${step.url}\n`;
    if (step.screenshot) {
      textOutput += `\n[Screenshot available for this step]\n`;
    }
    textOutput += '\n';
  });
  
  htmlOutput += '<hr style="margin:20px 0;"><h3>Environment</h3>';
  htmlOutput += `<p><strong>Starting URL:</strong> <a href="${escapeHtml(cleanedSteps[0].url)}" target="_blank" style="color:#0052CC;text-decoration:none;">${escapeHtml(cleanedSteps[0].url)}</a></p>`;
  htmlOutput += `<p><strong>Browser:</strong> Chrome</p>`;
  htmlOutput += `<p><strong>Recorded:</strong> ${new Date(cleanedSteps[0].timestamp).toLocaleString()}</p>`;
  htmlOutput += '</body></html>';
  
  textOutput += '---\n\n';
  textOutput += 'Environment\n\n';
  textOutput += `Starting URL: ${cleanedSteps[0].url}\n`;
  textOutput += `Browser: Chrome\n`;
  textOutput += `Recorded: ${new Date(cleanedSteps[0].timestamp).toLocaleString()}\n`;
  
  return { html: htmlOutput, text: textOutput };
}

// Escape HTML helper
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Check if recording is already active on page load
checkRecordingState();

// Also check when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    checkRecordingState();
  });
} else {
  // DOM already ready, check again
  setTimeout(checkRecordingState, 100);
}

