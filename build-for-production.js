#!/usr/bin/env node

// Production build script for cPanel deployment
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Building for production...');

// Create .env.production file
const envContent = `VITE_API_BASE_URL=https://api-v1.soslawdz.com/`;
fs.writeFileSync('.env.production', envContent);

console.log('✅ Created .env.production file with production API URL');

try {
  // Build the project
  console.log('🔨 Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Files are ready in the "dist" folder');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Upload ALL contents of the "dist" folder to your cPanel public_html');
  console.log('2. Make sure index.html is in the root of public_html');
  console.log('3. Ensure .htaccess file is uploaded for SPA routing');
  console.log('4. Visit your domain to test the deployment');
  console.log('');
  console.log('🎉 Ready for cPanel deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Clean up
  if (fs.existsSync('.env.production')) {
    fs.unlinkSync('.env.production');
    console.log('🧹 Cleaned up .env.production file');
  }
}
