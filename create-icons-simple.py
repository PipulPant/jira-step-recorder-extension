#!/usr/bin/env python3
"""
Simple script to create icon files for the Chrome extension.
Requires PIL/Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    def create_icon(size, filename):
        # Create image with blue background
        img = Image.new('RGB', (size, size), color='#0052CC')
        draw = ImageDraw.Draw(img)
        
        # Try to use a font, fallback to default if not available
        try:
            # Try to use a system font
            font_size = int(size * 0.5)
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            try:
                font = ImageFont.truetype("arial.ttf", int(size * 0.5))
            except:
                font = ImageFont.load_default()
        
        # Draw "JR" text
        text = "JR"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        position = ((size - text_width) // 2, (size - text_height) // 2 - bbox[1])
        draw.text(position, text, fill='white', font=font)
        
        # Save
        img.save(filename, 'PNG')
        print(f"Created {filename} ({size}x{size})")
    
    # Create all three sizes
    create_icon(16, 'icon16.png')
    create_icon(48, 'icon48.png')
    create_icon(128, 'icon128.png')
    
    print("\nAll icons created successfully!")
    
except ImportError:
    print("Pillow is not installed. Installing...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    print("Please run this script again.")
except Exception as e:
    print(f"Error: {e}")
    print("\nAlternative: Open create-icons.html in your browser to generate icons.")

