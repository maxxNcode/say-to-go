# SAY TO GO - Voice-Powered Teleportation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/last-commit/maxxNcode/SAYTOGO)](https://github.com/maxxNcode/SAYTOGO)

Experience different places virtually by simply speaking the location name. SAY TO GO uses voice recognition to teleport you to any location in the world with stunning 360° street-level imagery.

## Demo

![SAY TO GO Demo](demo.gif)

## Features

- 🗣️ **Voice Recognition**: Speak any location name to teleport instantly
- 🌍 **Global Coverage**: Explore cities, landmarks, and locations worldwide
- 🖼️ **360° Views**: Experience immersive street-level imagery powered by Mapillary
- 🎨 **Beautiful UI**: Modern, animated interface with interactive elements
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔍 **Smart Suggestions**: Get helpful suggestions for better location searches
- 🌐 **Automatic Country Detection**: Search any country without manual configuration
- 🏙️ **Nearby City Finder**: Automatically finds nearby cities with imagery when direct coverage is unavailable

## Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Advanced styling with animations and gradients
- **JavaScript (ES6+)**: Modern JavaScript for interactive functionality

### APIs & Services
- **Web Speech API**: Browser-based voice recognition (no API keys required)
- **OpenStreetMap Nominatim**: Geocoding service for location lookup
- **Mapillary API**: 360° street-level imagery service

### Libraries & Frameworks
- **Mapillary JS SDK**: For rendering interactive 360° views

## Prerequisites

Before using SAY TO GO, you'll need:

1. A Mapillary API token (free to obtain)
2. A modern web browser (Chrome or Edge recommended)
3. A working microphone
4. An internet connection

## Setup Instructions

### 1. Obtain a Mapillary API Token

1. Go to [Mapillary Developer Dashboard](https://www.mapillary.com/dashboard/developers)
2. Sign in or create a Mapillary account
3. Create a new application
4. Copy your access token

**Important**: Mapillary API tokens can expire. If you encounter errors with the 360° view, obtain a new token from the dashboard.

### 2. Configure the Application

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```
   
2. Edit `config.js` and replace `YOUR_MAPILLARY_ACCESS_TOKEN_HERE` with your actual token:
   ```javascript
   const MAPILLARY_CONFIG = {
     ACCESS_TOKEN: 'your_actual_mapillary_access_token_here'
   };
   ```

**Note**: The `config.js` file is included in `.gitignore` to prevent accidental exposure of your API token.

## How It Works

1. **Voice Input**: Click the "SPEAK LOCATION" button and say any location name
2. **Speech Recognition**: The Web Speech API converts your voice to text
3. **Geocoding**: OpenStreetMap Nominatim translates the location name to coordinates
4. **Coverage Check**: The app automatically checks for Mapillary coverage at the location
5. **Nearby Search**: If no direct imagery is available, the app searches for nearby cities with coverage
6. **Image Search**: Mapillary API finds the nearest available 360° imagery
7. **Immersive View**: The 360° viewer displays the location with full navigation controls

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/maxxNcode/SAYTOGO.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SAYTOGO
   ```

3. Set up your Mapillary API token (see Setup Instructions above)

4. Open `index.html` in a modern web browser (Chrome or Edge recommended)

**Note**: For full functionality, the app requires:
- HTTPS connection (except when running on localhost)
- Microphone access permissions
- Internet connection for API access

## Deployment

### Deploying to Netlify

1. **DO NOT commit your `config.js` file** to version control
2. Deploy your site to Netlify using your preferred method (GitHub integration, drag-and-drop, etc.)
3. After deployment, configure your Mapillary API token using one of these methods:

#### Method 1: Environment Variables (Recommended)
1. In Netlify, go to your site settings
2. Navigate to "Build & deploy" → "Environment"
3. Add an environment variable:
   - Key: `REACT_APP_MAPILLARY_ACCESS_TOKEN` (Note the REACT_APP_ prefix)
   - Value: Your actual Mapillary API token

#### Method 2: Manual File Upload
1. Create a `config.js` file locally with your token
2. Upload it directly to your Netlify site through the file management interface

### Deploying to Other Platforms

For other hosting platforms:
- **GitHub Pages**: Use environment variables in your build process
- **Vercel**: Use environment variables in your project settings
- **Firebase**: Use runtime configuration or environment variables

**Security Reminder**: Never commit API tokens to public repositories!

## Usage

1. Open the application in a supported browser
2. Click the green "SPEAK LOCATION" button
3. Allow microphone access when prompted
4. Clearly speak the name of a location (e.g., "Eiffel Tower, Paris" or "China")
5. Wait for the app to process your request
6. If the exact location has no imagery, the app will automatically find the nearest city with available imagery
7. Explore the 360° view using mouse/touch controls:
   - Drag to look around
   - Scroll to zoom in/out
   - Click navigation arrows to move between images
8. Use the "Back to Search" button to return to the main screen
9. Try the "Next Near Area" button to explore nearby locations

## Browser Support

| Browser | Voice Recognition | 360° Viewer | Overall Support |
|---------|------------------|-------------|-----------------|
| Chrome  | ✅               | ✅          | ✅              |
| Edge    | ✅               | ✅          | ✅              |
| Firefox | ❌               | ✅          | ⚠️ Limited      |
| Safari  | ❌               | ✅          | ⚠️ Limited      |

## Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Solution: Click the microphone icon in your browser's address bar and select "Allow"

2. **No Speech Detected**
   - Speak clearly and ensure minimal background noise
   - Check that your microphone is properly connected

3. **Location Not Found**
   - Try more specific location names (e.g., "Times Square, New York" instead of just "New York")
   - Use well-known landmarks for better results
   - The app now automatically searches for major cities within countries

4. **360° View Not Available**
   - Some locations have limited or no street-level imagery (like the Great Wall of China)
   - The app now automatically finds nearby cities with available imagery
   - Try nearby areas using the "Next Near Area" button
   - **Check that your Mapillary API token is valid and properly configured**

### Network Issues

If you're experiencing network-related problems:
- Try using a mobile hotspot
- Disable VPN or firewall temporarily
- Check if your network blocks speech APIs
- Try a different network environment

## Development

### Project Structure
```
SAYTOGO/
├── index.html          # Main HTML structure
├── styles.css          # Custom styling
├── button-inspiration.css  # Animated button UI
├── script.js           # Main application logic
├── config.example.js   # Example configuration file
├── config.js           # Your configuration (gitignored)
└── README.md           # This file
```

### Key Components

1. **Voice Recognition**: Implemented with Web Speech API in [script.js](script.js)
2. **Geocoding**: Uses OpenStreetMap Nominatim API for location lookup
3. **360° Viewer**: Powered by Mapillary JS SDK
4. **UI Elements**: Custom CSS animations and transitions in [button-inspiration.css](button-inspiration.css)

### Customization

To customize the application:

1. **Styling**: Modify [button-inspiration.css](button-inspiration.css) for UI changes
2. **Functionality**: Edit [script.js](script.js) for core logic modifications
3. **Content**: Update [index.html](index.html) for structural changes
4. **Configuration**: Update [config.js](config.js) for API tokens

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

**Mark Froilan Lendio**
- GitHub: [@maxxNcode](https://github.com/maxxNcode)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Mapillary](https://www.mapillary.com/) for providing the 360° street-level imagery
- [OpenStreetMap](https://www.openstreetmap.org/) for geocoding services
- Browser vendors for implementing the Web Speech API

## Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing [issues](https://github.com/maxxNcode/SAYTOGO/issues)
3. Create a new [issue](https://github.com/maxxNcode/SAYTOGO/issues/new) with detailed information

---

*Experience the world from your browser with SAY TO GO - just speak and teleport!*