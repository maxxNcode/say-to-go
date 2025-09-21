# SAY TO GO - Deployment Guide

This guide explains how to deploy SAY TO GO to various hosting platforms.

## GitHub Pages Deployment

### Prerequisites
1. A GitHub account
2. This repository forked to your GitHub account

### Steps

1. **Fork the Repository**
   - Go to https://github.com/maxxNcode/SAYTOGO
   - Click the "Fork" button in the top right
   - Select your GitHub account as the destination

2. **Enable GitHub Pages**
   - Navigate to your forked repository
   - Click on "Settings" tab
   - Scroll down to the "Pages" section in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Under "Branch", select "main" (or "master") and "/ (root)"
   - Click "Save"

3. **Access Your Deployed Site**
   - After a few minutes, your site will be available at:
     `https://your-username.github.io/SAYTOGO/`
   - GitHub will show the URL in the Pages section of settings

### Custom Domain (Optional)

1. In your repository, create a file named `CNAME` in the root directory
2. Add your custom domain name as the only content of the file
3. Configure your domain's DNS settings to point to GitHub Pages
4. Update the GitHub Pages settings to use your custom domain

## Netlify Deployment

### Prerequisites
1. A Netlify account (free tier available)
2. This repository cloned to your local machine or forked on GitHub

### Steps

1. **Connect to Netlify**
   - Go to https://app.netlify.com/
   - Sign in or create an account
   - Click "New site from Git"

2. **Select Repository**
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select the SAYTOGO repository

3. **Configure Deployment Settings**
   - Branch to deploy: main (or master)
   - Build command: (leave empty - this is a static site)
   - Publish directory: / (root)
   - Click "Deploy site"

4. **Access Your Site**
   - Netlify will provide a temporary URL
   - You can customize this in the site settings

### Custom Domain on Netlify

1. Go to your site dashboard
2. Click on "Domain settings"
3. Click "Add custom domain"
4. Follow the prompts to add and verify your domain

## Vercel Deployment

### Prerequisites
1. A Vercel account (free tier available)
2. This repository forked to your GitHub account

### Steps

1. **Import Project**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import the SAYTOGO repository from GitHub

2. **Configure Project**
   - Framework Preset: Other
   - Root Directory: / (root)
   - Click "Deploy"

3. **Access Your Site**
   - Vercel will automatically deploy your site
   - You'll receive a temporary URL
   - Production deployment will be available shortly after

## Firebase Hosting Deployment

### Prerequisites
1. Node.js installed on your local machine
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. A Firebase account

### Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase Project**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure Firebase**
   - Select your Firebase project or create a new one
   - Set public directory to `.` (current directory)
   - Configure as a single-page app: No
   - Set up automatic builds and deploys with GitHub: Optional

4. **Deploy**
   ```bash
   firebase deploy
   ```

## Apache Server Deployment

### Prerequisites
1. Apache web server installed and running
2. Access to the server's document root directory

### Steps

1. **Copy Files**
   - Copy all files from the SAYTOGO repository to your Apache document root
   - Or create a subdirectory in your document root for the application

2. **Configure Apache (if needed)**
   - Ensure Apache is configured to serve static files
   - If using HTTPS, ensure SSL certificates are properly configured

3. **Access Your Site**
   - Navigate to your server's URL in a web browser

## Nginx Server Deployment

### Prerequisites
1. Nginx web server installed and running
2. Access to the server's configuration files

### Steps

1. **Copy Files**
   - Copy all files from the SAYTOGO repository to your Nginx document root
   - Or create a subdirectory in your document root for the application

2. **Configure Nginx**
   - Edit your Nginx site configuration:
     ```nginx
     server {
         listen 80;
         server_name your-domain.com;
         root /path/to/SAYTOGO;
         index index.html;
         
         location / {
             try_files $uri $uri/ =404;
         }
     }
     ```

3. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

## Important Considerations

### HTTPS Requirements

For full functionality, especially voice recognition:
- The Web Speech API requires a secure context (HTTPS)
- Localhost is exempt from this requirement
- Ensure your deployment uses HTTPS in production

### API Keys

The current implementation uses a public Mapillary API key:
- This is suitable for demonstration purposes
- For production use, consider obtaining your own API key
- Replace the key in `script.js` if needed

### Browser Compatibility

Ensure your hosting platform supports:
- Static file serving
- Modern JavaScript (ES6+)
- HTTPS (for full functionality)

## Troubleshooting Deployment Issues

### Common Issues

1. **Voice Recognition Not Working**
   - Ensure your site is served over HTTPS
   - Check that the Web Speech API is supported by the user's browser

2. **API Errors**
   - Verify that the Mapillary API key is valid
   - Check that external APIs are accessible from your hosting environment

3. **CORS Issues**
   - Ensure your hosting provider doesn't block external API requests
   - Some free hosting providers may have restrictions

4. **File Path Issues**
   - Verify that all file paths in the HTML and CSS are correct
   - Ensure all assets are uploaded to the server

### Testing Your Deployment

After deployment, test:
1. The main page loads correctly
2. All CSS styling is applied
3. JavaScript functionality works
4. Voice recognition is accessible (on HTTPS)
5. Location search returns results
6. 360° viewer loads and functions

## Updating Your Deployment

To update your deployed site:

1. **For GitHub Pages**
   - Push changes to your main branch
   - GitHub will automatically redeploy

2. **For Netlify/Vercel**
   - Push changes to your connected Git repository
   - The platform will automatically rebuild and deploy

3. **For Manual Deployments**
   - Re-upload the changed files to your server
   - Clear any server-side caches if necessary

This deployment guide should help you get SAY TO GO running on various hosting platforms. Choose the option that best fits your needs and technical requirements.