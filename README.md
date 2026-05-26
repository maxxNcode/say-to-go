# SAY TO GO - Voice-Powered Teleportation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/last-commit/maxxNcode/say-to-go)](https://github.com/maxxNcode/say-to-go)

Experience different places virtually by simply speaking the location name. SAY TO GO uses voice recognition to teleport you to any location in the world with stunning 360° street-level imagery.

## Features

- **Voice Recognition**: Speak any location name to teleport instantly
- **Global Coverage**: Explore cities, landmarks, and locations worldwide
- **360° Views**: Experience immersive street-level imagery powered by Mapillary
- **Simple Clean UI**: Simple and clean interface
- **Responsive Design**: Works on desktop and mobile devices
- **Nearby Location**: Automatically finds nearby locations with imagery when direct coverage is unavailable
- **Separate About Page**: Learn more about the project and creator (Mark Froilan Lendio, BSIT student at University of Cebu) with dedicated about page

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

Copy `.env.example` to `.env` and set your Mapillary token:
```bash
cp .env.example .env
```

Then edit `.env`:
```
VITE_MAPILLARY_TOKEN=your_actual_mapillary_access_token_here
```

## How It Works

1. **Voice Input**: Click the "SPEAK LOCATION" button and say any location name
2. **Speech Recognition**: The Web Speech API converts your voice to text
3. **Geocoding**: OpenStreetMap Nominatim translates the location name to coordinates
4. **Coverage Check**: The app automatically checks for Mapillary coverage at the location
5. **Nearby Search**: If no direct imagery is available, the app searches for nearby cities with coverage
6. **Image Search**: Mapillary API finds the nearest available 360° imagery
7. **Immersive View**: The 360° viewer displays the location with full navigation controls

## Installation

```bash
git clone https://github.com/maxxNcode/say-to-go.git
cd say-to-go
npm install
cp .env.example .env   # Add your Mapillary token
npm run dev            # Start dev server
```

For production:
```bash
npm run build          # Output in dist/
npm run preview        # Preview production build
```

**Note**: For full functionality, the app requires:
- HTTPS connection (except when running on localhost)
- Microphone access permissions
- Internet connection for API access

## Deployment

### Vercel (Recommended)

The project includes a `vercel.json` configured for Vite builds:

1. Push to GitHub
2. Import to Vercel
3. Add `VITE_MAPILLARY_TOKEN` to Vercel environment variables
4. Deploy

### Other Platforms

Any static host works:
```bash
npm run build      # Produces dist/
# Deploy dist/ to Netlify, GitHub Pages, Firebase, etc.
```

Set the `VITE_MAPILLARY_TOKEN` environment variable on your hosting platform.

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
9. Try the "Near Area" button to explore nearby locations
10. Click the "ABOUT" button to learn more about the project

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
   - Try nearby areas using the "Near Area" button
   - **Check that your Mapillary API token is valid and properly configured**

### Network Issues

If you're experiencing network-related problems:
- Try using a mobile hotspot
- Disable VPN or firewall temporarily
- Check if your network blocks speech APIs
- Try a different network environment

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/maxxNcode/say-to-go.git
cd say-to-go
npm install
cp .env.example .env  # Then add your Mapillary token
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | TypeScript check + production build to `dist/` |
| `npm test` | Run unit tests (Vitest) |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

### Project Structure

```
src/
├── main.ts               # Entry point
├── types.ts              # Shared TypeScript interfaces
├── style.css             # Design system & styles
├── data/
│   └── suggestions.ts    # Location suggestion map
└── lib/
    ├── env.ts            # API token management
    ├── state.ts          # Centralized app state
    ├── speech.ts         # Web Speech API recognition
    ├── history.ts        # Search history (localStorage)
    ├── geocoding.ts      # Nominatim geocoding
    ├── mapillary/
    │   ├── api.ts        # Mapillary API fetching
    │   └── viewer.ts     # Mapillary viewer lifecycle
    └── ui/
        ├── dom.ts        # DOM refs cache
        └── controller.ts # View transitions, buttons, errors
```

### Key Components

1. **Voice Recognition**: `src/lib/speech.ts` — Web Speech API with retry logic
2. **Geocoding**: `src/lib/geocoding.ts` — OpenStreetMap Nominatim API
3. **360° Viewer**: `src/lib/mapillary/` — Mapillary JS SDK integration
4. **State**: `src/lib/state.ts` — Centralized application state

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