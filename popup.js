// Popup script
let steps = [];
let isRecording = false;
let isPaused = false;
let editingStepIndex = null;

// DOM elements
const container = document.querySelector('.container');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const pauseBtn = document.getElementById('pauseBtn');
const clearBtn = document.getElementById('clearBtn');

// Verify stop button exists
if (!stopBtn) {
  console.error('Stop button not found in DOM!');
}
const undoBtn = document.getElementById('undoBtn');
const exportBtn = document.getElementById('exportBtn');
const statusText = document.getElementById('statusText');
const stepCount = document.getElementById('stepCount');
const copyStepsBtn = document.getElementById('copyStepsBtn');
const copyNotification = document.getElementById('copyNotification');
const copyNotificationBtn = document.getElementById('copyNotificationBtn');
const previewNotificationBtn = document.getElementById('previewNotificationBtn');
const closeNotificationBtn = document.getElementById('closeNotificationBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const notificationTimeoutInput = document.getElementById('notificationTimeoutInput');
const stepsList = document.getElementById('stepsList');
const exportModal = document.getElementById('exportModal');
const jiraOutput = document.getElementById('jiraOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadScreenshotsBtn = document.getElementById('downloadScreenshotsBtn');
const closeModal = document.getElementById('closeModal');
const formatSelector = document.getElementById('formatSelector');
const saveBtn = document.getElementById('saveBtn');
const saveModal = document.getElementById('saveModal');
const closeSaveModal = document.getElementById('closeSaveModal');
const confirmSaveBtn = document.getElementById('confirmSaveBtn');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');
const recordingNameInput = document.getElementById('recordingNameInput');
const savedRecordingsList = document.getElementById('savedRecordingsList');
const refreshSavedBtn = document.getElementById('refreshSavedBtn');
const editModeBtn = document.getElementById('editModeBtn');
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editStepsList = document.getElementById('editStepsList');
const addStepBtn = document.getElementById('addStepBtn');
const reorderStepsBtn = document.getElementById('reorderStepsBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveEditsBtn = document.getElementById('saveEditsBtn');
let isEditMode = false;
let isReordering = false;

// Initialize
chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
  if (response) {
    steps = response.steps || [];
    isRecording = response.isRecording || false;
    isPaused = response.isPaused || false;
    updateUI();
    loadSavedRecordings();
  }
});

// Debug: Check if notification element exists
if (copyNotification) {
  console.log('✓ Copy notification element found in DOM on init');
} else {
  console.error('✗ Copy notification element NOT found in DOM on init!');
  console.error('This might cause the notification not to appear. Check popup.html');
}

// Load saved recordings
function loadSavedRecordings() {
  chrome.runtime.sendMessage({ action: 'getSavedRecordings' }, (response) => {
    if (response && response.recordings) {
      displaySavedRecordings(response.recordings);
    }
  });
}

// Display saved recordings
function displaySavedRecordings(recordings) {
  if (!recordings || recordings.length === 0) {
    savedRecordingsList.innerHTML = '<p class="empty-state">No saved recordings. Save your recording to access it later.</p>';
    return;
  }
  
  // Sort by date (newest first)
  recordings.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  
  savedRecordingsList.innerHTML = recordings.map((recording, index) => {
    const date = new Date(recording.savedAt);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    return `
      <div class="saved-recording-item">
        <div class="saved-recording-info">
          <div class="saved-recording-name">${escapeHtml(recording.name)}</div>
          <div class="saved-recording-meta">
            ${recording.steps.length} steps • ${dateStr}
          </div>
        </div>
        <div class="saved-recording-actions">
          <button class="btn-load-recording" data-id="${recording.id}" title="Load this recording">📂 Load</button>
          <button class="btn-delete-recording" data-id="${recording.id}" title="Delete this recording">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners
  document.querySelectorAll('.btn-load-recording').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      loadRecording(id);
    });
  });
  
  document.querySelectorAll('.btn-delete-recording').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (confirm('Delete this saved recording?')) {
        chrome.runtime.sendMessage({ action: 'deleteSavedRecording', id: id }, (response) => {
          if (response && response.success) {
            loadSavedRecordings();
          }
        });
      }
    });
  });
}

// Load a saved recording
function loadRecording(id) {
  chrome.runtime.sendMessage({ action: 'loadSavedRecording', id: id }, (response) => {
    if (response && response.success && response.steps) {
      steps = response.steps;
      updateUI();
      // Show confirmation
      const confirmMsg = document.createElement('div');
      confirmMsg.textContent = '✓ Recording loaded';
      confirmMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(confirmMsg);
      setTimeout(() => confirmMsg.remove(), 2000);
    }
  });
}

// Start recording
startBtn.addEventListener('click', () => {
  // Check if we should clear existing steps (ask user if there are existing steps)
  const shouldClear = steps.length === 0 || confirm('Start a new recording? This will clear existing steps.');
  
  chrome.runtime.sendMessage({ 
    action: 'startRecording',
    clearSteps: shouldClear // Explicitly pass true or false, never undefined
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error starting recording:', chrome.runtime.lastError);
      alert('Error starting recording: ' + chrome.runtime.lastError.message);
      return;
    }
    
    if (response && response.success) {
      isRecording = true;
      isPaused = false;
      if (shouldClear) {
        steps = [];
      }
      updateUI();
      
      // Screen recording is optional and not essential for step recording
      // Skip it to avoid errors - the core functionality works without it
      // chrome.runtime.sendMessage({ action: 'startScreenRecording' }, (screenResponse) => {
      //   if (screenResponse && screenResponse.success) {
      //     console.log('Screen recording started');
      //   }
      // });
      
      // Also ensure the active tab gets the message
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'startRecording' }).catch(() => {
            // If content script isn't loaded, try to inject it
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['content.js']
            }).then(() => {
              // After injection, send the start message again
              chrome.tabs.sendMessage(tabs[0].id, { action: 'startRecording' }).catch((err) => {
                console.log('Could not send start message to content script:', err);
              });
            }).catch((err) => {
              console.log('Could not inject content script:', err);
            });
          });
        }
      });
    } else {
      console.error('Failed to start recording:', response);
      alert('Failed to start recording. Please try again.');
    }
  });
});

// Stop recording
if (stopBtn) {
  stopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Stop button clicked, isRecording:', isRecording, 'disabled:', stopBtn.disabled);
    
    // Check if button is disabled
    if (stopBtn.disabled) {
      console.log('Stop button is disabled, ignoring click');
      return;
    }
    
    if (!isRecording) {
      console.log('Not recording, ignoring stop click');
      return;
    }
  
  chrome.runtime.sendMessage({ action: 'stopRecording' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error stopping recording:', chrome.runtime.lastError);
      alert('Error stopping recording: ' + chrome.runtime.lastError.message);
      return;
    }
    
    console.log('Stop recording response:', response);
    
    if (response && response.success) {
      isRecording = false;
      isPaused = false;
      steps = response.steps || [];
      console.log('Recording stopped, steps:', steps.length);
      updateUI();
      
      // Show copy notification if there are steps - use setTimeout to ensure UI is updated first
      if (steps.length > 0) {
        console.log('✓ Recording stopped with', steps.length, 'steps. Will show notification...');
        // Use a longer delay to ensure DOM is ready
        setTimeout(() => {
          console.log('→ Calling showCopyNotification now...');
          showCopyNotification();
        }, 300);
      } else {
        console.log('No steps found, notification will not be shown');
      }
    } else {
      console.error('Failed to stop recording:', response);
      // Try to update UI anyway in case the recording was stopped
      isRecording = false;
      isPaused = false;
        // Get latest steps from background
      chrome.runtime.sendMessage({ action: 'getSteps' }, (getResponse) => {
        if (getResponse) {
          steps = getResponse.steps || [];
          isRecording = getResponse.isRecording || false;
          isPaused = getResponse.isPaused || false;
        }
        updateUI();
        
        // Show copy notification if there are steps - use setTimeout to ensure UI is updated first
        if (steps.length > 0) {
          console.log('✓ Recording stopped (fallback) with', steps.length, 'steps. Will show notification...');
          setTimeout(() => {
            console.log('→ Calling showCopyNotification (fallback) now...');
            showCopyNotification();
          }, 300);
        } else {
          console.log('No steps found (fallback), notification will not be shown');
        }
      });
    }
  });
  });
} else {
  console.error('Cannot attach stop button listener - button not found');
}

// Pause/Resume recording
pauseBtn.addEventListener('click', () => {
  if (isPaused) {
    chrome.runtime.sendMessage({ action: 'resumeRecording' }, (response) => {
      if (response && response.success) {
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        pauseBtn.classList.remove('btn-warning');
        pauseBtn.classList.add('btn-warning');
        updateUI();
      }
    });
  } else {
    chrome.runtime.sendMessage({ action: 'pauseRecording' }, (response) => {
      if (response && response.success) {
        isPaused = true;
        pauseBtn.textContent = 'Resume';
        updateUI();
      }
    });
  }
});

// Clear steps
clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all recorded steps?')) {
    chrome.runtime.sendMessage({ action: 'clearSteps' }, (response) => {
      if (response && response.success) {
        steps = [];
        updateUI();
      }
    });
  }
});

// Undo last step
undoBtn.addEventListener('click', () => {
  if (steps.length > 0) {
    chrome.runtime.sendMessage({ action: 'removeLastStep' }, (response) => {
      if (response && response.success) {
        steps = response.steps || [];
        updateUI();
      }
    });
  }
});

// Save recording
saveBtn.addEventListener('click', () => {
  if (steps.length > 0) {
    recordingNameInput.value = `Recording ${new Date().toLocaleString()}`;
    saveModal.style.display = 'block';
    recordingNameInput.focus();
  }
});

// Confirm save
confirmSaveBtn.addEventListener('click', () => {
  const name = recordingNameInput.value.trim();
  if (!name) {
    alert('Please enter a name for the recording');
    return;
  }
  
  chrome.runtime.sendMessage({ 
    action: 'saveRecording', 
    name: name,
    steps: steps 
  }, (response) => {
    if (response && response.success) {
      saveModal.style.display = 'none';
      loadSavedRecordings();
      // Show confirmation
      const confirmMsg = document.createElement('div');
      confirmMsg.textContent = '✓ Recording saved';
      confirmMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(confirmMsg);
      setTimeout(() => confirmMsg.remove(), 2000);
    }
  });
});

// Cancel save
cancelSaveBtn.addEventListener('click', () => {
  saveModal.style.display = 'none';
});

closeSaveModal.addEventListener('click', () => {
  saveModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === saveModal) {
    saveModal.style.display = 'none';
  }
});

// Refresh saved recordings
refreshSavedBtn.addEventListener('click', () => {
  loadSavedRecordings();
});

// Edit Mode toggle
editModeBtn.addEventListener('click', () => {
  isEditMode = !isEditMode;
  editModeBtn.textContent = isEditMode ? '✓ Edit Mode' : '✏️ Edit Mode';
  editModeBtn.classList.toggle('btn-active', isEditMode);
  updateUI();
});

// Export steps
exportBtn.addEventListener('click', () => {
  // Show edit modal first if there are steps
  if (steps.length > 0) {
    openEditModal();
  } else {
    updateExportOutput();
    exportModal.style.display = 'block';
  }
});

// Open edit modal
function openEditModal() {
  renderEditSteps();
  editModal.style.display = 'block';
}

// Close edit modal
closeEditModal.addEventListener('click', () => {
  editModal.style.display = 'none';
  isReordering = false;
});

cancelEditBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
  isReordering = false;
});

window.addEventListener('click', (event) => {
  if (event.target === editModal) {
    editModal.style.display = 'none';
    isReordering = false;
  }
});

// Render steps in edit modal
function renderEditSteps() {
  if (steps.length === 0) {
    editStepsList.innerHTML = '<p class="empty-state">No steps to edit</p>';
    return;
  }
  
  editStepsList.innerHTML = steps.map((step, index) => {
    return `
      <div class="edit-step-item" data-index="${index}">
        <div class="edit-step-handle" title="Drag to reorder">☰</div>
        <div class="edit-step-number">${index + 1}</div>
        <div class="edit-step-fields">
          <div class="edit-field-group">
            <label>Action:</label>
            <input type="text" class="edit-step-action" value="${escapeHtml(step.action)}" data-index="${index}">
          </div>
          <div class="edit-field-group">
            <label>Element:</label>
            <input type="text" class="edit-step-element" value="${escapeHtml(step.element || '')}" data-index="${index}">
          </div>
          <div class="edit-field-group">
            <label>Value:</label>
            <input type="text" class="edit-step-value" value="${escapeHtml(step.value || '')}" data-index="${index}" placeholder="Optional">
          </div>
          <div class="edit-step-meta">
            <span class="edit-step-url">${new URL(step.url).hostname}</span>
            ${step.selector ? `<span class="edit-step-selector">${step.selector.substring(0, 50)}${step.selector.length > 50 ? '...' : ''}</span>` : ''}
          </div>
        </div>
        <div class="edit-step-actions">
          <button class="btn-delete-step-inline" data-index="${index}" title="Delete step">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners
  document.querySelectorAll('.edit-step-action, .edit-step-element, .edit-step-value').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      // Auto-save on change (optional - or save on button click)
    });
  });
  
  document.querySelectorAll('.btn-delete-step-inline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (confirm(`Delete step ${index + 1}?`)) {
        steps.splice(index, 1);
        renderEditSteps();
      }
    });
  });
  
  // Make steps draggable for reordering
  makeStepsDraggable();
}

// Make steps draggable
function makeStepsDraggable() {
  const stepItems = document.querySelectorAll('.edit-step-item');
  let draggedElement = null;
  
  stepItems.forEach(item => {
    item.draggable = true;
    
    item.addEventListener('dragstart', (e) => {
      draggedElement = item;
      item.style.opacity = '0.5';
      e.dataTransfer.effectAllowed = 'move';
    });
    
    item.addEventListener('dragend', () => {
      item.style.opacity = '1';
      draggedElement = null;
    });
    
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const afterElement = getDragAfterElement(editStepsList, e.clientY);
      if (afterElement == null) {
        editStepsList.appendChild(item);
      } else {
        editStepsList.insertBefore(item, afterElement);
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.edit-step-item:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Add new step
addStepBtn.addEventListener('click', () => {
  const newStep = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    action: 'Custom Action',
    element: 'Element',
    value: null,
    url: steps.length > 0 ? steps[0].url : window.location.href,
    selector: '',
    description: 'Custom step'
  };
  steps.push(newStep);
  renderEditSteps();
});

// Reorder steps
reorderStepsBtn.addEventListener('click', () => {
  isReordering = !isReordering;
  reorderStepsBtn.textContent = isReordering ? '✓ Done Reordering' : '🔄 Reorder';
  reorderStepsBtn.classList.toggle('btn-active', isReordering);
  
  document.querySelectorAll('.edit-step-item').forEach(item => {
    item.style.cursor = isReordering ? 'move' : 'default';
  });
});

// Save edits
saveEditsBtn.addEventListener('click', () => {
  // Collect all edited values
  const editedSteps = [];
  document.querySelectorAll('.edit-step-item').forEach((item, index) => {
    const action = item.querySelector('.edit-step-action').value;
    const element = item.querySelector('.edit-step-element').value;
    const value = item.querySelector('.edit-step-value').value;
    const originalIndex = parseInt(item.dataset.index);
    const originalStep = steps[originalIndex];
    
    editedSteps.push({
      ...originalStep,
      action: action,
      element: element,
      value: value || null,
      description: `${index + 1}. ${action} ${element}${value ? ` with value "${value}"` : ''}`
    });
  });
  
  // Update steps
  steps = editedSteps;
  
  // Save to background
  chrome.runtime.sendMessage({ 
    action: 'updateAllSteps', 
    steps: steps 
  }, (response) => {
    if (response && response.success) {
      editModal.style.display = 'none';
      updateUI();
      // Now show export modal
      updateExportOutput();
      exportModal.style.display = 'block';
    }
  });
});

// Format selector change
formatSelector.addEventListener('change', () => {
  updateExportOutput();
});

// Update export output based on selected format
function updateExportOutput() {
  const format = formatSelector.value;
  let output = '';
  
  switch(format) {
    case 'jira':
      output = formatStepsForJira(steps);
      break;
    case 'markdown':
      output = formatStepsForMarkdown(steps);
      break;
    case 'html':
      output = formatStepsForHTML(steps);
      break;
    case 'plaintext':
      output = formatStepsForPlainText(steps);
      break;
    case 'json':
      output = formatStepsForJSON(steps);
      break;
  }
  
  jiraOutput.value = output;
  
  // Show/hide download screenshots button and preview button based on whether there are screenshots
  const hasScreenshots = steps.some(step => step.screenshot);
  if (downloadScreenshotsBtn) {
    downloadScreenshotsBtn.style.display = hasScreenshots ? 'inline-block' : 'none';
  }
  if (openPreviewBtn) {
    openPreviewBtn.style.display = hasScreenshots ? 'inline-block' : 'none';
  }
}

// Download file
downloadBtn.addEventListener('click', () => {
  const format = formatSelector.value;
  const content = jiraOutput.value;
  const extension = format === 'json' ? 'json' : 
                   format === 'html' ? 'html' : 
                   format === 'markdown' ? 'md' : 'txt';
  const filename = `jira-steps-${Date.now()}.${extension}`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
});

// Download screenshots as separate files
if (downloadScreenshotsBtn) {
  downloadScreenshotsBtn.addEventListener('click', async () => {
    const stepsWithScreenshots = steps
      .map((step, index) => ({ step, stepNum: index + 1 }))
      .filter(item => item.step.screenshot);
    
    if (stepsWithScreenshots.length === 0) {
      alert('No screenshots available to download');
      return;
    }
    
    // Disable button during download
    downloadScreenshotsBtn.disabled = true;
    const originalText = downloadScreenshotsBtn.textContent;
    downloadScreenshotsBtn.textContent = 'Downloading...';
    
    // Download each screenshot with a delay to avoid browser blocking
    for (let i = 0; i < stepsWithScreenshots.length; i++) {
      const { step, stepNum } = stepsWithScreenshots[i];
      
      try {
        // Convert base64 data URL to blob
        const base64Data = step.screenshot.includes(',') 
          ? step.screenshot.split(',')[1] 
          : step.screenshot;
        const mimeType = step.screenshot.match(/data:([^;]+);/)?.[1] || 'image/png';
        
        // Convert base64 to binary
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let j = 0; j < byteCharacters.length; j++) {
          byteNumbers[j] = byteCharacters.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `screenshot-step-${stepNum}.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Wait before next download (browsers may block multiple simultaneous downloads)
        if (i < stepsWithScreenshots.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error(`Error downloading screenshot for step ${stepNum}:`, error);
      }
    }
    
    // Re-enable button and show feedback
    downloadScreenshotsBtn.disabled = false;
    downloadScreenshotsBtn.textContent = '✓ Downloaded!';
    downloadScreenshotsBtn.style.background = '#4CAF50';
    setTimeout(() => {
      downloadScreenshotsBtn.textContent = originalText;
      downloadScreenshotsBtn.style.background = '';
    }, 2000);
  });
}

// Open preview window with images that can be copied
if (openPreviewBtn) {
  openPreviewBtn.addEventListener('click', () => {
    const formatted = formatStepsForClipboardWithScreenshots(steps);
    
    // Create a new window with the formatted HTML
    const previewWindow = window.open('', '_blank', 'width=1000,height=800');
    if (previewWindow) {
      previewWindow.document.write(formatted.html);
      previewWindow.document.close();
      
      // Show instructions
      setTimeout(() => {
        alert('Preview window opened! You can:\n1. Right-click on images and "Copy Image"\n2. Paste them directly into Jira\n3. Or use the text format below each image');
      }, 500);
    } else {
      alert('Please allow popups to open the preview window');
    }
  });
}

// Copy to clipboard (from export modal)
copyBtn.addEventListener('click', async () => {
  const format = formatSelector.value;
  
  // For Jira format, try to copy with screenshots
  if (format === 'jira') {
    const formatted = formatStepsForClipboardWithScreenshots(steps);
    const jiraText = jiraOutput.value;
    
    // Use modern Clipboard API to copy both HTML (with images) and plain text
    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        const clipboardItem = new ClipboardItem({
          'text/html': new Blob([formatted.html], { type: 'text/html' }),
          'text/plain': new Blob([jiraText], { type: 'text/plain' })
        });
        
        await navigator.clipboard.write([clipboardItem]);
  
  // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#4CAF50';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = '';
        }, 2000);
        return;
      } catch (err) {
        console.error('Failed to copy with images:', err);
        // Fall through to text-only fallback
      }
    }
  }
  
  // Fallback to text-only copy
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jiraOutput.value).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      copyBtn.style.background = '#4CAF50';
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }).catch(() => {
      // Final fallback
      jiraOutput.select();
      document.execCommand('copy');
  const originalText = copyBtn.textContent;
  copyBtn.textContent = '✓ Copied!';
  copyBtn.style.background = '#4CAF50';
  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.style.background = '';
  }, 2000);
    });
  } else {
    // Final fallback
    jiraOutput.select();
    document.execCommand('copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.style.background = '#4CAF50';
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);
  }
});

// Copy steps directly to clipboard (quick copy button)
copyStepsBtn.addEventListener('click', async () => {
  if (steps.length === 0) {
    alert('No steps to copy');
    return;
  }
  
  // Get Jira format which now includes {html} tags with base64 images
  const jiraText = formatStepsForJira(steps);
  
  // Also create HTML version for clipboard
  const formatted = formatStepsForClipboardWithScreenshots(steps);
  
  // Use modern Clipboard API to copy both HTML (with images) and plain text
  // The plain text includes {html} tags which Jira might render
  if (navigator.clipboard && navigator.clipboard.write) {
    try {
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([formatted.html], { type: 'text/html' }),
        'text/plain': new Blob([jiraText], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
      
      // Show feedback
      const originalText = copyStepsBtn.textContent;
      copyStepsBtn.textContent = '✓ Copied!';
      copyStepsBtn.style.background = '#4CAF50';
      setTimeout(() => {
        copyStepsBtn.textContent = originalText;
        copyStepsBtn.style.background = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy with images:', err);
      // Fallback to text-only copy (which includes {html} tags)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jiraText).then(() => {
          const originalText = copyStepsBtn.textContent;
          copyStepsBtn.textContent = '✓ Copied!';
          copyStepsBtn.style.background = '#4CAF50';
          setTimeout(() => {
            copyStepsBtn.textContent = originalText;
            copyStepsBtn.style.background = '';
          }, 2000);
        }).catch(() => {
          copyToClipboardFallback(jiraText);
        });
      } else {
        copyToClipboardFallback(jiraText);
      }
    }
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    // Fallback to text-only if ClipboardItem not supported
    // The text includes {html} tags with base64 images
    navigator.clipboard.writeText(jiraText).then(() => {
      const originalText = copyStepsBtn.textContent;
      copyStepsBtn.textContent = '✓ Copied!';
      copyStepsBtn.style.background = '#4CAF50';
      setTimeout(() => {
        copyStepsBtn.textContent = originalText;
        copyStepsBtn.style.background = '';
      }, 2000);
    }).catch(() => {
      copyToClipboardFallback(jiraText);
    });
  } else {
    // Final fallback to execCommand
    copyToClipboardFallback(jiraText);
  }
});

// Show copy notification after stopping recording
let notificationTimeout = null;
let notificationTimeoutSeconds = 20; // Default 20 seconds, configurable

// Load notification timeout from storage
chrome.storage.local.get(['notificationTimeout'], (result) => {
  if (result.notificationTimeout) {
    notificationTimeoutSeconds = parseInt(result.notificationTimeout) || 20;
  }
  if (notificationTimeoutInput) {
    notificationTimeoutInput.value = notificationTimeoutSeconds;
  }
});

function showCopyNotification() {
  console.log('=== showCopyNotification called ===');
  console.log('Steps count:', steps.length);
  
  // Try to get the element again in case it wasn't found initially
  let notification = document.getElementById('copyNotification');
  
  // If not found, wait a bit and try again (DOM might not be ready)
  if (!notification) {
    console.warn('Notification element not found, waiting 100ms and retrying...');
    setTimeout(() => {
      notification = document.getElementById('copyNotification');
      if (notification) {
        showNotificationNow(notification);
      } else {
        console.error('Copy notification element STILL not found in DOM after retry');
        alert('Error: Notification popup element not found. Please reload the extension.');
      }
    }, 100);
    return;
  }
  
  showNotificationNow(notification);
}

function showNotificationNow(notification) {
  console.log('=== showNotificationNow called ===');
  console.log('Notification element:', notification);
  
  // Clear any existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  
  // Remove hiding class if present
  notification.classList.remove('hiding');
  
  // Force show the notification with all necessary styles
  notification.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 99999 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  `;
  
  // Force a reflow
  void notification.offsetHeight;
  
  // Ensure buttons container and buttons are visible
  const actionsContainer = notification.querySelector('.copy-notification-actions');
  const previewBtn = document.getElementById('previewNotificationBtn');
  const copyBtn = document.getElementById('copyNotificationBtn');
  
  if (actionsContainer) {
    actionsContainer.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; gap: 8px !important; justify-content: flex-end !important; margin-top: 16px !important; width: 100% !important;';
    console.log('✓ Actions container found and made visible');
  } else {
    console.error('✗ Actions container NOT found!');
  }
  
  if (previewBtn) {
    previewBtn.style.cssText = 'display: inline-block !important; visibility: visible !important; opacity: 1 !important; padding: 10px 20px !important; font-size: 14px !important; min-width: 120px !important; cursor: pointer !important;';
    console.log('✓ Preview button found and made visible');
    console.log('Preview button computed style:', window.getComputedStyle(previewBtn).display);
  } else {
    console.error('✗ Preview button NOT found!');
  }
  
  if (copyBtn) {
    copyBtn.style.cssText = 'display: inline-block !important; visibility: visible !important; opacity: 1 !important; padding: 10px 20px !important; font-size: 14px !important; min-width: 120px !important; cursor: pointer !important;';
    console.log('✓ Copy button found and made visible');
    console.log('Copy button computed style:', window.getComputedStyle(copyBtn).display);
  } else {
    console.error('✗ Copy button NOT found!');
  }
  
  // Verify visibility
  const computedStyle = window.getComputedStyle(notification);
  console.log('Notification computed styles:', {
    display: computedStyle.display,
    visibility: computedStyle.visibility,
    opacity: computedStyle.opacity,
    zIndex: computedStyle.zIndex,
    position: computedStyle.position
  });
  
  // Auto-hide after configured seconds (default 20)
  notificationTimeout = setTimeout(() => {
    console.log('Auto-hiding notification after', notificationTimeoutSeconds, 'seconds');
    hideCopyNotification();
  }, notificationTimeoutSeconds * 1000);
  
  console.log('✓ Notification should be visible now!');
  console.log('✓ Timeout set to', notificationTimeoutSeconds, 'seconds');
}

function hideCopyNotification() {
  const notification = document.getElementById('copyNotification');
  if (!notification) return;
  
  // Clear timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
  
  // Add hiding animation class
  notification.classList.add('hiding');
  
  // Hide after animation
  setTimeout(() => {
    notification.style.display = 'none';
    notification.classList.remove('hiding');
  }, 300);
}

// Copy button in notification
if (copyNotificationBtn) {
  copyNotificationBtn.addEventListener('click', () => {
    // Trigger the same copy action as the main copy button
    if (copyStepsBtn && !copyStepsBtn.disabled) {
      copyStepsBtn.click();
    }
    hideCopyNotification();
  });
}

// Preview button in notification
if (previewNotificationBtn) {
  previewNotificationBtn.addEventListener('click', () => {
    // Open preview window
    const formatted = formatStepsForClipboardWithScreenshots(steps);
    const previewWindow = window.open('', '_blank', 'width=1000,height=800');
    if (previewWindow) {
      previewWindow.document.write(formatted.html);
      previewWindow.document.close();
    } else {
      alert('Please allow popups to open the preview window');
    }
    // Don't hide notification when opening preview
  });
}

// Close button in notification
if (closeNotificationBtn) {
  closeNotificationBtn.addEventListener('click', () => {
    hideCopyNotification();
  });
}

// Settings functionality
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    if (settingsModal) {
      settingsModal.style.display = 'block';
      if (notificationTimeoutInput) {
        notificationTimeoutInput.value = notificationTimeoutSeconds;
      }
    }
  });
}

// Close settings modal
if (closeSettingsModal) {
  closeSettingsModal.addEventListener('click', () => {
    if (settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
}

if (cancelSettingsBtn) {
  cancelSettingsBtn.addEventListener('click', () => {
    if (settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
}

// Save settings
if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener('click', () => {
    if (notificationTimeoutInput) {
      const newTimeout = parseInt(notificationTimeoutInput.value) || 20;
      if (newTimeout >= 5 && newTimeout <= 120) {
        notificationTimeoutSeconds = newTimeout;
        chrome.storage.local.set({ notificationTimeout: newTimeout }, () => {
          if (settingsModal) {
            settingsModal.style.display = 'none';
          }
          alert(`Notification timeout set to ${newTimeout} seconds`);
        });
      } else {
        alert('Please enter a value between 5 and 120 seconds');
      }
    }
  });
}

// Close settings modal when clicking outside
window.addEventListener('click', (event) => {
  if (settingsModal && event.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

// Fallback copy function using execCommand
function copyToClipboardFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    // Show feedback
    const originalText = copyStepsBtn.textContent;
    copyStepsBtn.textContent = '✓ Copied!';
    copyStepsBtn.style.background = '#4CAF50';
    setTimeout(() => {
      copyStepsBtn.textContent = originalText;
      copyStepsBtn.style.background = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard. Please try using the Export button.');
  } finally {
    document.body.removeChild(textarea);
  }
}

// Close modal
closeModal.addEventListener('click', () => {
  exportModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === exportModal) {
    exportModal.style.display = 'none';
  }
});

// Update UI
function updateUI() {
  // Update buttons
  startBtn.disabled = isRecording;
  if (stopBtn) {
  stopBtn.disabled = !isRecording;
    // Ensure button is clickable when enabled (when recording is active)
    if (isRecording) {
      stopBtn.style.pointerEvents = 'auto';
      stopBtn.style.opacity = '1';
      stopBtn.style.cursor = 'pointer';
    } else {
      stopBtn.style.pointerEvents = 'none';
      stopBtn.style.opacity = '0.5';
      stopBtn.style.cursor = 'not-allowed';
    }
  }
  pauseBtn.disabled = !isRecording;
  undoBtn.disabled = steps.length === 0;
  // Clear button should be enabled when there are steps (even during recording)
  clearBtn.disabled = steps.length === 0;
  
  if (isPaused) {
    pauseBtn.textContent = 'Resume';
    pauseBtn.classList.add('btn-success');
    pauseBtn.classList.remove('btn-warning');
  } else {
    pauseBtn.textContent = 'Pause';
    pauseBtn.classList.remove('btn-success');
    pauseBtn.classList.add('btn-warning');
  }
  
  // Update status
  if (isPaused) {
    statusText.textContent = '⏸️ Paused';
    statusText.style.color = '#ffa500';
  } else if (isRecording) {
    statusText.textContent = '🔴 Recording...';
    statusText.style.color = '#ff4444';
  } else {
    statusText.textContent = 'Ready to record';
    statusText.style.color = '#666';
  }
  
  // Update step count
  stepCount.textContent = steps.length > 0 ? `${steps.length} step${steps.length !== 1 ? 's' : ''}` : '';
  
  // Show/hide copy steps button - show when not recording and there are steps
  if (copyStepsBtn) {
    if (!isRecording && steps.length > 0) {
      copyStepsBtn.style.display = 'inline-block';
    } else {
      copyStepsBtn.style.display = 'none';
    }
  }
  
  // Update steps list
  if (steps.length === 0) {
    stepsList.innerHTML = '<p class="empty-state">No steps recorded yet. Click "Start Recording" to begin.</p>';
  } else {
    stepsList.innerHTML = steps.map((step, index) => {
      const isEditing = editingStepIndex === index;
      return `
      <div class="step-item" data-step-index="${index}">
        <div class="step-number">${index + 1}</div>
        <div class="step-content">
          ${isEditing ? `
            <div class="step-edit-form">
              <input type="text" class="step-edit-action" value="${escapeHtml(step.action)}" placeholder="Action">
              <input type="text" class="step-edit-element" value="${escapeHtml(step.element)}" placeholder="Element">
              <input type="text" class="step-edit-value" value="${escapeHtml(step.value || '')}" placeholder="Value (optional)">
              <div class="step-edit-actions">
                <button class="btn-edit-save" data-index="${index}">Save</button>
                <button class="btn-edit-cancel" data-index="${index}">Cancel</button>
                <button class="btn-edit-delete" data-index="${index}">Delete</button>
              </div>
            </div>
          ` : `
            <div class="step-display">
              <div class="step-action">${step.action}</div>
              <div class="step-element">${step.element}</div>
              ${step.value ? `<div class="step-value">Value: ${step.value}</div>` : ''}
              <div class="step-url">${new URL(step.url).hostname}</div>
            </div>
            <div class="step-actions">
              <button class="btn-edit" data-index="${index}" title="Edit step">✏️</button>
              <button class="btn-delete-step" data-index="${index}" title="Delete step">🗑️</button>
            </div>
          `}
        </div>
      </div>
    `;
    }).join('');
    
    // Add event listeners for edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        editingStepIndex = index;
        updateUI();
      });
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.btn-delete-step').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (confirm(`Delete step ${index + 1}?`)) {
          chrome.runtime.sendMessage({ action: 'removeStep', index: index }, (response) => {
            if (response && response.success) {
              steps = response.steps || [];
              editingStepIndex = null;
              updateUI();
            }
          });
        }
      });
    });
    
    // Add event listeners for save/cancel/delete
    document.querySelectorAll('.btn-edit-save').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const stepItem = document.querySelector(`[data-step-index="${index}"]`);
        const action = stepItem.querySelector('.step-edit-action').value;
        const element = stepItem.querySelector('.step-edit-element').value;
        const value = stepItem.querySelector('.step-edit-value').value;
        
        chrome.runtime.sendMessage({ 
          action: 'updateStep', 
          index: index,
          step: { ...steps[index], action, element, value: value || null }
        }, (response) => {
          if (response && response.success) {
            steps = response.steps || [];
            editingStepIndex = null;
            updateUI();
          }
        });
      });
    });
    
    document.querySelectorAll('.btn-edit-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        editingStepIndex = null;
        updateUI();
      });
    });
    
    document.querySelectorAll('.btn-edit-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (confirm('Delete this step?')) {
          chrome.runtime.sendMessage({ action: 'removeStep', index: index }, (response) => {
            if (response && response.success) {
              steps = response.steps || [];
              editingStepIndex = null;
              updateUI();
            }
          });
        }
      });
    });
  }
  
  // Update export, save, and edit mode buttons
  exportBtn.disabled = steps.length === 0;
  saveBtn.disabled = steps.length === 0;
  editModeBtn.disabled = steps.length === 0;
  
  // Update edit mode button state
  if (isEditMode) {
    editModeBtn.textContent = '✓ Edit Mode';
    editModeBtn.classList.add('btn-active');
  } else {
    editModeBtn.textContent = '✏️ Edit Mode';
    editModeBtn.classList.remove('btn-active');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format steps with screenshots for clipboard (HTML format with embedded images)
function formatStepsForClipboardWithScreenshots(steps) {
  if (steps.length === 0) {
    return { html: '<p>No steps recorded.</p>', text: 'No steps recorded.' };
  }
  
  // Apply same cleaning logic as formatStepsForJira
  const cleanedSteps = [];
  let lastStep = null;
  let lastUrl = null;
  
  steps.forEach((step, index) => {
    // Skip duplicate consecutive steps
    if (lastStep && 
        lastStep.action === step.action && 
        lastStep.element === step.element && 
        lastStep.url === step.url &&
        lastStep.value === step.value) {
      return;
    }
    
    // Skip navigation steps that are redundant
    if (step.action === 'Navigate to' && step.url === lastUrl) {
      return;
    }
    
    // Skip clicks on generic elements
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
    return { html: '<p>No meaningful steps recorded.</p>', text: 'No meaningful steps recorded.' };
  }
  
  // Build HTML with embedded screenshots
  let htmlOutput = '<div style="font-family: Arial, sans-serif; line-height: 1.6;">';
  htmlOutput += '<h2 style="color: #0052CC; border-bottom: 2px solid #0052CC; padding-bottom: 5px;">Steps to Reproduce</h2>';
  
  // Build plain text version
  let textOutput = 'Steps to Reproduce\n\n';
  
  let stepNum = 0;
  cleanedSteps.forEach((step, index) => {
    if (step.action === 'Navigate to' && step.element === 'body') {
      if (index === 0 || (index > 0 && cleanedSteps[index - 1].url !== step.url)) {
        stepNum++;
        const urlObj = new URL(step.url);
        htmlOutput += `<p><strong>${stepNum}.</strong> Navigate to ${escapeHtml(urlObj.pathname)}</p>`;
        textOutput += `${stepNum}. Navigate to ${urlObj.pathname}\n\n`;
      }
      return;
    }
    
    stepNum++;
    
    // Format step text
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
    
    // Add to HTML with screenshot
    htmlOutput += `<div style="margin: 15px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #0052CC; border-radius: 4px;">`;
    htmlOutput += `<p style="margin: 0 0 10px 0;"><strong>${escapeHtml(stepText)}</strong></p>`;
    
    // Add screenshot if available
    if (step.screenshot) {
      htmlOutput += `<img src="${step.screenshot}" alt="Screenshot for step ${stepNum}" style="max-width: 800px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; display: block;">`;
    }
    htmlOutput += `</div>`;
    
    // Add to text version
    textOutput += stepText + '\n';
    if (step.screenshot) {
      textOutput += `\n[Screenshot available for this step]\n`;
    }
    textOutput += '\n';
  });
  
  // Add environment info
  htmlOutput += '<hr style="margin: 20px 0;">';
  htmlOutput += '<h3 style="color: #0052CC;">Environment</h3>';
  htmlOutput += `<p><strong>Starting URL:</strong> ${escapeHtml(cleanedSteps[0].url)}</p>`;
  htmlOutput += `<p><strong>Browser:</strong> Chrome</p>`;
  htmlOutput += `<p><strong>Recorded:</strong> ${new Date(cleanedSteps[0].timestamp).toLocaleString()}</p>`;
  htmlOutput += '</div>';
  
  textOutput += '---\n\n';
  textOutput += 'Environment\n\n';
  textOutput += `Starting URL: ${cleanedSteps[0].url}\n`;
  textOutput += `Browser: Chrome\n`;
  textOutput += `Recorded: ${new Date(cleanedSteps[0].timestamp).toLocaleString()}\n`;
  
  return { html: htmlOutput, text: textOutput };
}

// Format steps for Jira
function formatStepsForJira(steps) {
  if (steps.length === 0) {
    return 'No steps recorded.';
  }
  
  // Filter and clean steps
  const cleanedSteps = [];
  let lastStep = null;
  let lastUrl = null;
  
  steps.forEach((step, index) => {
    // Skip duplicate consecutive steps
    if (lastStep && 
        lastStep.action === step.action && 
        lastStep.element === step.element && 
        lastStep.url === step.url &&
        lastStep.value === step.value) {
      return; // Skip duplicate
    }
    
    // Keep navigation steps - we'll format them better later
    // Don't skip navigation steps as they indicate URL changes
    
    // Skip clicks on generic elements (div, span, body without meaningful description)
    if (step.action === 'Click on') {
      const elementLower = (step.element || '').toLowerCase().trim();
      if (elementLower === 'div' || elementLower === 'span' || elementLower === 'body' ||
          elementLower === '' || elementLower.length < 2) {
        return; // Skip generic element clicks
      }
      // Also skip if it's just a generic HTML tag without text content
      if (elementLower.length <= 5 && !step.value) {
        return; // Skip very short generic element names
      }
    }
    
    // Skip form submissions that immediately follow a button click (redundant)
    if (step.action === 'Submit form' && lastStep && 
        lastStep.action === 'Click on' && 
        (lastStep.element.toLowerCase().includes('submit') || 
         lastStep.element.toLowerCase().includes('register') ||
         lastStep.element.toLowerCase().includes('save') ||
         lastStep.element.toLowerCase().includes('confirm'))) {
      return; // Skip redundant form submission
    }
    
    // Skip "Type in" for checkboxes if we already have "Change" (duplicate)
    if (step.action === 'Type in' && lastStep &&
        lastStep.action === 'Change' &&
        lastStep.element === step.element &&
        lastStep.url === step.url) {
      return; // Skip duplicate checkbox input
    }
    
    // Skip "Change" for checkboxes if next step is "Type in" for same element
    const nextStep = steps[index + 1];
    if (step.action === 'Change' && nextStep &&
        nextStep.action === 'Type in' &&
        nextStep.element === step.element &&
        nextStep.url === step.url) {
      // Keep the "Change" but mark to skip the next "Type in"
      cleanedSteps.push(step);
      lastStep = step;
      lastUrl = step.url;
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
  
  // Format steps sequentially without grouping by URL or page headers
  let stepNum = 0;
  cleanedSteps.forEach((step, index) => {
    // Handle navigation steps - show when URL changes
    if (step.action === 'Navigate to') {
      // Only include navigation if it's the first step or URL actually changed
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
          // If URL parsing fails, just show the URL
          output += `${stepNum}. Navigate to ${step.url}\n`;
          output += `   *URL:* ${step.url}\n\n`;
        }
      }
      return;
    }
    
    // Increment step number for all other steps
    stepNum++;
    
    // Format the step
    let stepText = `${stepNum}. ${step.action}`;
    
    // Clean up element description - always include meaningful element text
    let elementDesc = step.element;
    if (elementDesc && elementDesc.length > 0 && elementDesc !== 'body') {
      // Always include the element description if it's meaningful
      stepText += ` "${elementDesc}"`;
    }
    
    // Add value if present and meaningful
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
    
    // Add URL for each step
    output += `   *URL:* ${step.url}\n`;
    
    // Add screenshot directly in the text - try to embed it in a way Jira might accept
    if (step.screenshot) {
      // Try embedding the image using HTML img tag (some Jira instances support this)
      // Also include it as a data URL that might work with drag-and-drop or image paste
      output += `\n{html}<img src="${step.screenshot}" alt="Screenshot for step ${stepNum}" style="max-width: 800px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; display: block;">{html}\n`;
      // Also add a note for manual upload if HTML doesn't work
      output += `\n*Note: If image doesn't appear, upload screenshot-step-${stepNum}.png and reference as !screenshot-step-${stepNum}.png!*\n`;
    }
    
    output += '\n';
  });
  
  // Add environment information
  output += '---\n\n';
  output += 'h2. Environment\n\n';
  output += `*Starting URL:* ${cleanedSteps[0].url}\n`;
  output += `*Browser:* Chrome\n`;
  output += `*Recorded:* ${new Date(cleanedSteps[0].timestamp).toLocaleString()}\n`;
  
  // Add technical details section with cleaner format
  const hasTechnicalDetails = cleanedSteps.some(s => s.selector && s.selector.length < 200);
  
  if (hasTechnicalDetails) {
    output += '\n---\n\n';
    output += 'h2. Technical Details (for developers)\n\n';
    output += '{code}\n';
    cleanedSteps.forEach((step, index) => {
      output += `${index + 1}. ${step.action} - ${step.element || 'element'}\n`;
      output += `   URL: ${step.url}\n`;
      if (step.selector && step.selector.length < 200) {
        output += `   Selector: ${step.selector}\n`;
      }
      if (step.value && step.value !== step.url && step.value !== '***') {
        output += `   Value: ${step.value}\n`;
      }
      output += '\n';
    });
    output += '{code}\n';
  }
  
  return output;
}

// Format steps for Markdown
function formatStepsForMarkdown(steps) {
  if (steps.length === 0) {
    return 'No steps recorded.';
  }
  
  let output = '# Steps to Reproduce\n\n';
  
  steps.forEach((step, index) => {
    output += `## Step ${index + 1}\n\n`;
    output += `**Action:** ${step.action}\n\n`;
    output += `**Element:** ${step.element || 'N/A'}\n\n`;
    if (step.value) {
      output += `**Value:** ${step.value}\n\n`;
    }
    output += `**URL:** ${step.url}\n\n`;
    if (step.selector) {
      output += `**Selector:** \`${step.selector}\`\n\n`;
    }
    // Add screenshot if available
    if (step.screenshot) {
      output += `![Screenshot for step ${index + 1}](${step.screenshot})\n\n`;
    }
    output += '---\n\n';
  });
  
  return output;
}

// Format steps for HTML
function formatStepsForHTML(steps) {
  if (steps.length === 0) {
    return '<p>No steps recorded.</p>';
  }
  
  let output = '<!DOCTYPE html><html><head><title>Steps to Reproduce</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:800px;margin:0 auto;}h1{color:#333;}h2{color:#0052CC;border-bottom:2px solid #0052CC;padding-bottom:5px;}table{width:100%;border-collapse:collapse;margin:20px 0;}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd;}th{background:#f5f5f5;font-weight:bold;}.step-number{background:#0052CC;color:white;padding:5px 10px;border-radius:3px;display:inline-block;margin-right:10px;}</style></head><body><h1>Steps to Reproduce</h1>';
  
  steps.forEach((step, index) => {
    output += `<div style="margin:20px 0;padding:15px;background:#f9f9f9;border-left:4px solid #0052CC;border-radius:4px;">`;
    output += `<span class="step-number">${index + 1}</span>`;
    output += `<strong>${step.action}</strong> "${step.element || 'element'}"`;
    if (step.value) {
      output += ` with value "${step.value}"`;
    }
    output += `<br><small style="color:#666;">URL: ${step.url}</small>`;
    if (step.selector) {
      output += `<br><code style="background:#f0f0f0;padding:2px 5px;border-radius:2px;">${step.selector}</code>`;
    }
    // Add screenshot immediately after the step (step followed by screenshot)
    if (step.screenshot) {
      output += `<br><img src="${step.screenshot}" alt="Screenshot for step ${index + 1}" class="screenshot" style="max-width:100%;margin-top:10px;border:1px solid #ddd;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">`;
    }
    output += `</div>`;
  });
  
  output += '</body></html>';
  return output;
}

// Format steps for Plain Text
function formatStepsForPlainText(steps) {
  if (steps.length === 0) {
    return 'No steps recorded.';
  }
  
  let output = 'STEPS TO REPRODUCE\n';
  output += '='.repeat(50) + '\n\n';
  
  steps.forEach((step, index) => {
    output += `Step ${index + 1}: ${step.action} "${step.element || 'element'}"`;
    if (step.value) {
      output += ` with value "${step.value}"`;
    }
    output += '\n';
    output += `  URL: ${step.url}\n`;
    if (step.selector) {
      output += `  Selector: ${step.selector}\n`;
    }
    output += '\n';
  });
  
  return output;
}

// Format steps for JSON
function formatStepsForJSON(steps) {
  return JSON.stringify({
    title: 'Steps to Reproduce',
    recordedAt: new Date().toISOString(),
    totalSteps: steps.length,
    steps: steps.map((step, index) => ({
      stepNumber: index + 1,
      action: step.action,
      element: step.element,
      value: step.value,
      url: step.url,
      selector: step.selector,
      timestamp: step.timestamp
    }))
  }, null, 2);
}

// Refresh steps periodically when recording
setInterval(() => {
  chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
    if (response) {
      const wasRecording = isRecording;
      const wasPaused = isPaused;
      isRecording = response.isRecording || false;
      isPaused = response.isPaused || false;
      steps = response.steps || [];
      
      // If recording state changed, update UI
      if (wasRecording !== isRecording || wasPaused !== isPaused || isRecording) {
        updateUI();
      }
    }
  });
}, 1000);

// Also listen for storage changes (when recording stops from indicator)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.isRecording) {
    chrome.runtime.sendMessage({ action: 'getSteps' }, (response) => {
      if (response) {
        isRecording = response.isRecording || false;
        steps = response.steps || [];
        updateUI();
      }
    });
  }
});

