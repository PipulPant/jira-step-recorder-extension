#!/bin/bash

# Script to package the Chrome extension for Chrome Web Store submission

echo "📦 Packaging Jira Step Recorder Extension..."

# Remove old zip if exists
if [ -f "jira-step-recorder.zip" ]; then
    rm jira-step-recorder.zip
    echo "✓ Removed old package"
fi

# Create zip with only necessary files
zip -r jira-step-recorder.zip \
    manifest.json \
    background.js \
    content.js \
    popup.html \
    popup.js \
    styles.css \
    icon16.png \
    icon48.png \
    icon128.png

# Check if zip was created successfully
if [ -f "jira-step-recorder.zip" ]; then
    SIZE=$(du -h jira-step-recorder.zip | cut -f1)
    echo "✅ Package created successfully!"
    echo "   File: jira-step-recorder.zip"
    echo "   Size: $SIZE"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to: https://chrome.google.com/webstore/devconsole"
    echo "   2. Sign in and pay $5 registration fee (one-time)"
    echo "   3. Click 'New Item' and upload jira-step-recorder.zip"
    echo "   4. Fill in the store listing details"
    echo "   5. Submit for review"
    echo ""
    echo "📖 See PUBLISHING_GUIDE.md for detailed instructions"
else
    echo "❌ Error: Failed to create package"
    exit 1
fi

