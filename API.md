# SAY TO GO - API Documentation

This document provides information about the external APIs used in the SAY TO GO application.

## Web Speech API

### Overview
The Web Speech API enables voice recognition directly in the browser without requiring any external services or API keys.

### Implementation
- **Browser Support**: Chrome, Edge (limited support in Firefox and Safari)
- **Language**: English (en-US) - primary support
- **Security**: Requires HTTPS (except on localhost)
- **Permissions**: Requires user permission for microphone access

### Usage in SAY TO GO
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
```

### Features Used
- Speech-to-text conversion
- Real-time recognition events
- Error handling for various speech recognition issues

### Limitations
- Only works in secure contexts (HTTPS)
- Browser-dependent functionality
- Limited language support depending on browser

## OpenStreetMap Nominatim API

### Overview
OpenStreetMap Nominatim is a search service that provides geocoding capabilities, converting location names into geographic coordinates.

### Endpoint
```
https://nominatim.openstreetmap.org/search
```

### Implementation in SAY TO GO
The application sends HTTP GET requests to the Nominatim API with location queries.

### Request Format
```
GET https://nominatim.openstreetmap.org/search?q={LOCATION}&format=json&limit=1
Headers: {
  'User-Agent': 'SAY TO GO App/1.0 (Educational Project)'
}
```

### Response Format
```json
[
  {
    "place_id": 123456,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "relation",
    "osm_id": 123456,
    "boundingbox": ["51.2867603", "51.6918741", "-0.5103751", "0.3340154"],
    "lat": "51.5073219",
    "lon": "-0.1276474",
    "display_name": "London, Greater London, England, UK",
    "class": "place",
    "type": "city",
    "importance": 0.9320657900587784,
    "icon": "https://nominatim.openstreetmap.org/ui/mapicons//poi_place_city.p.20.png"
  }
]
```

### Usage Flow
1. User speaks a location name
2. Voice is converted to text using Web Speech API
3. Text is sent to Nominatim API
4. API returns geographic coordinates
5. Coordinates are used to search for 360° imagery

### Rate Limiting
- No API key required
- Subject to fair usage policies
- Recommended to include User-Agent header

### Terms of Use
- Data licensed under Open Database License (ODbL)
- Proper attribution required
- No heavy usage without permission

## Mapillary API

### Overview
Mapillary provides street-level imagery and computer vision-powered insights. SAY TO GO uses the Mapillary API to find and display 360° imagery.

### Authentication
The API requires an access token for authentication, which should be configured in `config.js`:
```
// In config.js
const MAPILLARY_CONFIG = {
  ACCESS_TOKEN: 'your_mapillary_access_token_here'
};
```

**Important**: The `config.js` file is excluded from version control via `.gitignore` to protect your API token.

### Image Search Endpoint
```
https://graph.mapillary.com/images
```

### Implementation in SAY TO GO
The application searches for images within a bounding box around the geocoded location.

### Request Format
```
GET https://graph.mapillary.com/images?
  access_token={ACCESS_TOKEN}&
  fields=id,computed_geometry&
  bbox={MIN_LON},{MIN_LAT},{MAX_LON},{MAX_LAT}&
  limit=1
```

### Response Format
```json
{
  "data": [
    {
      "id": "123456789012345",
      "computed_geometry": {
        "type": "Point",
        "coordinates": [ -0.1276474, 51.5073219 ]
      }
    }
  ]
}
```

### Viewer Integration
The Mapillary JS SDK is used to display the 360° imagery:
```javascript
const mapillaryViewer = new mapillary.Viewer({
  accessToken: 'MLY|...',
  container: 'mapillary',
  imageId: imageId
});
```

### Features Used
- Image search by geographic bounds
- 360° panorama viewer
- Navigation between connected images
- Zoom and pan controls

### Limitations
- Coverage varies by location
- Requires valid access token
- Subject to API rate limits

## Error Handling

### Common API Errors

#### Nominatim API Errors
- **403 Forbidden**: Likely due to missing User-Agent header
- **429 Too Many Requests**: Rate limiting
- **500 Internal Server Error**: Temporary server issues

#### Mapillary API Errors
- **400 Bad Request**: Invalid parameters or expired token
- **401 Unauthorized**: Invalid or missing access token
- **403 Forbidden**: Access denied
- **429 Too Many Requests**: Rate limiting

### Error Recovery
SAY TO GO implements several strategies for handling API errors:
1. Fallback location suggestions for common regions
2. Expanded search bounds for better image coverage
3. Detailed error messages with troubleshooting tips
4. Graceful degradation when APIs are unavailable

## Privacy Considerations

### Data Sent to APIs
1. **OpenStreetMap Nominatim**: Location names for geocoding
2. **Mapillary**: Geographic coordinates for image search

### Data Not Collected
- Voice recordings are processed locally and never sent to servers
- No personal identification information
- No usage tracking or analytics

## API Alternatives

### Geocoding Alternatives
If Nominatim is unavailable, potential alternatives include:
- Google Geocoding API (requires API key)
- Mapbox Geocoding API (requires API key)
- HERE Geocoding API (requires API key)

### Street View Alternatives
If Mapillary coverage is insufficient, alternatives include:
- Google Street View API (requires API key)
- Mapbox Streets (requires API key)

## Future API Integrations

### Possible Enhancements
1. **Weather API**: Display current weather at locations
2. **Wikipedia API**: Show information about locations
3. **Translation API**: Support for multiple languages
4. **Travel APIs**: Integration with travel information services
