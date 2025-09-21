# SAY TO GO - Usage Guide

## Prerequisites

Before using SAY TO GO, ensure you have:

1. A Mapillary API token (see Setup Instructions below)
2. A modern web browser (Chrome or Edge recommended)
3. A working microphone
4. An internet connection

## Setup Instructions

### Obtain a Mapillary API Token

SAY TO GO requires a Mapillary API token to display 360° street-level imagery:

1. Go to [Mapillary Developer Dashboard](https://www.mapillary.com/dashboard/developers)
2. Sign in or create a Mapillary account
3. Create a new application
4. Copy your access token

### Configure the Application

1. Copy the example configuration file:
   ```bash
   cp config.example.js config.js
   ```
   
2. Edit `config.js` and replace `YOUR_MAPILLARY_ACCESS_TOKEN_HERE` with your actual token:
   ```javascript
   const MAPILLARY_CONFIG = {
     ACCESS_TOKEN: 'your_actual_mapillary_access_token_here'
   };
   ```

**Important**: The `config.js` file is included in `.gitignore` to prevent accidental exposure of your API token when sharing the code.

## Running the Application

### Method 1: Direct Browser Opening (Recommended for Local Use)

1. Navigate to the project folder
2. Ensure you've set up your Mapillary API token (see Setup Instructions above)
3. Double-click on `index.html` to open it in your default browser
4. When prompted, allow microphone access

### Method 2: Using a Local Server (Recommended for Full Functionality)

For the best experience, especially with voice recognition features, run the app using a local server:

#### Using Node.js (if installed):

1. Install the required dependency:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

#### Using Python (if installed):

1. Open a terminal/command prompt in the project directory
2. Run one of the following commands based on your Python version:
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Python 2
   python -m SimpleHTTPServer 3000
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Method 3: Using VS Code Live Server (if using VS Code)

1. Install the "Live Server" extension by Ritwick Dey
2. Right-click on `index.html` in the file explorer
3. Select "Open with Live Server"
4. The app will open in your default browser

## Using the Application

### Basic Usage

1. When the app loads, you'll see a green "SPEAK LOCATION" button
2. Click the button to activate voice recognition
3. Allow microphone access when prompted by your browser
4. Clearly speak the name of a location you want to visit
5. Wait for the app to process your request and load the 360° view

### Navigation Controls

Once a location loads, you can navigate the 360° view using:

- **Mouse/Touch**: Click and drag to look around
- **Scroll Wheel**: Zoom in and out
- **Arrow Icons**: Click the navigation arrows to move between connected images
- **Keyboard**: Use arrow keys for navigation (if supported by your browser)

### Interface Elements

1. **Back to Search**: Returns you to the main screen to search for another location
2. **Next Near Area**: Finds and loads a nearby location with available 360° imagery
3. **Status Messages**: Provides feedback on the current operation

## Best Practices for Voice Recognition

For optimal voice recognition results:

1. Speak clearly and at a moderate pace
2. Use specific location names (e.g., "Eiffel Tower, Paris" instead of just "Paris")
3. Minimize background noise
4. Ensure your microphone is properly positioned

## Supported Location Types

The app works best with:

- Specific cities (e.g., "New York", "Tokyo")
- Famous landmarks (e.g., "Eiffel Tower", "Big Ben")
- Addresses (e.g., "1600 Pennsylvania Avenue, Washington")
- Well-known locations (e.g., "Times Square", "Central Park")

If you search for a general region (e.g., "Europe", "Canada"), the app will suggest specific cities within that region.

## Troubleshooting

### Microphone Issues

If the app can't access your microphone:

1. Check that your microphone is properly connected
2. Ensure your browser has microphone permissions:
   - Chrome: Click the microphone icon in the address bar and select "Allow"
   - Edge: Click the permissions icon next to the address bar and allow microphone access
3. Restart your browser and try again

### Location Not Found

If your location isn't found:

1. Try a more specific name (add country or city)
2. Use well-known landmarks instead of general areas
3. Check your spelling
4. Try alternative names for the location

### 360° View Not Loading

If the 360° view doesn't load:

1. Some locations have limited or no street-level imagery
2. Try the "Next Near Area" button to find nearby locations with imagery
3. Try a different, well-known location
4. Check your internet connection

### Browser Compatibility

For the best experience, use:
- Google Chrome (recommended)
- Microsoft Edge

Firefox and Safari have limited support for the Web Speech API used for voice recognition.

## Privacy and Security

- All voice processing happens locally in your browser
- No voice data is sent to external servers
- Location data is sent to OpenStreetMap and Mapillary APIs only for geocoding and image retrieval
- No personal data is collected or stored by the application