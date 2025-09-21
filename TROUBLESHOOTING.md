# SAY TO GO - Troubleshooting Guide

This guide helps you resolve common issues you might encounter while using SAY TO GO.

## Voice Recognition Issues

### Problem: Browser says "Speech recognition is not supported"
**Cause**: You're using a browser that doesn't support the Web Speech API
**Solution**: 
- Use Google Chrome or Microsoft Edge (recommended)
- Firefox and Safari have limited or no support for this feature

### Problem: Microphone access denied
**Cause**: Browser permissions not granted for microphone access
**Solution**:
1. Click the microphone icon in your browser's address bar
2. Select "Allow" or "Always allow"
3. Refresh the page and try again

### Problem: No speech detected
**Cause**: Poor microphone quality, background noise, or unclear speech
**Solution**:
1. Speak clearly and at a moderate pace
2. Minimize background noise
3. Ensure your microphone is properly positioned
4. Test your microphone with another application
5. Try using a headset with a built-in microphone

### Problem: Speech recognition error: network
**Cause**: Network restrictions preventing access to speech recognition services
**Solution**:
1. Try using a mobile hotspot
2. Disable VPN or firewall temporarily
3. Check if your network blocks speech APIs
4. Try a different network environment

## Location Search Issues

### Problem: "No results found for the location"
**Cause**: The location name is too vague or misspelled
**Solution**:
1. Use more specific location names (e.g., "Eiffel Tower, Paris" instead of "Paris")
2. Try well-known landmarks
3. Add country names to your search (e.g., "London, UK" instead of "London")
4. Check your spelling

### Problem: "360° view not available for [location]"
**Cause**: No street-level imagery available for that specific location
**Solution**:
1. Try the "Next Near Area" button to find nearby locations with imagery
2. Search for well-known tourist areas or city centers
3. Try a different, major city nearby
4. The app now automatically searches for nearby cities with available imagery when direct coverage is unavailable

## Mapillary/360° View Issues

### Problem: Loading screen appears but never completes
**Cause**: Slow internet connection or Mapillary API issues
**Solution**:
1. Check your internet connection
2. Wait a bit longer for the imagery to load
3. Try refreshing the page
4. Try a different location

### Problem: Black screen or blank 360° viewer
**Cause**: Mapillary API token issues or JavaScript errors
**Solution**:
1. Refresh the page
2. Clear your browser cache and cookies
3. Try using an incognito/private browsing window
4. Check browser console for error messages (F12 Developer Tools)

### Problem: Mapillary API 400 errors
**Cause**: Invalid or expired Mapillary API token
**Solution**:
1. Obtain a new Mapillary API token from [Mapillary Developer Dashboard](https://www.mapillary.com/dashboard/developers)
2. Update your `config.js` file with the new token
3. Make sure you've properly configured the `config.js` file (see Setup Instructions in README.md)

## Browser-Specific Issues

### Chrome/Chromium Issues
**Problem**: Features not working on HTTP sites
**Solution**: 
- Use HTTPS (except when running on localhost)
- Or run the application on localhost

### Firefox Issues
**Problem**: Web Speech API not working
**Solution**: 
- Firefox has limited support for speech recognition
- Switch to Chrome or Edge for full functionality

### Safari Issues
**Problem**: Web Speech API not working
**Solution**: 
- Safari has limited support for speech recognition
- Switch to Chrome or Edge for full functionality

## Network and Security Issues

### Problem: "Speech recognition requires a secure connection (HTTPS)"
**Cause**: Using file:// protocol or HTTP on production servers
**Solution**:
1. For local development, access via localhost
2. For production, ensure you're using HTTPS
3. Use a local server (like Live Server in VS Code) instead of opening the file directly

### Problem: CORS errors in browser console
**Cause**: Browser security restrictions when accessing APIs
**Solution**:
1. Use a local server instead of opening files directly
2. If developing, consider using a CORS proxy for development

## Performance Issues

### Problem: Application is slow or unresponsive
**Cause**: Slow internet connection or older hardware
**Solution**:
1. Check your internet connection speed
2. Close other browser tabs and applications
3. Try a different, less resource-intensive location
4. Restart your browser

## Mobile Device Issues

### Problem: Voice recognition not working on mobile
**Cause**: Mobile browser restrictions or permissions
**Solution**:
1. Ensure you've granted microphone permissions
2. Try using Chrome on Android or Safari on iOS
3. Make sure your mobile browser is up to date

### Problem: Interface doesn't look right on mobile
**Cause**: Responsive design issues or browser compatibility
**Solution**:
1. Rotate your device to landscape mode for better viewing
2. Zoom out if the interface appears too large
3. Try a different mobile browser

## Development Issues

### Problem: Changes not appearing in browser
**Cause**: Browser caching
**Solution**:
1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear your browser cache
3. Use incognito/private browsing mode
4. Disable browser cache in Developer Tools

### Problem: Console errors related to Mapillary
**Cause**: Invalid or expired API token
**Solution**:
1. Check that the Mapillary access token in config.js is valid
2. Obtain a new token from Mapillary if needed
3. Make sure you've properly configured the config.js file

## Advanced Troubleshooting

### Checking Browser Console
For detailed error information:
1. Press F12 to open Developer Tools
2. Click on the "Console" tab
3. Look for error messages in red
4. These messages can help identify specific issues

### Testing APIs Directly
To test if external APIs are working:
1. Open a new browser tab
2. Try accessing:
   - OpenStreetMap Nominatim: `https://nominatim.openstreetmap.org/search?q=London&format=json`
   - Mapillary Images: `https://graph.mapillary.com/images?access_token=YOUR_TOKEN&fields=id&bbox=0,0,1,1&limit=1`

### Accessing Project Information
To learn more about the project:
1. Click the "ABOUT" button on the main screen
2. Read about the project features, creator, and technologies used
3. Close the about section using the "CLOSE" button

### Creating an Issue
If you're still having problems:
1. Check existing issues on GitHub
2. Create a new issue with:
   - Your browser and version
   - Operating system
   - Detailed description of the problem
   - Steps to reproduce
   - Any error messages from the console

## Contact Support

If you've tried all the above solutions and are still experiencing issues:

1. Create an issue on the GitHub repository
2. Include:
   - Your browser name and version
   - Your operating system
   - A detailed description of the problem
   - Steps you've already tried
   - Any error messages you've encountered

Our team will review your issue and provide assistance as soon as possible.