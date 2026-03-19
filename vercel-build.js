const fs = require('fs');
const path = require('path');

// Extract the token from Vercel's Environment Variables
const token = process.env.MAPILLARY_TOKEN || '';

if (!token) {
  console.warn('⚠️ WARNING: MAPILLARY_TOKEN environment variable is not set!');
}

const configPath = './js/config.js';

try {
  let content = fs.readFileSync(configPath, 'utf8');
  
  // Replace the placeholder with the real token
  const updatedContent = content.replace(
    /'YOUR_MAPILLARY_ACCESS_TOKEN_HERE'/g,
    `'${token}'`
  );
  
  fs.writeFileSync(configPath, updatedContent, 'utf8');
  console.log('✅ Successfully injected token into js/config.js');
} catch (error) {
  console.error('❌ Failed to update js/config.js:', error);
  process.exit(1);
}
