# Chrome Web Store Submission Checklist

## ✅ Pre-Submission Checklist

### Files Ready
- [x] manifest.json
- [x] background.js
- [x] content.js
- [x] popup.html
- [x] popup.js
- [x] styles.css
- [x] icon16.png
- [x] icon48.png
- [x] icon128.png
- [x] Extension package (jira-step-recorder.zip) - **Created!**

### Before Submitting

- [ ] **Test the extension thoroughly** on multiple websites
- [ ] **Update version number** in manifest.json if needed (currently 1.0.0)
- [ ] **Review permissions** - Consider removing `tabCapture` and `desktopCapture` if not needed
- [ ] **Test all features**:
  - [ ] Start/Stop recording
  - [ ] Step capture
  - [ ] Screenshot capture
  - [ ] Copy steps
  - [ ] Preview steps
  - [ ] Export to different formats

## 📝 Store Listing Preparation

### Required Information

- [ ] **Extension Name**: "Jira Step Recorder" (or your choice)
- [ ] **Short Description** (132 chars max): Ready in PUBLISHING_GUIDE.md
- [ ] **Detailed Description**: Ready in PUBLISHING_GUIDE.md
- [ ] **Category**: Productivity or Developer Tools
- [ ] **Language**: English (United States)

### Images Needed

- [ ] **Screenshots** (at least 1, recommended 1280x800):
  - [ ] Screenshot 1: Extension popup showing recording interface
  - [ ] Screenshot 2: Preview window with steps and screenshots
  - [ ] Screenshot 3: Example of copied steps in Jira format

- [ ] **Promotional Images** (Optional but recommended):
  - [ ] Small tile: 440x280
  - [ ] Large tile: 920x680
  - [ ] Marquee tile: 1400x560

### Privacy Policy

- [ ] **Create Privacy Policy page** (template in PRIVACY_POLICY.md)
- [ ] **Host it online** (GitHub Pages, your website, etc.)
- [ ] **Update contact email** in privacy policy
- [ ] **Get the URL** to add in store listing

## 🚀 Submission Steps

### Step 1: Chrome Web Store Developer Account
- [ ] Go to: https://chrome.google.com/webstore/devconsole
- [ ] Sign in with Google account
- [ ] Pay $5 one-time registration fee
- [ ] Wait for account approval

### Step 2: Upload Extension
- [ ] Click "New Item" button
- [ ] Upload `jira-step-recorder.zip`
- [ ] Wait for upload to complete

### Step 3: Fill Store Listing
- [ ] Enter extension name
- [ ] Enter short description
- [ ] Enter detailed description
- [ ] Select category
- [ ] Select language
- [ ] Upload screenshots
- [ ] Add privacy policy URL
- [ ] (Optional) Add promotional images

### Step 4: Distribution Settings
- [ ] Choose distribution: "Public" or "Unlisted"
  - **Public**: Visible to everyone in Chrome Web Store
  - **Unlisted**: Only accessible via direct link (good for testing)

### Step 5: Submit
- [ ] Review all information
- [ ] Click "Submit for Review"
- [ ] Wait for review (typically 1-3 business days)

## 📧 After Submission

- [ ] Check email for submission confirmation
- [ ] Monitor dashboard for review status
- [ ] If rejected, address issues and resubmit
- [ ] If approved, celebrate! 🎉

## 🔄 Future Updates

When updating your extension:
- [ ] Update version number in manifest.json (e.g., 1.0.1)
- [ ] Create new package using `./package-extension.sh`
- [ ] Go to extension in dashboard
- [ ] Click "Upload Updated Package"
- [ ] Submit for review

## 📚 Resources

- **Publishing Guide**: See PUBLISHING_GUIDE.md for detailed instructions
- **Privacy Policy Template**: See PRIVACY_POLICY.md
- **Chrome Web Store Dashboard**: https://chrome.google.com/webstore/devconsole
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/

---

**Current Status**: ✅ Package ready! Ready to submit.

**Next Action**: Create Chrome Web Store developer account and prepare store listing.

