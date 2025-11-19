# Chrome Web Store Publishing Guide

## Prerequisites

1. **Google Developer Account**: You need a Google account and must pay a one-time $5 registration fee
   - Go to: https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account
   - Pay the $5 registration fee (one-time payment)

2. **Prepare Your Extension**:
   - ✅ All files are ready
   - ✅ Icons are present (16x16, 48x48, 128x128)
   - ✅ manifest.json is configured

## Step 1: Optimize Your Extension

### Check Manifest Permissions
Your current manifest includes some permissions that might need review:
- `tabCapture` - Only needed if you're doing screen recording (which you're not currently using)
- `desktopCapture` - Only needed for desktop capture (not currently used)

**Optional**: You can remove these if not needed, but it's okay to keep them for future features.

### Update Version Number
Make sure your version in `manifest.json` is appropriate:
- Start with `1.0.0` for first release
- Use semantic versioning (major.minor.patch)

## Step 2: Create Extension Package

### Create a ZIP file with these files ONLY:
- ✅ manifest.json
- ✅ background.js
- ✅ content.js
- ✅ popup.html
- ✅ popup.js
- ✅ styles.css
- ✅ icon16.png
- ✅ icon48.png
- ✅ icon128.png

**DO NOT include:**
- ❌ README.md
- ❌ .git files
- ❌ create-icons-simple.py
- ❌ create-icons.html
- ❌ generate-icons.js
- ❌ ENHANCEMENTS.md
- ❌ Any development files

### How to Create ZIP (Mac):
```bash
# Navigate to your extension directory
cd "/Users/pipulpant/Desktop/step recorder"

# Create a zip file with only the necessary files
zip -r jira-step-recorder.zip manifest.json background.js content.js popup.html popup.js styles.css icon16.png icon48.png icon128.png
```

### How to Create ZIP (Windows):
1. Select all the files listed above
2. Right-click → Send to → Compressed (zipped) folder
3. Rename to `jira-step-recorder.zip`

## Step 3: Prepare Store Listing

### Required Information:

1. **Name**: "Jira Step Recorder" (or your preferred name)

   **Developer/Author Information**:
   - **Name**: Pipul Pant
   - **Email**: pipulpant@gmail.com
   - (This will be automatically populated from your Chrome Web Store developer account)

2. **Description** (Short - 132 characters max):
   ```
   Automatically record user interactions and generate formatted steps for Jira tickets with screenshots.
   ```

3. **Detailed Description** (up to 16,000 characters):
   ```
   Jira Step Recorder is a powerful Chrome extension that automatically captures user interactions on web pages and generates well-formatted step-by-step instructions perfect for Jira tickets.

   Features:
   • Automatic step recording - Captures clicks, form inputs, and navigation
   • Screenshot capture - Takes screenshots for each step to aid understanding
   • Jira formatting - Generates steps in Jira markup format ready to paste
   • Multiple export formats - Jira, Markdown, HTML, and Plain Text
   • Preview mode - Preview steps with screenshots before copying
   • Step editing - Edit, reorder, or delete steps before exporting
   • Persistent recording - Steps persist across page refreshes and redirects
   • Quick copy - Copy steps directly after stopping recording

   How to Use:
   1. Click the extension icon to open the popup
   2. Click "Start Recording" to begin capturing interactions
   3. Perform your actions on the webpage
   4. Click "Stop Recording" when done
   5. Copy the formatted steps or preview with screenshots
   6. Paste directly into your Jira ticket

   Perfect for:
   • QA teams documenting bugs
   • Developers creating test cases
   • Support teams creating documentation
   • Anyone who needs to document web interactions

   Privacy:
   • All data is stored locally in your browser
   • No data is sent to external servers
   • Screenshots are stored locally only
   ```

4. **Category**: Choose "Productivity" or "Developer Tools"

5. **Language**: English (United States)

6. **Screenshots** (Required):
   - At least 1 screenshot (1280x800 or 640x400 recommended)
   - Take screenshots of:
     - Extension popup showing recording interface
     - Preview window with steps and screenshots
     - Example of copied steps in Jira format

7. **Promotional Images** (Optional but recommended):
   - Small promotional tile: 440x280
   - Large promotional tile: 920x680
   - Marquee promotional tile: 1400x560

8. **Privacy Policy** (Required):
   - You need to create a privacy policy page
   - Host it on a website (GitHub Pages, your website, etc.)
   - Example content:
     ```
     Privacy Policy for Jira Step Recorder

     Last updated: [Date]

     Jira Step Recorder ("we", "our", "us") is committed to protecting your privacy.

     Data Collection:
     - This extension stores data locally in your browser
     - We do not collect, transmit, or store any personal information
     - Screenshots and recorded steps are stored only on your device

     Permissions:
     - activeTab: Required to capture user interactions on web pages
     - storage: Required to save recorded steps locally
     - scripting: Required to inject content scripts
     - tabs: Required to track navigation between pages
     - host_permissions: Required to work on all websites

     Contact:
     - Developer: Pipul Pant
     - Email: pipulpant@gmail.com
     ```

## Step 4: Submit to Chrome Web Store

1. **Go to Chrome Web Store Developer Dashboard**:
   - https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account

2. **Click "New Item"**:
   - Upload your ZIP file
   - Wait for upload to complete (may take a few minutes)

3. **Fill in Store Listing**:
   - Complete all required fields
   - Upload screenshots
   - Add privacy policy URL

4. **Distribution**:
   - Choose "Public" (visible to everyone) or "Unlisted" (only accessible via link)
   - For first release, you might want to start with "Unlisted" to test

5. **Submit for Review**:
   - Click "Submit for Review"
   - Review process typically takes 1-3 business days
   - You'll receive email notifications about the status

## Step 5: After Submission

- **Review Status**: Check your dashboard for review status
- **Rejections**: If rejected, address the issues and resubmit
- **Approval**: Once approved, your extension will be live!

## Common Issues & Solutions

### Issue: "Manifest file is invalid"
- **Solution**: Double-check your manifest.json syntax
- Use a JSON validator: https://jsonlint.com/

### Issue: "Missing required images"
- **Solution**: Ensure you have all three icon sizes (16, 48, 128)

### Issue: "Privacy policy required"
- **Solution**: Create a privacy policy page and add the URL

### Issue: "Screenshots required"
- **Solution**: Upload at least one screenshot (1280x800 recommended)

## Tips for Success

1. **Test Thoroughly**: Test your extension on multiple websites before submitting
2. **Clear Description**: Write a clear, detailed description
3. **Good Screenshots**: Use high-quality screenshots showing key features
4. **Privacy Policy**: Be transparent about data collection (or lack thereof)
5. **Version Updates**: Use semantic versioning for updates

## Updating Your Extension

When you need to update:
1. Update version number in manifest.json
2. Create new ZIP file
3. Go to your extension in the dashboard
4. Click "Upload Updated Package"
5. Submit for review again

## Resources

- Chrome Web Store Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Chrome Extension Documentation: https://developer.chrome.com/docs/extensions/
- Manifest V3 Guide: https://developer.chrome.com/docs/extensions/mv3/intro/
- Chrome Web Store Policies: https://developer.chrome.com/docs/webstore/program-policies/

Good luck with your submission! 🚀

