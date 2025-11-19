#!/bin/bash

# Script to resize icon image to required sizes for Chrome extension

echo "🖼️  Icon Resizer for Chrome Extension"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed."
    echo ""
    echo "Please install ImageMagick first:"
    echo "  macOS: brew install imagemagick"
    echo "  Or use an online tool: https://www.iloveimg.com/resize-image"
    echo ""
    echo "Alternatively, you can manually resize your image to:"
    echo "  - 16x16 pixels → icon16.png"
    echo "  - 48x48 pixels → icon48.png"
    echo "  - 128x128 pixels → icon128.png"
    exit 1
fi

# Find the new icon file
NEW_ICON=""
if [ -f "new-icon.png" ]; then
    NEW_ICON="new-icon.png"
elif [ -f "new-icon.jpg" ]; then
    NEW_ICON="new-icon.jpg"
elif [ -f "new-icon.jpeg" ]; then
    NEW_ICON="new-icon.jpeg"
else
    echo "📁 Looking for your new icon file..."
    echo ""
    echo "Please save your new icon image in this folder as one of:"
    echo "  - new-icon.png"
    echo "  - new-icon.jpg"
    echo "  - new-icon.jpeg"
    echo ""
    read -p "Or enter the filename of your icon image: " NEW_ICON
    
    if [ ! -f "$NEW_ICON" ]; then
        echo "❌ File not found: $NEW_ICON"
        exit 1
    fi
fi

echo "✓ Found icon: $NEW_ICON"
echo ""

# Backup existing icons
echo "📦 Backing up existing icons..."
mkdir -p icon-backup
cp icon16.png icon-backup/ 2>/dev/null
cp icon48.png icon-backup/ 2>/dev/null
cp icon128.png icon-backup/ 2>/dev/null
echo "✓ Backed up to icon-backup/ folder"
echo ""

# Resize to required sizes
echo "🔄 Resizing icon to required sizes..."
convert "$NEW_ICON" -resize 16x16! icon16.png
convert "$NEW_ICON" -resize 48x48! icon48.png
convert "$NEW_ICON" -resize 128x128! icon128.png

if [ $? -eq 0 ]; then
    echo "✅ Icons created successfully!"
    echo ""
    echo "Created:"
    echo "  - icon16.png (16x16)"
    echo "  - icon48.png (48x48)"
    echo "  - icon128.png (128x128)"
    echo ""
    echo "📦 Next step: Run ./package-extension.sh to create new package"
else
    echo "❌ Error resizing icons"
    exit 1
fi

