# 🚀 cPanel Deployment Guide - Method 1

## Prerequisites
- Node.js installed on your computer
- cPanel access to your hosting
- Backend API running at `https://api-v1.soslawdz.com`

## Step-by-Step Instructions

### 1. Open Command Prompt as Administrator
- Press `Windows + R`
- Type `cmd`
- Press `Ctrl + Shift + Enter` (to run as administrator)

### 2. Navigate to Project Directory
```cmd
cd C:\Users\ARES\Desktop\soslaw\soslaw-client
```

### 3. Install Dependencies (if not already done)
```cmd
npm install
```

### 4. Build for Production
```cmd
npm run build:prod
```

This command will:
- ✅ Create `.env.production` with your API URL
- ✅ Build the React app for production
- ✅ Optimize and minify all files
- ✅ Create `dist` folder with production files
- ✅ Clean up temporary files

### 5. Upload to cPanel

#### 5.1 Login to cPanel
- Go to your hosting provider's cPanel
- Login with your credentials

#### 5.2 Open File Manager
- Find and click "File Manager"
- Navigate to `public_html` directory

#### 5.3 Upload Files
- Upload **ALL contents** of the `dist` folder to `public_html`
- **Important:** Upload the contents, not the folder itself

#### 5.4 File Structure in public_html
```
public_html/
├── index.html          ← Main file (must be in root)
├── 404.html           ← For SPA routing
├── .htaccess          ← For routing and security
├── assets/            ← CSS, JS, images
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other files from dist]
```

### 6. Verify Deployment

#### 6.1 Test Your Website
- Visit your domain (e.g., `https://soslawdz.com`)
- Check if the homepage loads correctly

#### 6.2 Test API Calls
- Go to the testimonials section
- Check browser console for any errors
- Verify API calls are working

#### 6.3 Test Routing
- Navigate between different pages
- Refresh the page to test SPA routing
- Ensure no 404 errors

## 🔧 Troubleshooting

### If pages show 404:
- Check that `.htaccess` file is uploaded
- Verify file permissions in cPanel

### If API calls fail:
- Check browser console for CORS errors
- Verify backend is running at `https://api-v1.soslawdz.com`
- Check network tab for failed requests

### If assets don't load:
- Check file permissions in cPanel
- Verify all files from `dist` folder are uploaded
- Check `.htaccess` file is present

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Homepage loads without errors
- ✅ Testimonials section displays data
- ✅ All pages navigate correctly
- ✅ No console errors
- ✅ API calls return data

## 🎯 API Configuration

Your production app is configured to use:
- **API URL:** `https://api-v1.soslawdz.com`
- **Environment:** Production
- **CORS:** Must be configured on backend

Make sure your backend server is running and accessible!
