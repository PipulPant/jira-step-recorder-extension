# Jira Step Recorder

A powerful Chrome extension that automatically captures user interactions on web pages and generates well-formatted step-by-step instructions perfect for Jira tickets. Includes screenshot capture, multiple export formats, and a clean preview interface.

## ✨ Features

- 🎯 **Automatic Step Recording**: Captures clicks, form inputs, navigation, and other user interactions
- 📸 **Screenshot Capture**: Takes screenshots for each step to aid understanding
- 📋 **Jira Formatting**: Generates steps in Jira markup format ready to paste
- 🎨 **Multiple Export Formats**: Export to Jira, Markdown, HTML, and Plain Text
- 👁️ **Preview Mode**: Preview steps with screenshots before copying
- ✏️ **Step Editing**: Edit, reorder, or delete steps before exporting
- 💾 **Persistent Recording**: Steps persist across page refreshes and redirects
- ⚡ **Quick Copy**: Copy steps directly after stopping recording with notification popup
- 🔗 **URL Tracking**: Automatically records URLs for each step
- 🔴 **Visual Indicator**: Shows recording status on web pages

## Installation

1. **Create Icons** (Optional but recommended):
   - Open `create-icons.html` in your browser - it will automatically download the three required icon files
   - OR use any icon generator to create `icon16.png`, `icon48.png`, and `icon128.png`
   - OR the extension will work without icons (Chrome will show a default icon)

2. **Load Extension**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the folder containing this extension
   - The extension icon should appear in your Chrome toolbar

## Usage

1. **Start Recording**:
   - Click the extension icon in your Chrome toolbar
   - Click "Start Recording" button
   - A red "🔴 Recording" indicator will appear on web pages

2. **Interact with Websites**:
   - Navigate to any website
   - Click buttons, links, and interactive elements
   - Fill out forms
   - The extension will automatically capture all interactions

3. **Stop Recording**:
   - Click the extension icon again
   - Click "Stop Recording" button

4. **Export to Jira**:
   - Click "Export to Jira" button
   - Review the formatted steps
   - Click "Copy to Clipboard"
   - Paste into your Jira ticket

## What Gets Recorded

- **Clicks**: All button clicks, link clicks, and interactive element clicks
- **Form Inputs**: Text entered in input fields and textareas
- **Form Changes**: Dropdown selections, checkbox/radio button changes
- **Navigation**: Page URL changes and browser navigation
- **Form Submissions**: Form submit events

## Jira Format

The exported format includes:
- Numbered steps grouped by URL
- Action descriptions (e.g., "Click on", "Enter text in")
- Element descriptions (button text, labels, etc.)
- Values entered (for form fields)
- Technical details (selectors, URLs)
- Environment information

## Technical Details

- **Manifest Version**: 3
- **Permissions**: activeTab, storage, scripting
- **Content Scripts**: Injected into all pages to capture interactions
- **Background Service Worker**: Manages recording state and stores steps
- **Storage**: Uses Chrome's local storage for persistence

## File Structure

```
├── manifest.json       # Extension configuration
├── background.js       # Service worker for state management
├── content.js         # Content script for capturing interactions
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
├── styles.css         # Styling
└── README.md          # This file
```

## Notes

- The extension works on all websites
- Steps are stored locally in your browser
- The recording indicator appears on all pages when recording is active
- You can clear steps at any time using the "Clear Steps" button
- Steps persist across page refreshes and redirects

## 🔒 Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Screenshots are stored locally only
- See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details

## 👤 Author

**Pipul Pant**
- Email: pipulpant@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Chrome Web Store

Available on Chrome Web Store: [Coming Soon]

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

