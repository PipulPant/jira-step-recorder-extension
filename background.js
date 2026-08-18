// Background service worker to manage recording state
let isRecording = false;
let isPaused = false;
let steps = [];
let currentUrl = '';

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startRecording') {
    // Only clear steps if explicitly starting a new recording from the popup
    // When broadcasting to tabs (request.clearSteps is undefined), never clear steps
    const shouldClearSteps = request.clearSteps === true; // Only clear if explicitly set to true
    isRecording = true;
    isPaused = false;
    
    if (shouldClearSteps) {
      steps = [];
      currentUrl = '';
      chrome.storage.local.set({ steps: [], isRecording: true, isPaused: false });
      console.log('Jira Recorder: Starting new recording - cleared steps');
    } else {
      // Continue recording - keep existing steps (this includes when broadcasting to tabs)
      chrome.storage.local.set({ isRecording: true, isPaused: false });
      console.log('Jira Recorder: Continuing recording - kept', steps.length, 'existing steps');
    }
    
    // Broadcast to all tabs and inject content script if needed
    // IMPORTANT: When broadcasting, we send clearSteps: false to preserve steps
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        // Skip chrome:// and extension:// pages
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          chrome.tabs.sendMessage(tab.id, { action: 'startRecording', clearSteps: false }).catch(() => {
            // If message fails, try to inject the script
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            }).then(() => {
              // After injection, send the start message with clearSteps: false
              chrome.tabs.sendMessage(tab.id, { action: 'startRecording', clearSteps: false }).catch(() => {});
            }).catch(() => {
              // Tab might not be accessible, ignore
            });
          });
        }
      });
    });
    sendResponse({ success: true });
  } else if (request.action === 'stopRecording') {
    isRecording = false;
    isPaused = false;
    chrome.storage.local.set({ isRecording: false, isPaused: false });
    
    // Broadcast to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          chrome.tabs.sendMessage(tab.id, { action: 'stopRecording' }).catch(() => {});
        }
      });
    });
    sendResponse({ success: true, steps: steps });
  } else if (request.action === 'pauseRecording') {
    isPaused = true;
    chrome.storage.local.set({ isPaused: true });
    // Broadcast to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          chrome.tabs.sendMessage(tab.id, { action: 'pauseRecording' }).catch(() => {});
        }
      });
    });
    sendResponse({ success: true });
  } else if (request.action === 'resumeRecording') {
    isPaused = false;
    chrome.storage.local.set({ isPaused: false });
    // Broadcast to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          chrome.tabs.sendMessage(tab.id, { action: 'resumeRecording' }).catch(() => {});
        }
      });
    });
    sendResponse({ success: true });
  } else if (request.action === 'captureScreenshot') {
    // Capture screenshot of the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        // First try PNG format
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
          if (chrome.runtime.lastError) {
            console.error('Jira Recorder: Screenshot error:', chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else if (dataUrl) {
            // Compress screenshot if it's too large (limit to ~500KB base64)
            if (dataUrl.length > 500000) {
              // For very large screenshots, use JPEG with lower quality
              chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 60 }, (compressedDataUrl) => {
                if (compressedDataUrl) {
                  sendResponse({ success: true, screenshot: compressedDataUrl });
                } else {
                  // If compression fails, still return the PNG (user can handle it)
                  sendResponse({ success: true, screenshot: dataUrl });
                }
              });
            } else {
              sendResponse({ success: true, screenshot: dataUrl });
            }
          } else {
            sendResponse({ success: false, error: 'No screenshot data' });
          }
        });
      } else {
        sendResponse({ success: false, error: 'No active tab' });
      }
    });
    return true; // Async response
  } else if (request.action === 'addStep') {
    if (isRecording && !isPaused) {
      const step = {
        id: Date.now() + Math.random(), // Add random to ensure unique IDs
        timestamp: new Date().toISOString(),
        action: request.step.action,
        element: request.step.element,
        value: request.step.value,
        url: request.step.url,
        selector: request.step.selector,
        description: request.step.description,
        screenshot: request.step.screenshot || null // Include screenshot if available
      };
      steps.push(step);
      // Store in chrome.storage for persistence - CRITICAL for persistence across page loads
      // Note: Screenshots can be large, so we might need to handle storage limits
      chrome.storage.local.set({ steps: steps, isRecording: true }, () => {
        if (chrome.runtime.lastError) {
          console.error('Jira Recorder: Storage error (might be too large):', chrome.runtime.lastError);
          // If storage fails due to size, remove screenshots and try again
          if (chrome.runtime.lastError.message.includes('QUOTA_BYTES')) {
            console.log('Jira Recorder: Storage quota exceeded, removing screenshots');
            steps.forEach(s => delete s.screenshot);
            chrome.storage.local.set({ steps: steps, isRecording: true });
          }
        } else {
          console.log('Jira Recorder: Steps saved to storage', steps.length);
        }
      });
      sendResponse({ success: true, stepCount: steps.length });
    } else {
      sendResponse({ success: false, reason: isPaused ? 'paused' : 'not_recording' });
    }
  } else if (request.action === 'getSteps') {
    sendResponse({ steps: steps, isRecording: isRecording, isPaused: isPaused });
  } else if (request.action === 'clearSteps') {
    steps = [];
    chrome.storage.local.set({ steps: [], isRecording: false, isPaused: false });
    sendResponse({ success: true });
  } else if (request.action === 'getRecordingState') {
    sendResponse({ isRecording: isRecording, isPaused: isPaused, stepCount: steps.length });
  } else if (request.action === 'removeLastStep') {
    if (steps.length > 0) {
      steps.pop();
      chrome.storage.local.set({ steps: steps });
      sendResponse({ success: true, steps: steps });
    } else {
      sendResponse({ success: false });
    }
  } else if (request.action === 'removeStep') {
    const index = request.index;
    if (index >= 0 && index < steps.length) {
      steps.splice(index, 1);
      chrome.storage.local.set({ steps: steps });
      sendResponse({ success: true, steps: steps });
    } else {
      sendResponse({ success: false });
    }
  } else if (request.action === 'updateStep') {
    const index = request.index;
    if (index >= 0 && index < steps.length) {
      steps[index] = { ...steps[index], ...request.step };
      chrome.storage.local.set({ steps: steps });
      sendResponse({ success: true, steps: steps });
    } else {
      sendResponse({ success: false });
    }
  } else if (request.action === 'saveRecording') {
    chrome.storage.local.get(['savedRecordings'], (result) => {
      const savedRecordings = result.savedRecordings || [];
      const newRecording = {
        id: Date.now().toString(),
        name: request.name,
        steps: request.steps,
        tags: request.tags || [],
        savedAt: new Date().toISOString()
      };
      savedRecordings.push(newRecording);
      chrome.storage.local.set({ savedRecordings: savedRecordings }, () => {
        if (chrome.runtime.lastError) {
          // Quota exceeded — retry with screenshots stripped from the new recording only
          console.warn('Jira Recorder: Save failed (quota?), retrying without screenshots:', chrome.runtime.lastError.message);
          const stripped = { ...newRecording, steps: newRecording.steps.map(s => ({ ...s, screenshot: null })) };
          const withStripped = [...savedRecordings.slice(0, -1), stripped];
          chrome.storage.local.set({ savedRecordings: withStripped }, () => {
            if (chrome.runtime.lastError) {
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
              sendResponse({ success: true, note: 'Screenshots omitted due to storage limits' });
            }
          });
        } else {
          sendResponse({ success: true });
        }
      });
    });
  } else if (request.action === 'getSavedRecordings') {
    chrome.storage.local.get(['savedRecordings'], (result) => {
      sendResponse({ recordings: result.savedRecordings || [] });
    });
  } else if (request.action === 'loadSavedRecording') {
    chrome.storage.local.get(['savedRecordings'], (result) => {
      const savedRecordings = result.savedRecordings || [];
      const recording = savedRecordings.find(r => r.id === request.id);
      if (recording) {
        steps = recording.steps;
        chrome.storage.local.set({ steps: steps });
        sendResponse({ success: true, steps: steps });
      } else {
        sendResponse({ success: false });
      }
    });
  } else if (request.action === 'deleteSavedRecording') {
    chrome.storage.local.get(['savedRecordings'], (result) => {
      const savedRecordings = result.savedRecordings || [];
      const filtered = savedRecordings.filter(r => r.id !== request.id);
      chrome.storage.local.set({ savedRecordings: filtered });
      sendResponse({ success: true });
    });
  } else if (request.action === 'updateLastStep') {
    if (steps.length > 0 && isRecording && !isPaused) {
      steps[steps.length - 1] = { ...steps[steps.length - 1], value: request.step.value, screenshot: request.step.screenshot };
      chrome.storage.local.set({ steps: steps });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
  } else if (request.action === 'toggleRecording') {
    if (isRecording) {
      // Stop recording
      isRecording = false;
      isPaused = false;
      chrome.storage.local.set({ isRecording: false, isPaused: false });
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
            chrome.tabs.sendMessage(tab.id, { action: 'stopRecording' }).catch(() => {});
          }
        });
      });
      sendResponse({ success: true, action: 'stopped', steps: steps });
    } else {
      // Start recording (keep existing steps)
      isRecording = true;
      isPaused = false;
      chrome.storage.local.set({ isRecording: true, isPaused: false });
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
            chrome.tabs.sendMessage(tab.id, { action: 'startRecording', clearSteps: false }).catch(() => {});
          }
        });
      });
      sendResponse({ success: true, action: 'started' });
    }
  } else if (request.action === 'togglePause') {
    if (isPaused) {
      isPaused = false;
      chrome.storage.local.set({ isPaused: false });
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
            chrome.tabs.sendMessage(tab.id, { action: 'resumeRecording' }).catch(() => {});
          }
        });
      });
      sendResponse({ success: true, action: 'resumed' });
    } else if (isRecording) {
      isPaused = true;
      chrome.storage.local.set({ isPaused: true });
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
            chrome.tabs.sendMessage(tab.id, { action: 'pauseRecording' }).catch(() => {});
          }
        });
      });
      sendResponse({ success: true, action: 'paused' });
    } else {
      sendResponse({ success: false, reason: 'not_recording' });
    }
  } else if (request.action === 'updateAllSteps') {
    steps = request.steps || [];
    chrome.storage.local.set({ steps: steps });
    sendResponse({ success: true, steps: steps });
  } else if (request.action === 'startScreenRecording') {
    // Screen recording is optional and not essential for step recording
    // The tabCapture API has limitations in Manifest V3, so we'll skip it
    // The core step recording functionality doesn't depend on screen capture
    console.log('Jira Recorder: Screen recording requested but not implemented (optional feature)');
    sendResponse({ success: false, error: 'Screen recording not available' });
    return false; // Not async, just return failure gracefully
  }
  
  return true; // Keep message channel open for async response
});

// Restore state on startup - CRITICAL for persistence
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['steps', 'isRecording', 'isPaused'], (result) => {
    if (result.steps) {
      steps = result.steps;
      console.log('Jira Recorder: Restored', steps.length, 'steps on startup');
    }
    if (result.isRecording !== undefined) {
      isRecording = result.isRecording;
    }
    if (result.isPaused !== undefined) {
      isPaused = result.isPaused;
    }
  });
});

// Initialize on install and restore state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['steps', 'isRecording', 'isPaused'], (result) => {
    if (result.steps) {
      steps = result.steps;
      console.log('Jira Recorder: Restored', steps.length, 'steps on install');
    }
    if (result.isRecording !== undefined) {
      isRecording = result.isRecording;
    }
    if (result.isPaused !== undefined) {
      isPaused = result.isPaused;
    }
  });
});

// Also restore state immediately when background script loads
chrome.storage.local.get(['steps', 'isRecording', 'isPaused'], (result) => {
  if (result.steps) {
    steps = result.steps;
    console.log('Jira Recorder: Restored', steps.length, 'steps on background load');
  }
  if (result.isRecording !== undefined) {
    isRecording = result.isRecording;
  }
  if (result.isPaused !== undefined) {
    isPaused = result.isPaused;
  }
});

