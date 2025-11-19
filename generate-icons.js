// Simple Node.js script to generate icon files
// Run with: node generate-icons.js
// Requires: npm install canvas (or use the HTML version instead)

const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#0052CC');
  gradient.addColorStop(1, '#0065FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Add border
  ctx.strokeStyle = '#003d99';
  ctx.lineWidth = size * 0.05;
  ctx.strokeRect(0, 0, size, size);
  
  // Text "JR"
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JR', size / 2, size / 2);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Created ${filename}`);
}

// Generate all three icon sizes
try {
  createIcon(16, 'icon16.png');
  createIcon(48, 'icon48.png');
  createIcon(128, 'icon128.png');
  console.log('All icons generated successfully!');
} catch (error) {
  console.error('Error generating icons. Make sure you have the canvas package installed:');
  console.error('npm install canvas');
  console.error('\nAlternatively, open create-icons.html in your browser to generate icons.');
}

