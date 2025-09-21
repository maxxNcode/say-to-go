# Changelog

All notable changes to the SAY TO GO project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-09-22

### Added
- Separate about page with comprehensive project information
- Creator information (Mark Froilan Lendio, BSIT student at University of Cebu)
- Social links to GitHub and LinkedIn profiles
- Dedicated about.html page with clean, user-friendly design

### Changed
- Moved about button to top right of screen as a simple text button
- Removed background from about section
- Simplified about section design
- Creator information now appears first in the about content

### Removed
- Old inline about section in index.html
- Complex styling for previous about section

## [1.0.2] - 2025-09-22

### Added
- Enhanced about section with detailed project information
- Creator information (Mark Froilan Lendio) and project motivation
- Updated documentation to reflect enhanced about section

### Updated
- README.md with information about enhanced about section
- FEATURES.md with detailed about section features
- USAGE.md with information about accessing the about section
- TROUBLESHOOTING.md with guidance on accessing project information

## [1.0.1] - 2025-09-22

### Security
- **API Token Protection**: Moved Mapillary API token from hardcoded values in script.js to external config.js file
- **Git Ignore Configuration**: Added config.js to .gitignore to prevent accidental exposure of API tokens
- **Configuration Template**: Added config.example.js as a template for users to create their own config.js
- **Configuration Test Page**: Added test-config.html to help users verify their configuration

### Added
- Configuration management system for API tokens
- Config example file for easy setup
- Configuration test page for validation
- Updated documentation to reflect configuration changes

## [1.0.0] - 2025-09-22

### Added
- Initial release of SAY TO GO
- Voice recognition functionality using Web Speech API
- Location geocoding with OpenStreetMap Nominatim
- 360° street-level imagery viewing with Mapillary API
- Animated UI with interactive button elements
- Aurora-inspired background with grid pattern
- Comprehensive documentation including:
  - README with project overview
  - USAGE guide with installation instructions
  - TROUBLESHOOTING guide for common issues
  - FEATURES documentation
  - API documentation
  - CONTRIBUTING guidelines
  - DEPLOYMENT instructions
- SEO optimization with sitemap and robots.txt
- Package metadata with package.json
- License information (MIT)
- Git ignore file for version control
- Favicon concept documentation

### Features
- Voice-powered location search
- Global location coverage
- Immersive 360° viewing experience
- Smart location suggestions for regions
- Back to search functionality
- Next near area exploration
- Responsive design for multiple devices
- Real-time status feedback
- Comprehensive error handling
- Privacy-focused implementation (no data collection)

### Technical Details
- Pure HTML, CSS, and JavaScript implementation
- No build tools required
- Browser-based processing
- HTTPS-ready architecture
- Accessible design principles
- Modular code structure
- Comprehensive commenting

## [Unreleased]

### Planned Improvements
- Multi-language voice recognition support
- Enhanced location information overlays
- User favorites and history tracking
- Social sharing capabilities
- Improved fallback mechanisms for areas with limited coverage
- Performance optimizations for mobile devices
- Additional API integrations (weather, cultural information)
- Enhanced accessibility features
- Dark/light theme toggle
- Keyboard navigation improvements

### Known Issues
- Limited browser support for voice recognition (works best in Chrome/Edge)
- Some locations have limited or no 360° imagery coverage
- Network restrictions may affect API access in some environments
- Mobile browser compatibility varies

## Project Information

### Author
Mark Froilan Lendio ([@maxxNcode](https://github.com/maxxNcode))

### Repository
[https://github.com/maxxNcode/say-to-go](https://github.com/maxxNcode/say-to-go)

### License
MIT License - see [LICENSE](LICENSE) file for details

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to this project.