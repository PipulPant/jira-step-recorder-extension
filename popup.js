// Popup script

// ── Shared icon set (inline SVG, currentColor — no external icon font/library) ──
const ICONS = {
  play: '<svg class="icon" viewBox="0 0 16 16"><polygon points="5,3.3 13,8 5,12.7" fill="currentColor"/></svg>',
  stop: '<svg class="icon" viewBox="0 0 16 16"><rect x="4.3" y="4.3" width="7.4" height="7.4" rx="1" fill="currentColor"/></svg>',
  pause: '<svg class="icon" viewBox="0 0 16 16"><rect x="4" y="3.3" width="2.8" height="9.4" rx="0.6" fill="currentColor"/><rect x="9.2" y="3.3" width="2.8" height="9.4" rx="0.6" fill="currentColor"/></svg>',
  trash: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2.3 4.5h11.4M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.6 4.5l.6 8.3a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9l.6-8.3"/></svg>',
  video: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4.7" width="7.8" height="6.6" rx="1.2"/><path d="M10.4 6.7L14 4.9v6.2l-3.6-1.8z" fill="currentColor" stroke="none"/></svg>',
  dot: '<svg class="icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4.5" fill="currentColor"/></svg>',
  gear: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><line x1="3" y1="5" x2="13" y2="5"/><circle cx="6.3" cy="5" r="1.3" fill="currentColor" stroke="none"/><line x1="3" y1="8" x2="13" y2="8"/><circle cx="9.7" cy="8" r="1.3" fill="currentColor" stroke="none"/><line x1="3" y1="11" x2="13" y2="11"/><circle cx="7" cy="11" r="1.3" fill="currentColor" stroke="none"/></svg>',
  pencil: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M2.5 13.5l.6-3L10.5 3l3 3-7.4 7.5z"/><path d="M9 4.5l3 3"/></svg>',
  check: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,8.5 6.5,12 13,4.5"/></svg>',
  undo: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.3C6 3.3 3.3 5.4 3.3 8s2.7 4.7 5.7 3.7"/><polyline points="6.8,2.8 9,4.3 7.3,6.4"/></svg>',
  save: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M3 3h7.3L13 5.7V13H3z"/><rect x="5.3" y="3" width="4" height="3"/><rect x="5" y="9" width="6" height="4" fill="currentColor" stroke="none"/></svg>',
  clipboard: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><rect x="3.5" y="4" width="9" height="10" rx="1"/><rect x="5.3" y="2.3" width="5.4" height="2.6" rx="0.7"/></svg>',
  download: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.3v7.4M5.2 7l2.8 2.8L10.8 7"/><path d="M3 12.7h10"/></svg>',
  upload: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9.7V2.3M5.2 5l2.8-2.8L10.8 5"/><path d="M3 12.7h10"/></svg>',
  refresh: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5A5.5 5.5 0 0 0 3.4 6.3"/><polyline points="3,3 3.4,6.3 6.6,5.6"/><path d="M3 11A5.5 5.5 0 0 0 12.6 9.7"/><polyline points="13,13 12.6,9.7 9.4,10.4"/></svg>',
  eye: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M1.3 8S4 3.7 8 3.7 14.7 8 14.7 8 12 12.3 8 12.3 1.3 8 1.3 8z"/><circle cx="8" cy="8" r="2" fill="currentColor" stroke="none"/></svg>',
  folder: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M2 4.5h4.2l1.1 1.4H14v6.6H2z"/></svg>',
  camera: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><rect x="2" y="5" width="12" height="8" rx="1.3"/><path d="M5.5 5l.9-1.4h3.2L10.5 5"/><circle cx="8" cy="9" r="2.1"/></svg>',
  note: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="2.3" width="10" height="11.4" rx="1"/><line x1="5.3" y1="6" x2="10.7" y2="6"/><line x1="5.3" y1="9" x2="10.7" y2="9"/></svg>',
  grip: '<svg class="icon" viewBox="0 0 16 16"><circle cx="5.3" cy="4" r="1.1" fill="currentColor"/><circle cx="10.7" cy="4" r="1.1" fill="currentColor"/><circle cx="5.3" cy="8" r="1.1" fill="currentColor"/><circle cx="10.7" cy="8" r="1.1" fill="currentColor"/><circle cx="5.3" cy="12" r="1.1" fill="currentColor"/><circle cx="10.7" cy="12" r="1.1" fill="currentColor"/></svg>'
};

let steps = [];
let isRecording = false;
let isPaused = false;
let editingStepIndex = null;
let editingNoteIndex = null;

// ── Environment info ───────────────────────────────────────────────
function getEnvironmentInfo() {
  return {
    browser: navigator.userAgent.match(/Chrome\/[\d.]+/)?.[0] || 'Chrome',
    os: navigator.platform || (navigator.userAgentData && navigator.userAgentData.platform) || 'Unknown OS',
    viewport: `${window.screen.width}×${window.screen.height}`,
    timestamp: new Date().toLocaleString()
  };
}

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
const copyStepsBtn = document.getElementById('copyStepsFooterBtn');
const stepsFooter = document.getElementById('stepsFooter');
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
const reportTitleInput = document.getElementById('reportTitleInput');
const saveBtn = document.getElementById('saveBtn');
const saveModal = document.getElementById('saveModal');
const closeSaveModal = document.getElementById('closeSaveModal');
const confirmSaveBtn = document.getElementById('confirmSaveBtn');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');
const recordingNameInput = document.getElementById('recordingNameInput');
const savedRecordingsList = document.getElementById('savedRecordingsList');
const refreshSavedBtn = document.getElementById('refreshSavedBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const editModeBtn = document.getElementById('editModeBtn');
const videoBtn = document.getElementById('videoBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editStepsList = document.getElementById('editStepsList');
const addStepBtn = document.getElementById('addStepBtn');
const reorderStepsBtn = document.getElementById('reorderStepsBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveEditsBtn = document.getElementById('saveEditsBtn');
let isEditMode = false;
let isReordering = false;

// ── Populate static icon buttons (toggled-state buttons set their own icon elsewhere) ──
startBtn.innerHTML = ICONS.play + ' Start';
stopBtn.innerHTML = ICONS.stop + ' Stop';
clearBtn.innerHTML = ICONS.trash + ' Clear';
videoBtn.innerHTML = ICONS.video;
settingsBtn.innerHTML = ICONS.gear;
editModeBtn.innerHTML = ICONS.pencil;
undoBtn.innerHTML = ICONS.undo;
deleteAllBtn.innerHTML = ICONS.trash;
saveBtn.innerHTML = ICONS.save;
copyStepsBtn.innerHTML = ICONS.clipboard + ' Copy';
downloadReportBtn.innerHTML = ICONS.download + ' Report';
exportBtn.innerHTML = ICONS.upload + ' Export';
refreshSavedBtn.innerHTML = ICONS.refresh;
copyBtn.innerHTML = ICONS.clipboard + ' Copy to Clipboard';
downloadBtn.innerHTML = ICONS.download + ' Download';
if (downloadScreenshotsBtn) downloadScreenshotsBtn.innerHTML = ICONS.camera + ' Screenshots';
if (openPreviewBtn) openPreviewBtn.innerHTML = ICONS.eye + ' Preview';
reorderStepsBtn.innerHTML = ICONS.refresh + ' Reorder';
if (previewNotificationBtn) previewNotificationBtn.innerHTML = ICONS.eye + ' Preview Steps';
const copyNotificationIconEl = document.querySelector('.copy-notification-icon');
if (copyNotificationIconEl) copyNotificationIconEl.innerHTML = ICONS.clipboard.replace('class="icon"', 'class="icon icon-lg"');

// Video recording state
let videoRecordingEnabled = false;
let mediaRecorder = null;
let videoChunks = [];
let videoStream = null;

// ── Video recording helpers ──────────────────────────────────────
function stopVideoRecording(autoSave) {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    // Clean up stream if any
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
    return;
  }
  mediaRecorder.onstop = () => {
    if (videoChunks.length > 0) {
      const blob = new Blob(videoChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `screen-recording-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
    videoChunks = [];
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
    mediaRecorder = null;
    if (videoBtn) {
      videoBtn.innerHTML = ICONS.video;
      videoBtn.classList.remove('btn-video-active');
    }
  };
  try { mediaRecorder.stop(); } catch (_) {}
}

// Video toggle button
if (videoBtn) {
  videoBtn.addEventListener('click', () => {
    if (isRecording) {
      // If recording is active, stop/download video immediately
      stopVideoRecording(true);
      videoRecordingEnabled = false;
      videoBtn.classList.remove('btn-video-active');
      videoBtn.innerHTML = ICONS.video;
      return;
    }
    videoRecordingEnabled = !videoRecordingEnabled;
    videoBtn.classList.toggle('btn-video-active', videoRecordingEnabled);
    videoBtn.title = videoRecordingEnabled
      ? 'Video ON — will capture screen when you click ▶ Start (click to disable)'
      : 'Enable screen video recording alongside step capture';
  });
}

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
let activeTagFilter = null; // module-level for tag filter state

function displaySavedRecordings(recordings) {
  const savedSearchRow = document.getElementById('savedSearchRow');
  const savedTagFilterRow = document.getElementById('savedTagFilterRow');

  if (!recordings || recordings.length === 0) {
    savedRecordingsList.innerHTML = '<p class="empty-state">No saved recordings. Save your recording to access it later.</p>';
    if (savedSearchRow) savedSearchRow.style.display = 'none';
    if (savedTagFilterRow) savedTagFilterRow.style.display = 'none';
    return;
  }

  // Sort by date (newest first)
  recordings.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

  // Show/hide search row based on recordings count
  if (savedSearchRow) {
    savedSearchRow.style.display = recordings.length >= 2 ? 'block' : 'none';
  }

  // Collect all tags across recordings
  const allTags = [];
  recordings.forEach(r => { if (r.tags && r.tags.length) r.tags.forEach(t => { if (!allTags.includes(t)) allTags.push(t); }); });

  // Build tag filter row
  if (savedTagFilterRow) {
    if (allTags.length > 0) {
      savedTagFilterRow.style.display = 'flex';
      savedTagFilterRow.innerHTML = '<span style="font-size:10px;color:#666;margin-right:4px;line-height:24px;">Filter:</span>' +
        allTags.map(tag => `<button class="tag-filter-btn tag-pill" data-tag="${escapeHtml(tag)}" style="cursor:pointer;border:1px solid #0052CC;">${escapeHtml(tag)}</button>`).join('');
      savedTagFilterRow.querySelectorAll('.tag-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.dataset.tag;
          activeTagFilter = activeTagFilter === tag ? null : tag;
          applyRecordingFilters();
          savedTagFilterRow.querySelectorAll('.tag-filter-btn').forEach(b => {
            b.style.background = b.dataset.tag === activeTagFilter ? '#0052CC' : '#DEEBFF';
            b.style.color = b.dataset.tag === activeTagFilter ? 'white' : '#0747A6';
          });
        });
      });
    } else {
      savedTagFilterRow.style.display = 'none';
    }
  }

  savedRecordingsList.innerHTML = recordings.map((recording) => {
    const date = new Date(recording.savedAt);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hasScreenshots = recording.steps.some(s => s.screenshot);
    const tags = recording.tags || [];
    const tagHtml = tags.length ? `<div style="margin-top:4px;">${tags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}</div>` : '';
    return `
      <div class="saved-recording-item" data-recording-id="${recording.id}" data-recording-name="${escapeHtml(recording.name)}" data-recording-tags="${escapeHtml((tags).join(','))}">
        <div class="saved-recording-info">
          <div class="saved-recording-name">${escapeHtml(recording.name)}</div>
          <div class="saved-recording-meta">
            ${recording.steps.length} step${recording.steps.length !== 1 ? 's' : ''} • ${dateStr}${hasScreenshots ? ` • ${ICONS.camera}` : ''}
          </div>
          ${tagHtml}
        </div>
        <div class="saved-recording-actions">
          <button class="btn-copy-saved" data-id="${recording.id}" data-js-tooltip="Copy Steps">${ICONS.clipboard}</button>
          <button class="btn-preview-saved" data-id="${recording.id}" data-js-tooltip="Preview">${ICONS.eye}</button>
          <button class="btn-report-saved" data-id="${recording.id}" data-js-tooltip="Download Report">${ICONS.download}</button>
          <button class="btn-load-recording" data-id="${recording.id}" data-js-tooltip="Load">${ICONS.folder}</button>
          <button class="btn-delete-recording" data-id="${recording.id}" data-js-tooltip="Delete">${ICONS.trash}</button>
        </div>
      </div>
    `;
  }).join('');

  // Search filter
  const savedSearchInput = document.getElementById('savedSearchInput');
  if (savedSearchInput) {
    // Remove old listener by replacing the element value approach
    savedSearchInput.oninput = applyRecordingFilters;
  }

  // Attach event listeners — use data-id to look up the full recording object
  const findRecording = (id) => recordings.find(r => r.id === id);

  document.querySelectorAll('.btn-copy-saved').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const recording = findRecording(e.target.dataset.id);
      if (!recording) return;
      const text = formatStepsForJira(recording.steps);
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      const orig = btn.innerHTML;
      btn.innerHTML = ICONS.check; btn.style.background = '#4CAF50'; btn.style.color = 'white';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
    });
  });

  document.querySelectorAll('.btn-preview-saved').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const recording = findRecording(e.target.dataset.id);
      if (!recording) return;
      const formatted = formatStepsForClipboardWithScreenshots(recording.steps);
      const previewWindow = window.open('', '_blank', 'width=1000,height=800');
      if (previewWindow) {
        previewWindow.document.write(formatted.html);
        previewWindow.document.close();
      } else {
        alert('Please allow popups to open the preview window');
      }
    });
  });

  document.querySelectorAll('.btn-report-saved').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const recording = findRecording(e.target.dataset.id);
      if (!recording) return;
      downloadHtmlReport(recording.steps);
    });
  });

  document.querySelectorAll('.btn-load-recording').forEach(btn => {
    btn.addEventListener('click', (e) => {
      loadRecording(e.target.dataset.id);
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

// Apply search + tag filters to saved recording items
function applyRecordingFilters() {
  const savedSearchInput = document.getElementById('savedSearchInput');
  const searchText = savedSearchInput ? savedSearchInput.value.toLowerCase() : '';
  document.querySelectorAll('.saved-recording-item').forEach(item => {
    const name = (item.dataset.recordingName || '').toLowerCase();
    const tags = (item.dataset.recordingTags || '').toLowerCase();
    const matchesSearch = !searchText || name.includes(searchText) || tags.includes(searchText);
    const matchesTag = !activeTagFilter || tags.split(',').map(t => t.trim()).includes(activeTagFilter.toLowerCase());
    item.style.display = matchesSearch && matchesTag ? '' : 'none';
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
startBtn.addEventListener('click', async () => {
  // Check if we should clear existing steps (ask user if there are existing steps)
  const shouldClear = steps.length === 0 || confirm('Start a new recording? This will clear existing steps.');

  // Start video recording if enabled (must be triggered by user gesture — do it here)
  if (videoRecordingEnabled) {
    try {
      videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 15, max: 30 }, cursor: 'always' },
        audio: false
      });
      videoChunks = [];
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      mediaRecorder = new MediaRecorder(videoStream, { mimeType });
      mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) videoChunks.push(e.data); };
      mediaRecorder.start(1000); // 1-second chunks for smoother progress
      videoBtn.innerHTML = ICONS.dot + ' Recording';
      videoBtn.classList.add('btn-video-active');
      // If user stops sharing screen externally, handle gracefully
      videoStream.getVideoTracks()[0].onended = () => {
        stopVideoRecording(true);
      };
    } catch (err) {
      console.warn('Video recording not started (user cancelled or denied):', err.message);
      // Don't block step recording if video fails
    }
  }

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
      // Stop video recording if active
      stopVideoRecording(false);
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
        pauseBtn.innerHTML = ICONS.pause + ' Pause';
        pauseBtn.classList.remove('btn-warning');
        pauseBtn.classList.add('btn-warning');
        updateUI();
      }
    });
  } else {
    chrome.runtime.sendMessage({ action: 'pauseRecording' }, (response) => {
      if (response && response.success) {
        isPaused = true;
        pauseBtn.innerHTML = ICONS.play + ' Resume';
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
const recordingTagsInput = document.getElementById('recordingTagsInput');
saveBtn.addEventListener('click', () => {
  if (steps.length > 0) {
    recordingNameInput.value = `Recording ${new Date().toLocaleString()}`;
    if (recordingTagsInput) recordingTagsInput.value = '';
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

  // Parse tags from input
  const tagsRaw = recordingTagsInput ? recordingTagsInput.value : '';
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  chrome.runtime.sendMessage({
    action: 'saveRecording',
    name: name,
    steps: steps,
    tags: tags
  }, (response) => {
    if (response && response.success) {
      saveModal.style.display = 'none';
      loadSavedRecordings();
      const msg = response.note ? `Saved (screenshots not stored — use Report to get them)` : 'Recording saved';
      const confirmMsg = document.createElement('div');
      confirmMsg.textContent = msg;
      confirmMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${response.note ? '#ff9800' : '#4CAF50'};
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-family: Arial, sans-serif;
        font-size: 13px;
        font-weight: bold;
        z-index: 1000000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 320px;
        text-align: center;
      `;
      document.body.appendChild(confirmMsg);
      setTimeout(() => confirmMsg.remove(), 3000);
    } else if (response && !response.success) {
      alert(`Failed to save recording: ${response.error || 'Unknown error'}. Try clearing old recordings to free up space.`);
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

// Delete All steps
if (deleteAllBtn) {
  deleteAllBtn.addEventListener('click', () => {
    if (steps.length === 0) return;
    if (confirm(`Delete all ${steps.length} recorded step${steps.length !== 1 ? 's' : ''}? This cannot be undone.`)) {
      chrome.runtime.sendMessage({ action: 'clearSteps' }, (response) => {
        if (response && response.success) {
          steps = [];
          updateUI();
        }
      });
    }
  });
}

// Edit Mode toggle
editModeBtn.addEventListener('click', () => {
  isEditMode = !isEditMode;
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
        <div class="edit-step-handle" title="Drag to reorder">${ICONS.grip}</div>
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
          <button class="btn-delete-step-inline" data-index="${index}" title="Delete step">${ICONS.trash}</button>
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
  reorderStepsBtn.innerHTML = isReordering ? (ICONS.check + ' Done Reordering') : (ICONS.refresh + ' Reorder');
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
    const originalText = downloadScreenshotsBtn.innerHTML;
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
    downloadScreenshotsBtn.innerHTML = ICONS.check + ' Downloaded!';
    downloadScreenshotsBtn.style.background = '#4CAF50';
    setTimeout(() => {
      downloadScreenshotsBtn.innerHTML = originalText;
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
  if (format === 'jira') {
    // Rich HTML copy (includes screenshots)
    await copyStepsWithImages(steps, copyBtn);
  } else {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jiraOutput.value).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = ICONS.check + ' Copied!';
        copyBtn.style.background = '#4CAF50';
        setTimeout(() => { copyBtn.innerHTML = orig; copyBtn.style.background = ''; }, 2000);
      }).catch(() => { jiraOutput.select(); document.execCommand('copy'); });
    } else {
      jiraOutput.select();
      document.execCommand('copy');
    }
  }
});

// Copy steps directly to clipboard (quick copy button) — includes screenshots
copyStepsBtn.addEventListener('click', async () => {
  if (steps.length === 0) {
    alert('No steps to copy');
    return;
  }
  await copyStepsWithImages(steps, copyStepsBtn);
});

// Download HTML report with all screenshots embedded
if (downloadReportBtn) {
  downloadReportBtn.addEventListener('click', () => {
    if (steps.length === 0) {
      alert('No steps to export');
      return;
    }
    downloadHtmlReport(steps);
  });
}

// Generate and download a self-contained HTML report with embedded screenshots
function downloadHtmlReport(stepsData) {
  const formatted = formatStepsForClipboardWithScreenshots(stepsData, true);
  const title = `${reportTitle} — ${new Date().toLocaleString()}`;
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 30px 40px; font-family: Arial, sans-serif; background: #f4f5f7; color: #333; }
    .report-wrapper { max-width: 960px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px 40px; box-shadow: 0 2px 12px rgba(0,0,0,.1); }
    h2 { color: #0052CC; border-bottom: 2px solid #0052CC; padding-bottom: 8px; }
    img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; display: block; }
    @media print { body { background: white; padding: 0; } .report-wrapper { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="report-wrapper">
    <p style="color:#666;font-size:13px;margin-bottom:20px;">Generated by Jira Step Recorder &nbsp;•&nbsp; ${escapeHtml(new Date().toLocaleString())}</p>
    ${formatted.html}
  </div>
</body>
</html>`;
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `step-recording-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  // Brief feedback
  if (downloadReportBtn) {
    const orig = downloadReportBtn.innerHTML;
    downloadReportBtn.innerHTML = ICONS.check + ' Downloaded!';
    downloadReportBtn.style.background = '#4CAF50';
    downloadReportBtn.style.color = 'white';
    setTimeout(() => { downloadReportBtn.innerHTML = orig; downloadReportBtn.style.background = ''; downloadReportBtn.style.color = ''; }, 2000);
  }
}

// Shared helper: copy steps as rich HTML (with images) + plain text fallback
async function copyStepsWithImages(stepsData, feedbackBtn) {
  const jiraText = formatStepsForJira(stepsData);
  const formatted = formatStepsForClipboardWithScreenshots(stepsData);

  const showSuccess = () => {
    if (feedbackBtn) {
      const orig = feedbackBtn.innerHTML;
      feedbackBtn.innerHTML = ICONS.check + ' Copied!';
      feedbackBtn.style.background = '#4CAF50';
      setTimeout(() => { feedbackBtn.innerHTML = orig; feedbackBtn.style.background = ''; }, 2000);
    }
    showJiraGuidePanel(stepsData);
  };

  // Try ClipboardItem (HTML + plain text — images included in HTML)
  if (navigator.clipboard && navigator.clipboard.write) {
    try {
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([formatted.html], { type: 'text/html' }),
        'text/plain': new Blob([jiraText], { type: 'text/plain' })
      });
      await navigator.clipboard.write([clipboardItem]);
      showSuccess();
      return;
    } catch (err) {
      console.log('ClipboardItem failed, trying execCommand:', err.message);
    }
  }

  // Fallback: contenteditable + execCommand — copies rich HTML including base64 images
  // NOTE: div must have real dimensions so images are rendered before selection+copy
  try {
    const tempDiv = document.createElement('div');
    tempDiv.contentEditable = 'true';
    // Position off-screen but with real width so browser renders images
    tempDiv.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0.01;width:900px;max-height:10000px;overflow:visible;pointer-events:none;';
    tempDiv.innerHTML = formatted.html;
    document.body.appendChild(tempDiv);
    // Small delay to allow browser to lay out / decode base64 images
    await new Promise(r => setTimeout(r, 50));
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    document.body.removeChild(tempDiv);
    selection.removeAllRanges();
    showSuccess();
  } catch (err) {
    console.error('execCommand copy failed:', err);
    copyToClipboardFallback(jiraText, feedbackBtn);
    showSuccess();
  }
}

// Jira Paste Guide Panel — shown after a successful clipboard copy
function showJiraGuidePanel(stepsData) {
  const panel = document.getElementById('jiraGuidePanel');
  if (!panel) return;

  // Only include steps that have screenshots
  const screenshotSteps = stepsData
    .map((step, originalIndex) => ({ step, originalIndex }))
    .filter(({ step }) => step.screenshot);

  if (screenshotSteps.length === 0) {
    // No screenshots — don't show the panel
    panel.style.display = 'none';
    return;
  }

  // Build step label for display
  function stepLabel(step) {
    const parts = [step.action];
    if (step.element) parts.push(step.element);
    if (step.value) parts.push(`"${step.value.substring(0, 30)}${step.value.length > 30 ? '…' : ''}"`);
    return parts.join(' — ');
  }

  const stepsHtml = screenshotSteps.map(({ step, originalIndex }) => `
    <div class="jira-guide-step">
      <span class="jira-guide-step-num">${originalIndex + 1}</span>
      <span class="jira-guide-step-text" title="${stepLabel(step).replace(/"/g, '&quot;')}">${stepLabel(step)}</span>
      <img class="jira-guide-thumb" src="${step.screenshot}" alt="Step ${originalIndex + 1}" title="Step ${originalIndex + 1} screenshot">
      <button class="btn-jira-guide-copy" data-index="${originalIndex}">${ICONS.camera} Copy</button>
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="jira-guide-header">
      <span class="jira-guide-success">✓ Steps copied! Now paste text in Jira, then add screenshots below:</span>
      <button class="jira-guide-close" id="jiraGuidePanelClose" title="Dismiss">✕</button>
    </div>
    ${stepsHtml}
  `;

  panel.style.display = 'block';

  // Close button
  const closeBtn = document.getElementById('jiraGuidePanelClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });
  }

  // Per-step copy buttons (same logic as .btn-copy-screenshot)
  panel.querySelectorAll('.btn-jira-guide-copy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      const step = stepsData[index];
      if (!step || !step.screenshot) return;
      const originalText = btn.innerHTML;
      try {
        const res = await fetch(step.screenshot);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        btn.innerHTML = ICONS.check;
        btn.style.background = '#4CAF50';
      } catch (err) {
        console.warn('Jira guide clipboard write failed, opening in new tab:', err);
        const tab = window.open('', '_blank');
        if (tab) {
          tab.document.write(`<img src="${step.screenshot}" style="max-width:100%;cursor:pointer;" title="Right-click → Copy Image, then paste into Jira">`);
          tab.document.title = `Step ${index + 1} Screenshot`;
        }
        btn.innerHTML = ICONS.upload;
      }
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 3000);
    });
  });
}

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

// Configurable document title used across all export formats (e.g. "Execution Steps")
let reportTitle = 'Execution Steps';
chrome.storage.local.get(['reportTitle'], (result) => {
  if (result.reportTitle) reportTitle = result.reportTitle;
  if (reportTitleInput) reportTitleInput.value = reportTitle;
});
if (reportTitleInput) {
  reportTitleInput.addEventListener('input', () => {
    reportTitle = reportTitleInput.value.trim() || 'Execution Steps';
    chrome.storage.local.set({ reportTitle: reportTitle });
    updateExportOutput();
  });
}

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
  copyNotificationBtn.addEventListener('click', async () => {
    await copyStepsWithImages(steps, copyNotificationBtn);
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
      // Load ignore patterns
      const ignorePatternsInput = document.getElementById('ignorePatternsInput');
      if (ignorePatternsInput) {
        chrome.storage.local.get(['ignorePatterns'], (result) => {
          ignorePatternsInput.value = (result.ignorePatterns || []).join('\n');
        });
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
        const ignorePatternsInput = document.getElementById('ignorePatternsInput');
        const ignorePatterns = ignorePatternsInput ? ignorePatternsInput.value.split('\n').filter(Boolean) : [];
        chrome.storage.local.set({ notificationTimeout: newTimeout, ignorePatterns: ignorePatterns }, () => {
          if (settingsModal) {
            settingsModal.style.display = 'none';
          }
          alert(`Settings saved`);
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

// Fallback copy function using execCommand (plain text)
function copyToClipboardFallback(text, feedbackBtn) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    const btn = feedbackBtn || copyStepsBtn;
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = ICONS.check + ' Copied!';
      btn.style.background = '#4CAF50';
      setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard. Please use the Export or Download Report button.');
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
    pauseBtn.innerHTML = ICONS.play + ' Resume';
    pauseBtn.classList.add('btn-success');
    pauseBtn.classList.remove('btn-warning');
  } else {
    pauseBtn.innerHTML = ICONS.pause + ' Pause';
    pauseBtn.classList.remove('btn-success');
    pauseBtn.classList.add('btn-warning');
  }
  
  // Update status
  const headerSubtitle = document.getElementById('headerSubtitle');
  if (isPaused) {
    statusText.innerHTML = ICONS.pause + ' Paused';
    statusText.style.color = '#ffa500';
    if (headerSubtitle) headerSubtitle.textContent = 'Recording paused';
  } else if (isRecording) {
    statusText.innerHTML = ICONS.dot + ' Recording...';
    statusText.style.color = '#ff4444';
    if (headerSubtitle) headerSubtitle.innerHTML = ICONS.dot + ' Recording in progress';
  } else {
    statusText.textContent = 'Ready to record';
    statusText.style.color = '#666';
    if (headerSubtitle) headerSubtitle.textContent = steps.length > 0 ? `${steps.length} step${steps.length !== 1 ? 's' : ''} captured` : 'Ready to capture your workflow';
  }
  
  // Update step count
  stepCount.textContent = steps.length > 0 ? `${steps.length} step${steps.length !== 1 ? 's' : ''}` : '';
  
  // Show/hide footer action bar (Copy + Export) — visible whenever there are steps
  if (stepsFooter) {
    stepsFooter.style.display = steps.length > 0 ? 'flex' : 'none';
  }

  // Hide Jira guide panel when steps are cleared or recording restarts
  if (steps.length === 0) {
    const jiraGuidePanel = document.getElementById('jiraGuidePanel');
    if (jiraGuidePanel) jiraGuidePanel.style.display = 'none';
  }
  
  // Update steps list
  if (steps.length === 0) {
    stepsList.innerHTML = '<p class="empty-state">No steps recorded yet. Click "Start Recording" to begin.</p>';
  } else {
    stepsList.innerHTML = steps.map((step, index) => {
      const isEditing = editingStepIndex === index;
      let hostname = '';
      try { hostname = new URL(step.url).hostname; } catch(e) { hostname = step.url; }
      const truncatedUrl = hostname.length > 30 ? hostname.substring(0, 30) + '…' : hostname;
      const hasScreenshot = !!step.screenshot;
      return `
      <div class="step-item${hasScreenshot ? ' step-has-screenshot' : ''}" data-step-index="${index}">
        <div class="step-drag-handle" draggable="true" data-index="${index}" title="Drag to reorder">${ICONS.grip}</div>
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
              <div class="step-action">${escapeHtml(step.action)}${hasScreenshot ? ` <span class="step-screenshot-badge" data-screenshot-index="${index}" title="">${ICONS.camera}</span>` : ''}</div>
              <div class="step-element">${escapeHtml(step.element || '')}</div>
              ${step.value && step.value !== '***' ? `<div class="step-value">${escapeHtml(step.value.length > 40 ? step.value.substring(0, 40) + '…' : step.value)}</div>` : ''}
              ${step.value === '***' ? `<div class="step-value">●●●●●● (password)</div>` : ''}
              <div class="step-url" title="${escapeHtml(step.url)}">${escapeHtml(truncatedUrl)}</div>
              ${step.note ? `<div class="step-note">${ICONS.note} ${escapeHtml(step.note)}</div>` : ''}
              ${editingNoteIndex === index ? `
                <div class="step-note-editor">
                  <textarea class="step-note-input" data-index="${index}" placeholder="Add a note for this step...">${escapeHtml(step.note || '')}</textarea>
                  <div class="step-note-actions">
                    <button class="btn-note-save" data-index="${index}">Save</button>
                    <button class="btn-note-cancel" data-index="${index}">Cancel</button>
                  </div>
                </div>
              ` : ''}
            </div>
            <div class="step-actions">
              ${hasScreenshot ? `<button class="btn-copy-screenshot" data-index="${index}" data-tooltip="Copy Image">${ICONS.camera}</button>` : ''}
              <button class="btn-add-note" data-index="${index}" data-tooltip="${step.note ? 'Edit Note' : 'Add Note'}">${ICONS.note}</button>
              <button class="btn-edit" data-index="${index}" data-tooltip="Edit">${ICONS.pencil}</button>
              <button class="btn-delete-step" data-index="${index}" data-tooltip="Delete">${ICONS.trash}</button>
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
        editingNoteIndex = null; // close note editor if open
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

    // Note button listeners
    document.querySelectorAll('.btn-add-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        editingNoteIndex = editingNoteIndex === index ? null : index;
        updateUI();
        // Focus the textarea after render
        if (editingNoteIndex === index) {
          setTimeout(() => {
            const ta = document.querySelector(`.step-note-input[data-index="${index}"]`);
            if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
          }, 30);
        }
      });
    });

    document.querySelectorAll('.btn-note-save').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const ta = document.querySelector(`.step-note-input[data-index="${index}"]`);
        const noteValue = ta ? ta.value.trim() : '';
        chrome.runtime.sendMessage({
          action: 'updateStep',
          index: index,
          step: { ...steps[index], note: noteValue || null }
        }, (response) => {
          if (response && response.success) {
            steps = response.steps || [];
            editingNoteIndex = null;
            updateUI();
          }
        });
      });
    });

    document.querySelectorAll('.btn-note-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        editingNoteIndex = null;
        updateUI();
      });
    });

    // Copy individual screenshot as image/png (works in Jira — Jira strips base64 HTML but accepts raw image clipboard)
    document.querySelectorAll('.btn-copy-screenshot').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = parseInt(e.target.dataset.index);
        const step = steps[index];
        if (!step || !step.screenshot) return;
        const originalText = btn.innerHTML;
        try {
          // Convert data URL → Blob
          const res = await fetch(step.screenshot);
          const blob = await res.blob();
          // Write as image/png — this is what Jira accepts when you paste an image
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
          ]);
          btn.innerHTML = ICONS.check;
          btn.style.background = '#4CAF50';
          btn.style.color = 'white';
          btn.title = 'Screenshot copied! Now click inside Jira description and press Ctrl+V / ⌘V';
        } catch (err) {
          // Fallback: open the screenshot in a new tab so user can right-click → copy
          console.warn('Clipboard write failed, opening image in new tab:', err);
          const tab = window.open('', '_blank');
          if (tab) {
            tab.document.write(`<img src="${step.screenshot}" style="max-width:100%;cursor:pointer;" title="Right-click → Copy Image, then paste into Jira">`);
            tab.document.title = `Step ${index + 1} Screenshot`;
          }
          btn.innerHTML = ICONS.upload;
          btn.title = 'Opened in new tab — right-click the image → Copy Image → paste into Jira';
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
          btn.title = 'Copy screenshot to clipboard — then paste it directly into Jira';
        }, 3000);
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

    // ── Drag-and-drop step reordering ──────────────────────────────
    let dragSrcIndex = null;
    document.querySelectorAll('.step-drag-handle').forEach(handle => {
      handle.addEventListener('dragstart', e => {
        dragSrcIndex = parseInt(handle.dataset.index);
        handle.closest('.step-item').classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
    });
    document.querySelectorAll('.step-item').forEach(item => {
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        item.classList.add('drag-over');
      });
      item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
      item.addEventListener('drop', e => {
        e.preventDefault();
        const destIndex = parseInt(item.dataset.stepIndex);
        item.classList.remove('drag-over');
        if (dragSrcIndex === null || dragSrcIndex === destIndex) return;
        const newSteps = [...steps];
        const [moved] = newSteps.splice(dragSrcIndex, 1);
        newSteps.splice(destIndex, 0, moved);
        chrome.runtime.sendMessage({ action: 'updateAllSteps', steps: newSteps }, r => {
          if (r && r.success) { steps = newSteps; updateUI(); }
        });
      });
      item.addEventListener('dragend', () => {
        document.querySelectorAll('.step-item').forEach(i => i.classList.remove('dragging', 'drag-over'));
        dragSrcIndex = null;
      });
    });

    // ── Screenshot hover preview (Feature 7) ─────────────────────
    const imgTip = document.getElementById('js-tooltip-img');
    const imgTipSrc = document.getElementById('js-tooltip-img-src');
    if (imgTip && imgTipSrc) {
      document.querySelectorAll('[data-screenshot-index]').forEach(badge => {
        badge.addEventListener('mouseover', () => {
          const idx = parseInt(badge.dataset.screenshotIndex);
          const step = steps[idx];
          if (!step || !step.screenshot) return;
          imgTipSrc.src = step.screenshot;
          imgTip.style.display = 'block';
          const r = badge.getBoundingClientRect();
          let top = r.bottom + 6;
          if (top + 220 > window.innerHeight) top = r.top - 220 - 6;
          let left = r.left - 80;
          left = Math.max(4, Math.min(left, window.innerWidth - 220));
          imgTip.style.top = top + 'px';
          imgTip.style.left = left + 'px';
        });
        badge.addEventListener('mouseout', () => {
          imgTip.style.display = 'none';
        });
      });
    }
  }

  // Update export, save, edit mode, and delete all buttons
  exportBtn.disabled = steps.length === 0;
  saveBtn.disabled = steps.length === 0;
  editModeBtn.disabled = steps.length === 0;
  if (deleteAllBtn) deleteAllBtn.disabled = steps.length === 0;
  
  // Update edit mode button state
  if (isEditMode) {
    editModeBtn.innerHTML = ICONS.check;
    editModeBtn.title = 'Exit Edit Mode';
    editModeBtn.classList.add('btn-active');
  } else {
    editModeBtn.innerHTML = ICONS.pencil;
    editModeBtn.title = 'Toggle Edit Mode';
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
function formatStepsForClipboardWithScreenshots(steps, editable = false) {
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
  const titleAttrs = editable ? ' contenteditable="true" spellcheck="false" title="Click to edit title" style="color: #0052CC; border-bottom: 2px solid #0052CC; padding-bottom: 5px; outline: none; cursor: text;" onfocus="this.style.background=\'#F4F5F7\'" onblur="this.style.background=\'\'"' : ' style="color: #0052CC; border-bottom: 2px solid #0052CC; padding-bottom: 5px;"';
  htmlOutput += `<h2${titleAttrs}>${escapeHtml(reportTitle)}</h2>`;
  
  // Build plain text version
  let textOutput = `${reportTitle}\n\n`;
  
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
    if (step.note) {
      htmlOutput += `<p style="margin: 4px 0 8px 0; color: #666; font-style: italic; font-size: 13px;">📝 ${escapeHtml(step.note)}</p>`;
    }
    // Add screenshot if available
    if (step.screenshot) {
      htmlOutput += `<img src="${step.screenshot}" alt="Screenshot for step ${stepNum}" style="max-width: 800px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; display: block;">`;
    }
    htmlOutput += `</div>`;

    // Add to text version
    textOutput += stepText + '\n';
    if (step.note) {
      textOutput += `   Note: ${step.note}\n`;
    }
    if (step.screenshot) {
      textOutput += `\n[Screenshot available for this step]\n`;
    }
    textOutput += '\n';
  });
  
  // Add environment info
  const env = getEnvironmentInfo();
  htmlOutput += '<hr style="margin: 20px 0;">';
  htmlOutput += '<h3 style="color: #0052CC;">Environment</h3>';
  htmlOutput += `<p><strong>Starting URL:</strong> ${escapeHtml(cleanedSteps[0].url)}</p>`;
  htmlOutput += `<p><strong>Browser:</strong> ${escapeHtml(env.browser)}</p>`;
  htmlOutput += `<p><strong>OS:</strong> ${escapeHtml(env.os)}</p>`;
  htmlOutput += `<p><strong>Screen:</strong> ${escapeHtml(env.viewport)}</p>`;
  htmlOutput += `<p><strong>Recorded:</strong> ${escapeHtml(env.timestamp)}</p>`;
  htmlOutput += '</div>';

  textOutput += '---\n\n';
  textOutput += 'Environment\n\n';
  textOutput += `Starting URL: ${cleanedSteps[0].url}\n`;
  textOutput += `Browser: ${env.browser}\n`;
  textOutput += `OS: ${env.os}\n`;
  textOutput += `Screen: ${env.viewport}\n`;
  textOutput += `Recorded: ${env.timestamp}\n`;
  
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
  
  let output = `h2. ${reportTitle}\n\n`;
  
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
          const wrappedUrl = step.url.length > 80 ? step.url.replace(/([?&])/g, '\n   $1') : step.url;
          output += `${stepNum}. Navigate to ${urlObj.hostname}${displayPath}\n`;
          output += `   *URL:* ${wrappedUrl}\n\n`;
        } catch (e) {
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

    // Show URL: full URL on its own line, wrapped if long
    const urlDisplay = step.url.length > 80
      ? step.url.replace(/([?&])/g, '\n   $1')
      : step.url;
    output += `   *URL:* ${urlDisplay}\n`;
    if (step.note) {
      output += `   _📝 Note: ${step.note}_\n`;
    }

    output += '\n';
  });

  // Add environment information
  const env = getEnvironmentInfo();
  output += '---\n\n';
  output += 'h2. Environment\n\n';
  output += `*Starting URL:* ${cleanedSteps[0].url}\n`;
  output += `*Browser:* ${env.browser}\n`;
  output += `*OS:* ${env.os}\n`;
  output += `*Screen:* ${env.viewport}\n`;
  output += `*Recorded:* ${env.timestamp}\n`;
  
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

  let output = `# ${reportTitle}\n\n`;

  steps.forEach((step, index) => {
    output += `## Step ${index + 1}\n\n`;
    output += `**Action:** ${step.action}\n\n`;
    output += `**Element:** ${step.element || 'N/A'}\n\n`;
    if (step.value) {
      output += `**Value:** ${step.value}\n\n`;
    }
    output += `**URL:** ${step.url}\n\n`;
    if (step.note) {
      output += `> 📝 **Note:** ${step.note}\n\n`;
    }
    if (step.selector) {
      output += `**Selector:** \`${step.selector}\`\n\n`;
    }
    // Add screenshot if available
    if (step.screenshot) {
      output += `![Screenshot for step ${index + 1}](${step.screenshot})\n\n`;
    }
    output += '---\n\n';
  });

  const env = getEnvironmentInfo();
  output += '## Environment\n\n';
  output += `**Browser:** ${env.browser}\n\n`;
  output += `**OS:** ${env.os}\n\n`;
  output += `**Screen:** ${env.viewport}\n\n`;
  output += `**Recorded:** ${env.timestamp}\n`;

  return output;
}

// Format steps for HTML
function formatStepsForHTML(steps) {
  if (steps.length === 0) {
    return '<p>No steps recorded.</p>';
  }
  
  let output = `<!DOCTYPE html><html><head><title>${escapeHtml(reportTitle)}</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:800px;margin:0 auto;}h1{color:#333;outline:none;cursor:text;}h1[contenteditable]:hover{outline:1px dashed #999;}h1[contenteditable]:focus{outline:1px dashed #0052CC;background:#fafbfc;}h2{color:#0052CC;border-bottom:2px solid #0052CC;padding-bottom:5px;}table{width:100%;border-collapse:collapse;margin:20px 0;}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd;}th{background:#f5f5f5;font-weight:bold;}.step-number{background:#0052CC;color:white;padding:5px 10px;border-radius:3px;display:inline-block;margin-right:10px;}</style></head><body><h1 contenteditable="true" spellcheck="false" title="Click to edit title">${escapeHtml(reportTitle)}</h1>`;
  
  steps.forEach((step, index) => {
    output += `<div style="margin:20px 0;padding:15px;background:#f9f9f9;border-left:4px solid #0052CC;border-radius:4px;">`;
    output += `<span class="step-number">${index + 1}</span>`;
    output += `<strong>${step.action}</strong> "${step.element || 'element'}"`;
    if (step.value) {
      output += ` with value "${step.value}"`;
    }
    output += `<br><small style="color:#666;">URL: ${step.url}</small>`;
    if (step.note) {
      output += `<br><em style="color:#666;font-size:13px;">📝 ${step.note}</em>`;
    }
    if (step.selector) {
      output += `<br><code style="background:#f0f0f0;padding:2px 5px;border-radius:2px;">${step.selector}</code>`;
    }
    // Add screenshot immediately after the step (step followed by screenshot)
    if (step.screenshot) {
      output += `<br><img src="${step.screenshot}" alt="Screenshot for step ${index + 1}" class="screenshot" style="max-width:100%;margin-top:10px;border:1px solid #ddd;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">`;
    }
    output += `</div>`;
  });
  
  const env = getEnvironmentInfo();
  output += `<div style="margin:20px 0;padding:12px;background:#f0f7ff;border-left:4px solid #0052CC;border-radius:4px;font-size:13px;">`;
  output += `<strong>Environment</strong><br>`;
  output += `Browser: ${env.browser}<br>OS: ${env.os}<br>Screen: ${env.viewport}<br>Recorded: ${env.timestamp}`;
  output += `</div>`;
  output += '</body></html>';
  return output;
}

// Format steps for Plain Text
function formatStepsForPlainText(steps) {
  if (steps.length === 0) {
    return 'No steps recorded.';
  }

  let output = `${reportTitle.toUpperCase()}\n`;
  output += '='.repeat(50) + '\n\n';

  steps.forEach((step, index) => {
    output += `Step ${index + 1}: ${step.action} "${step.element || 'element'}"`;
    if (step.value) {
      output += ` with value "${step.value}"`;
    }
    output += '\n';
    output += `  URL: ${step.url}\n`;
    if (step.note) {
      output += `  Note: ${step.note}\n`;
    }
    if (step.selector) {
      output += `  Selector: ${step.selector}\n`;
    }
    output += '\n';
  });

  const env = getEnvironmentInfo();
  output += '='.repeat(50) + '\n';
  output += 'ENVIRONMENT\n';
  output += '='.repeat(50) + '\n';
  output += `Browser: ${env.browser}\n`;
  output += `OS: ${env.os}\n`;
  output += `Screen: ${env.viewport}\n`;
  output += `Recorded: ${env.timestamp}\n`;

  return output;
}

// Format steps for JSON
function formatStepsForJSON(steps) {
  const env = getEnvironmentInfo();
  return JSON.stringify({
    title: reportTitle,
    recordedAt: new Date().toISOString(),
    totalSteps: steps.length,
    environment: env,
    steps: steps.map((step, index) => ({
      stepNumber: index + 1,
      action: step.action,
      element: step.element,
      value: step.value,
      note: step.note || null,
      url: step.url,
      selector: step.selector,
      timestamp: step.timestamp
    }))
  }, null, 2);
}

// ── JS fixed-position tooltip (for buttons inside overflow-clipped containers) ──
// Handles [data-js-tooltip] elements anywhere in the popup, regardless of overflow.
(function () {
  const tip = document.getElementById('js-tooltip');
  if (!tip) return;

  document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('[data-js-tooltip]');
    if (!btn) return;
    const text = btn.getAttribute('data-js-tooltip');
    if (!text) return;

    tip.textContent = text;
    tip.style.display = 'block';

    const r = btn.getBoundingClientRect();
    const tipW = tip.offsetWidth;
    const tipH = tip.offsetHeight;

    // Prefer above the button; flip below if not enough room
    let top = r.top - tipH - 6;
    if (top < 4) top = r.bottom + 6; // flip below

    // Centre horizontally, keep inside popup (popup is 400px wide)
    let left = r.left + r.width / 2 - tipW / 2;
    left = Math.max(4, Math.min(left, 396 - tipW));

    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  });

  document.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('[data-js-tooltip]');
    if (!btn) return;
    tip.style.display = 'none';
  });

  // Hide on click too
  document.addEventListener('click', () => { tip.style.display = 'none'; });
})();

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

