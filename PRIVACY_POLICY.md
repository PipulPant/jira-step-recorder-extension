# Privacy Policy for Jira Step Recorder

**Last Updated:** November 19, 2025

## Introduction

Jira Step Recorder ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we handle data when you use our Chrome extension.

## Data Collection and Storage

### What We Collect
- **User Interactions**: The extension records clicks, form inputs, and page navigation on websites you visit while recording is active.
- **Screenshots**: The extension captures screenshots of web pages during recording (only when recording is active).
- **URLs**: The extension records URLs of pages you visit during recording.

### How We Store Data
- **Local Storage Only**: All data (steps, screenshots, URLs) is stored **locally in your browser** using Chrome's `chrome.storage.local` API.
- **No External Servers**: We do **not** transmit, upload, or store any data on external servers.
- **No Cloud Storage**: All data remains on your device.
- **User Control**: You can clear all recorded data at any time using the "Clear Steps" button in the extension.

## Permissions Explained

The extension requires the following permissions:

- **activeTab**: Required to capture user interactions (clicks, inputs) on the currently active tab.
- **storage**: Required to save recorded steps and screenshots locally in your browser.
- **scripting**: Required to inject content scripts that capture user interactions.
- **tabs**: Required to track navigation between pages and maintain recording state.
- **host_permissions** (`<all_urls>`): Required to work on all websites you visit.

**Note**: The extension does **not** use the following permissions in the current version, but they are declared for potential future features:
- **tabCapture**: Reserved for potential screen recording features (not currently used).
- **desktopCapture**: Reserved for potential desktop capture features (not currently used).

## Data Usage

- **No Analytics**: We do not collect analytics or usage statistics.
- **No Tracking**: We do not track your browsing behavior outside of recording sessions.
- **No Sharing**: We do not share, sell, or disclose your data to third parties.
- **No Advertising**: We do not use your data for advertising purposes.

## When Recording is Active

- The extension only captures data when you explicitly click "Start Recording".
- You can pause, resume, or stop recording at any time.
- When recording is stopped, no new data is captured.

## Data Deletion

- You can delete individual steps using the delete button next to each step.
- You can clear all steps using the "Clear Steps" button.
- Uninstalling the extension will remove all locally stored data.

## Security

- All data is stored locally in your browser's secure storage.
- We do not have access to your data.
- Screenshots are stored as base64-encoded images locally only.

## Third-Party Services

This extension does not use any third-party services, APIs, or external servers.

## Children's Privacy

This extension is not intended for users under the age of 13. We do not knowingly collect data from children.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. The "Last Updated" date at the top indicates when changes were made.

## Contact

If you have questions about this Privacy Policy, please contact us at:
- **Developer**: Pipul Pant
- **Email**: pipulpant@gmail.com

## Your Rights

You have the right to:
- Access your locally stored data (via the extension interface)
- Delete your data at any time
- Stop using the extension at any time
- Uninstall the extension (which removes all data)

---

**Summary**: Jira Step Recorder stores all data locally in your browser. We do not collect, transmit, or store any data on external servers. Your privacy is our priority.

