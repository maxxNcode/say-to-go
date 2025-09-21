// DOM Elements
const micButton = document.getElementById('mic-button');
const statusText = document.getElementById('status');
const recognizedText = document.getElementById('recognized-text');
const mapillaryContainer = document.getElementById('mapillary-container');
const mapillaryElement = document.getElementById('mapillary');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const appHeader = document.querySelector('.app-header');
const appFooter = document.querySelector('.app-footer');
const experienceAudio = document.getElementById('experience-audio');

// Mapillary variables
let mapillaryViewer;
let currentLocation = { lat: null, lon: null, name: null };

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

// Enhanced error handling for speech recognition
function handleSpeechError(event) {
    console.error('Speech recognition error', event);
    let errorMsg = `Speech recognition error: ${event.error}`;
    
    // Provide more specific error messages
    switch(event.error) {
        case 'network':
            errorMsg = 'Network connection issue detected. ';
            errorMsg += 'This is commonly caused by network restrictions rather than poor connectivity. ';
            errorMsg += 'Try: 1) Using a mobile hotspot, 2) Disabling VPN/firewall, ';
            errorMsg += '3) Checking if your network blocks speech APIs, ';
            errorMsg += '4) Using a different network environment.';
            break;
        case 'not-allowed':
            errorMsg = 'Microphone access denied. Please allow microphone access in your browser settings. ';
            errorMsg += 'Click the microphone icon in the address bar and select "Allow".';
            break;
        case 'service-not-allowed':
            errorMsg = 'Speech service not allowed. Please check your browser settings. ';
            errorMsg += 'Try clearing browser cache or using an incognito window.';
            break;
        case 'no-speech':
            errorMsg = 'No speech detected. Please speak clearly into your microphone. ';
            errorMsg += 'Ensure your microphone is working and there is minimal background noise.';
            break;
        case 'audio-capture':
            errorMsg = 'Audio capture error. Please check your microphone connection and settings.';
            break;
        case 'bad-grammar':
            errorMsg = 'Grammar error. Please try speaking more clearly.';
            break;
        case 'language-not-supported':
            errorMsg = 'Language not supported. Please try English.';
            break;
        default:
            errorMsg = `Speech recognition error: ${event.error}. Please try again.`;
    }
    
    showError(errorMsg);
    resetUI();
}

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        console.log('Speech recognition started');
        if (micButton) micButton.classList.add('listening');
        statusText.textContent = 'Listening... Speak now';
        loadingElement.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized:', transcript);
        recognizedText.textContent = transcript;
        statusText.textContent = 'Processing your request...';
        
        // Play subtle sound when location is recognized
        if (experienceAudio) {
            try {
                experienceAudio.volume = 0.5;
                experienceAudio.currentTime = 0;
                experienceAudio.play().catch(e => console.log('Audio play failed:', e));
            } catch (e) {
                console.log('Audio play failed:', e);
            }
        }
        
        // Process the recognized text
        processLocation(transcript);
    };
    
    recognition.onerror = handleSpeechError;
    
    recognition.onend = () => {
        console.log('Speech recognition ended');
        if (micButton) micButton.classList.remove('listening');
        loadingElement.classList.add('hidden');
    };
} else {
    showError('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
}

// Event Listeners
if (micButton) {
    micButton.addEventListener('click', () => {
        if (recognition) {
            try {
                // Check for secure context (HTTPS required for speech API in production)
                if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    showError('Speech recognition requires a secure connection (HTTPS). Please use HTTPS or test on localhost.');
                    return;
                }
                
                // Play subtle click sound
                if (experienceAudio) {
                    try {
                        experienceAudio.volume = 0.3;
                        experienceAudio.currentTime = 0;
                        experienceAudio.play().catch(e => console.log('Audio play failed:', e));
                    } catch (e) {
                        console.log('Audio play failed:', e);
                    }
                }
                
                recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                showError('Error starting voice recognition. Please try again. Technical details: ' + error.message);
            }
        }
    });
}

// Process the recognized location
function processLocation(location) {
    if (!location.trim()) {
        showError('No location recognized. Please try again.');
        resetUI();
        return;
    }
    
    // Provide better suggestions for common locations
    const locationSuggestions = {
        'paris': 'Eiffel Tower, Paris',
        'london': 'Big Ben, London',
        'new york': 'Times Square, New York',
        'tokyo': 'Shibuya Crossing, Tokyo',
        'sydney': 'Sydney Opera House, Sydney',
        'africa': 'Cairo, Egypt',
        'asia': 'Tokyo, Japan',
        'europe': 'Paris, France',
        'north america': 'New York, USA',
        'south america': 'Rio de Janeiro, Brazil',
        'australia': 'Sydney, Australia',
        'antarctica': 'McMurdo Station, Antarctica',
        'middle east': 'Dubai, UAE',
        'canada': 'Toronto, Canada'  // Add specific suggestion for Canada
    };
    
    // Provide helpful tips for common regions
    const regionTips = {
        'africa': 'Note: Try specific cities like Cairo, Egypt or Cape Town, South Africa',
        'asia': 'Note: Try specific cities like Tokyo, Japan or Bangkok, Thailand',
        'europe': 'Note: Try specific cities like Paris, France or London, UK',
        'north america': 'Note: Try specific cities like New York, USA or Toronto, Canada',
        'south america': 'Note: Try specific cities like Rio de Janeiro, Brazil or Buenos Aires, Argentina',
        'australia': 'Note: Try specific cities like Sydney, Australia or Melbourne, Australia',
        'middle east': 'Note: Try specific cities like Dubai, UAE or Istanbul, Turkey',
        'canada': 'Note: Try specific cities like Toronto, Vancouver, or Montreal'
    };
    
    const normalizedLocation = location.toLowerCase().trim();
    const suggestedLocation = locationSuggestions[normalizedLocation] || location;
    
    if (suggestedLocation !== location) {
        statusText.textContent = `Searching for "${suggestedLocation}" (improved search)...`;
    } else {
        statusText.textContent = `Searching for "${location}"...`;
    }
    
    // Add helpful tip for common regions
    if (regionTips[normalizedLocation]) {
        setTimeout(() => {
            if (statusText.textContent.includes(location)) {
                statusText.textContent += ` ${regionTips[normalizedLocation]}`;
            }
        }, 1000);
    }
    
    // Geocode the location using OpenStreetMap Nominatim
    geocodeLocation(suggestedLocation);
}

// Geocode location using OpenStreetMap Nominatim API
async function geocodeLocation(location) {
    console.log('Geocoding location:', location);
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'SAY TO GO App/1.0 (Educational Project)'
                }
            }
        );
        
        console.log('Geocoding response status:', response.status);
        if (!response.ok) {
            throw new Error(`Geocoding failed with status ${response.status}. This may indicate a network restriction.`);
        }
        
        const data = await response.json();
        console.log('Geocoding response data:', data);
        
        if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            console.log('Geocoded location:', { lat, lon });
            showMapillaryView(lat, lon, location);
        } else {
            // Try fallback locations for common regions
            const fallbackLocations = {
                'africa': ['Cairo, Egypt', 'Cape Town, South Africa', 'Lagos, Nigeria'],
                'asia': ['Tokyo, Japan', 'Bangkok, Thailand', 'Singapore'],
                'europe': ['Paris, France', 'London, UK', 'Rome, Italy'],
                'north america': ['New York, USA', 'Toronto, Canada', 'Mexico City, Mexico'],
                'south america': ['Rio de Janeiro, Brazil', 'Buenos Aires, Argentina', 'Lima, Peru'],
                'australia': ['Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia'],
                'middle east': ['Dubai, UAE', 'Istanbul, Turkey', 'Tel Aviv, Israel'],
                'canada': ['Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada']  // Add specific fallbacks for Canada
            };
            
            const normalizedLocation = location.toLowerCase();
            const fallbacks = fallbackLocations[normalizedLocation];
            
            if (fallbacks && fallbacks.length > 0) {
                console.log(`Trying fallback locations for ${location}`);
                statusText.textContent = `Searching for "${location}"... Trying alternative locations.`;
                
                for (const fallback of fallbacks) {
                    try {
                        console.log(`Trying fallback location: ${fallback}`);
                        statusText.textContent = `Searching for "${location}"... Checking ${fallback}.`;
                        
                        const fallbackResponse = await fetch(
                            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fallback)}&format=json&limit=1`,
                            {
                                headers: {
                                    'User-Agent': 'SAY TO GO App/1.0 (Educational Project)'
                                }
                            }
                        );
                        
                        if (fallbackResponse.ok) {
                            const fallbackData = await fallbackResponse.json();
                            if (fallbackData.length > 0) {
                                const lat = parseFloat(fallbackData[0].lat);
                                const lon = parseFloat(fallbackData[0].lon);
                                console.log('Geocoded fallback location:', { lat, lon });
                                showMapillaryView(lat, lon, fallback);
                                return;
                            }
                        }
                    } catch (fallbackError) {
                        console.log(`Fallback location ${fallback} failed:`, fallbackError);
                    }
                }
            }
            
            throw new Error('No results found for the location');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        showError(`Could not find location: ${location}. Please try again. Error: ${error.message}`);
        resetUI();
    }
}

// Show Mapillary 360° view for the location
async function showMapillaryView(lat, lon, locationName) {
    console.log('Showing Mapillary view for:', { lat, lon, locationName });
    statusText.textContent = `Loading experience for "${locationName}"...`;
    
    try {
        // Update currentLocation with the new coordinates
        currentLocation = { lat, lon, name: locationName };
        
        // Show loading indicator first
        const mapillaryLoading = document.getElementById('mapillary-loading');
        if (mapillaryLoading) {
            // Update loading text
            const loadingText = mapillaryLoading.querySelector('p');
            if (loadingText) {
                loadingText.textContent = `Loading experience for "${locationName}"...`;
            }
            mapillaryLoading.classList.remove('hidden');
        }
        
        // Show the Mapillary container (remove hidden class)
        document.querySelector('.main-content').classList.add('hidden');
        mapillaryContainer.classList.remove('hidden');
        
        // Hide header and footer for full screen view
        if (appHeader) appHeader.classList.add('hidden');
        if (appFooter) appFooter.classList.add('hidden');
        
        // Force a reflow to ensure proper sizing
        mapillaryContainer.style.display = 'block';
        const container = document.getElementById('mapillary');
        container.style.width = '100%';
        container.style.height = '100%';
        
        // Add a small delay to ensure DOM has fully rendered before initializing viewer
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use Mapillary access token from config
        const MAPILLARY_ACCESS_TOKEN = window.MAPILLARY_CONFIG?.ACCESS_TOKEN || 'YOUR_MAPILLARY_ACCESS_TOKEN_HERE';
        
        // Try multiple bounding box sizes to find images, including larger areas for countries like Canada
        const bboxSizes = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2];
        let imageData = null;
        let imageId = null;
        
        for (const size of bboxSizes) {
            try {
                console.log(`Trying Mapillary search with bbox size: ${size}`);
                const response = await fetch(
                    `https://graph.mapillary.com/images?access_token=${MAPILLARY_ACCESS_TOKEN}&fields=id,computed_geometry&bbox=${lon-size},${lat-size},${lon+size},${lat+size}&limit=1`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Mapillary response with bbox ${size}:`, data);
                    
                    if (data.data && data.data.length > 0) {
                        imageData = data;
                        imageId = data.data[0].id;
                        console.log('Found image ID:', imageId);
                        break;
                    }
                } else {
                    const errorText = await response.text();
                    console.warn(`Mapillary API request with bbox ${size} failed:`, errorText);
                    
                    // Check if it's an OAuth error
                    if (response.status === 400 && errorText.includes('OAuthException')) {
                        throw new Error('Mapillary API access token is invalid. Please check your token.');
                    }
                }
            } catch (error) {
                console.warn(`Mapillary search with bbox ${size} failed:`, error.message);
            }
        }
        
        if (!imageId) {
            // Try searching for a well-known location as fallback
            const fallbackSuggestions = {
                'africa': 'Cairo, Egypt or Cape Town, South Africa',
                'asia': 'Tokyo, Japan or Bangkok, Thailand',
                'europe': 'Paris, France or London, UK',
                'north america': 'New York, USA or Toronto, Canada',
                'south america': 'Rio de Janeiro, Brazil or Buenos Aires, Argentina',
                'australia': 'Sydney, Australia or Melbourne, Australia',
                'middle east': 'Dubai, UAE or Istanbul, Turkey',
                'antarctica': 'McMurdo Station, Antarctica (limited coverage)',
                'canada': 'Toronto, Canada or Vancouver, Canada'
            };
            
            const suggestion = fallbackSuggestions[locationName.toLowerCase()] || 
                             '"Eiffel Tower, Paris" or "Times Square, New York"';
            
            throw new Error(`No Mapillary images found near "${locationName}". ` +
                          `Try a more specific location like ${suggestion}. ` +
                          `Note: Mapillary coverage is limited to areas with street-level imagery.`);
        }
        
        console.log('Initializing Mapillary viewer');
        // Initialize Mapillary viewer
        initMapillaryViewer(imageId, MAPILLARY_ACCESS_TOKEN);
        
        statusText.textContent = `Showing 360° view for "${locationName}"`;
        
        // Add back button
        addBackButton();
    } catch (error) {
        console.error('Mapillary error:', error);
        
        // Hide loading indicator
        const mapillaryLoading = document.getElementById('mapillary-loading');
        if (mapillaryLoading) {
            mapillaryLoading.classList.add('hidden');
        }
        
        // Show search container again
        mapillaryContainer.classList.add('hidden');
        document.querySelector('.main-content').classList.remove('hidden');
        
        // Show header and footer again
        if (appHeader) appHeader.classList.remove('hidden');
        if (appFooter) appFooter.classList.remove('hidden');
        
        // Provide specific guidance for OAuth errors
        if (error.message.includes('access token is invalid')) {
            showError(`${error.message}\n\nPlease check your Mapillary API token.`);
        } else {
            showError(`360° view not available for "${locationName}". Please try another location. Error: ${error.message}`);
        }
        resetUI();
    }
}

// Initialize Mapillary viewer
function initMapillaryViewer(imageId, accessToken) {
    try {
        console.log('Initializing Mapillary viewer with image ID:', imageId);
        // Clear previous viewer if exists
        if (mapillaryViewer) {
            console.log('Removing existing Mapillary viewer');
            mapillaryViewer.remove();
            mapillaryViewer = null;
        }
        
        // Check if Mapillary SDK is loaded
        if (typeof mapillary === 'undefined') {
            throw new Error('Mapillary SDK not loaded. Please check your internet connection and try again.');
        }
        
        // Ensure the container is visible and properly sized before initializing
        const container = document.getElementById('mapillary');
        if (!container) {
            throw new Error('Mapillary container not found');
        }
        
        // Make sure container is visible and properly sized
        container.style.display = 'block';
        container.style.width = '100vw';
        container.style.height = '100vh';
        
        console.log('Container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
        
        // Wait for container to be properly rendered
        setTimeout(() => {
            // Create new viewer with the provided access token and proper configuration
            console.log('Creating new Mapillary viewer with enhanced configuration');
            // Use Mapillary access token from config if not provided
            const MAPILLARY_ACCESS_TOKEN = accessToken || window.MAPILLARY_CONFIG?.ACCESS_TOKEN || 'YOUR_MAPILLARY_ACCESS_TOKEN_HERE';
            
            mapillaryViewer = new mapillary.Viewer({
                accessToken: MAPILLARY_ACCESS_TOKEN,
                container: 'mapillary',
                imageId: imageId,
                component: {
                    cover: false,  // Disable cover component
                    sequence: true,  // Enable sequence navigation
                    direction: true,  // Enable direction component
                    zoom: true  // Enable zoom component
                }
            });
            
            // Ensure viewer is properly initialized
            mapillaryViewer.on('load', function() {
                console.log('Viewer fully loaded');
                // Make sure all components are activated
                try {
                    if (mapillaryViewer.getComponent('sequence')) {
                        mapillaryViewer.getComponent('sequence').activate();
                    }
                    if (mapillaryViewer.getComponent('direction')) {
                        mapillaryViewer.getComponent('direction').activate();
                    }
                    if (mapillaryViewer.getComponent('zoom')) {
                        mapillaryViewer.getComponent('zoom').activate();
                    }
                } catch (e) {
                    console.log('Component activation error:', e);
                }
            });
            
            console.log('Mapillary viewer initialized successfully with image ID:', imageId);
            
            // Add event listeners for viewer
            mapillaryViewer.on('load', function() {
                console.log('Mapillary viewer loaded successfully');
                // Ensure the viewer is visible after loading
                container.style.backgroundColor = '#000';
                
                // Hide loading indicator
                const mapillaryLoading = document.getElementById('mapillary-loading');
                if (mapillaryLoading) {
                    mapillaryLoading.classList.add('hidden');
                }
                
                // Play audio cue
                if (experienceAudio) {
                    try {
                        experienceAudio.volume = 0.8;
                        experienceAudio.play().catch(e => console.log('Audio play failed:', e));
                    } catch (e) {
                        console.log('Audio play failed:', e);
                    }
                }
                
                // Add navigation instructions
                console.log('Mapillary viewer navigation instructions:');
                console.log('- Drag to look around');
                console.log('- Scroll to zoom in/out');
                console.log('- Click on arrows to navigate between images');
                
                // Set up user interaction detection to ensure controls work properly
                setupViewerControls();
            });
            
            mapillaryViewer.on('error', function(error) {
                console.error('Mapillary viewer error:', error);
                showError(`Failed to load 360° viewer. Error: ${error.message}`);
                
                // Hide loading indicator
                const mapillaryLoading = document.getElementById('mapillary-loading');
                if (mapillaryLoading) {
                    mapillaryLoading.classList.add('hidden');
                }
            });
        }, 200); // Small delay to ensure container is properly rendered
    } catch (error) {
        console.error('Error initializing Mapillary viewer:', error);
        showError(`Failed to load 360° viewer. Error: ${error.message}`);
        
        // Hide loading indicator
        const mapillaryLoading = document.getElementById('mapillary-loading');
        if (mapillaryLoading) {
            mapillaryLoading.classList.add('hidden');
        }
        
        // Show search container again
        mapillaryContainer.classList.add('hidden');
        document.querySelector('.main-content').classList.remove('hidden');
        resetUI();
    }
}

// Set up proper viewer controls
function setupViewerControls() {
    if (!mapillaryViewer || !mapillaryContainer) return;
    
    // Ensure all navigation components are properly activated
    try {
        // Activate sequence navigation (allows moving between images)
        if (mapillaryViewer.getComponent('sequence')) {
            mapillaryViewer.getComponent('sequence').activate();
        }
        
        // Activate direction component (shows navigation arrows)
        if (mapillaryViewer.getComponent('direction')) {
            mapillaryViewer.getComponent('direction').activate();
        }
        
        // Activate zoom component
        if (mapillaryViewer.getComponent('zoom')) {
            mapillaryViewer.getComponent('zoom').activate();
        }
        
        console.log('Viewer controls activated successfully');
    } catch (e) {
        console.log('Error activating viewer controls:', e);
    }
    
    // List of events that indicate user interaction
    const userEvents = ['mousedown', 'mousemove', 'wheel', 'touchstart', 'touchmove', 'keydown'];
    
    // Function to ensure controls remain responsive
    const onUserInteraction = () => {
        try {
            // Re-activate components if needed
            if (mapillaryViewer && mapillaryViewer.getComponent) {
                try {
                    const sequenceComponent = mapillaryViewer.getComponent('sequence');
                    if (sequenceComponent && !sequenceComponent.isActive()) {
                        sequenceComponent.activate();
                    }
                } catch (e) {
                    console.log('Sequence component re-activation check failed:', e);
                }
                
                try {
                    const directionComponent = mapillaryViewer.getComponent('direction');
                    if (directionComponent && !directionComponent.isActive()) {
                        directionComponent.activate();
                    }
                } catch (e) {
                    console.log('Direction component re-activation check failed:', e);
                }
                
                try {
                    const zoomComponent = mapillaryViewer.getComponent('zoom');
                    if (zoomComponent && !zoomComponent.isActive()) {
                        zoomComponent.activate();
                    }
                } catch (e) {
                    console.log('Zoom component re-activation check failed:', e);
                }
            }
        } catch (e) {
            console.log('Error during user interaction handling:', e);
        }
    };
    
    // Add event listeners for user interaction
    userEvents.forEach(event => {
        mapillaryContainer.addEventListener(event, onUserInteraction, { passive: true });
    });
}

// Add back button and next near area button to Mapillary view
function addBackButton() {
    // Remove existing back button if present
    const existingButton = document.getElementById('back-button-container');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Create back button container
    const backButtonContainer = document.createElement('div');
    backButtonContainer.id = 'back-button-container';
    backButtonContainer.style.position = 'absolute';
    backButtonContainer.style.top = '20px';
    backButtonContainer.style.left = '20px';
    backButtonContainer.style.zIndex = '1002';
    backButtonContainer.style.display = 'flex';
    backButtonContainer.style.gap = '10px';
    
    // Create back button
    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.textContent = '← Back to Search';
    backButton.style.padding = '10px 15px';
    backButton.style.background = '#000';
    backButton.style.border = '1px solid #fff';
    backButton.style.borderRadius = '5px';
    backButton.style.color = '#fff';
    backButton.style.cursor = 'pointer';
    backButton.style.fontWeight = 'bold';
    backButton.style.boxShadow = '0 2px 5px rgba(255,255,255,0.2)';
    
    // Add event listener for back button
    backButton.addEventListener('click', () => {
        mapillaryContainer.classList.add('hidden');
        document.querySelector('.main-content').classList.remove('hidden');
        recognizedText.textContent = '';
        statusText.textContent = 'Click the button and say a location';
        
        // Show header and footer again
        if (appHeader) appHeader.classList.remove('hidden');
        if (appFooter) appFooter.classList.remove('hidden');
        
        // Remove back button
        backButtonContainer.remove();
        
        // Remove Mapillary viewer
        if (mapillaryViewer) {
            mapillaryViewer.remove();
            mapillaryViewer = null;
        }
    });
    
    // Create next near area button
    const nextNearAreaButton = document.createElement('button');
    nextNearAreaButton.id = 'next-near-area-button';
    nextNearAreaButton.textContent = 'Next Near Area';
    nextNearAreaButton.style.padding = '10px 15px';
    nextNearAreaButton.style.background = '#000';
    nextNearAreaButton.style.border = '1px solid #4ecca3';
    nextNearAreaButton.style.borderRadius = '5px';
    nextNearAreaButton.style.color = '#4ecca3';
    nextNearAreaButton.style.cursor = 'pointer';
    nextNearAreaButton.style.fontWeight = 'bold';
    nextNearAreaButton.style.boxShadow = '0 2px 5px rgba(78, 204, 163, 0.2)';
    
    // Add event listener for next near area button
    nextNearAreaButton.addEventListener('click', async () => {
        console.log('Next Near Area button clicked');
        console.log('Current location:', currentLocation);
        
        if (currentLocation.lat !== null && currentLocation.lon !== null) {
            try {
                // Show loading indicator
                const mapillaryLoading = document.getElementById('mapillary-loading');
                if (mapillaryLoading) {
                    // Update loading text
                    const loadingText = mapillaryLoading.querySelector('p');
                    if (loadingText) {
                        loadingText.textContent = `Searching for nearby areas to "${currentLocation.name}"...`;
                    }
                    mapillaryLoading.classList.remove('hidden');
                }
                
                // Update status text
                statusText.textContent = `Searching for nearby areas to "${currentLocation.name}"...`;
                
                // Try to find a nearby area with 360° view
                const nearbyArea = await findNearbyAreaWith360View(currentLocation.lat, currentLocation.lon, currentLocation.name);
                
                if (nearbyArea) {
                    console.log('Found nearby area:', nearbyArea);
                    // Remove current viewer
                    if (mapillaryViewer) {
                        mapillaryViewer.remove();
                        mapillaryViewer = null;
                    }
                    
                    // Show new area with updated loading text
                    const mapillaryLoading = document.getElementById('mapillary-loading');
                    if (mapillaryLoading) {
                        const loadingText = mapillaryLoading.querySelector('p');
                        if (loadingText) {
                            loadingText.textContent = `Loading experience for "${nearbyArea.name}"...`;
                        }
                    }
                    showMapillaryView(nearbyArea.lat, nearbyArea.lon, nearbyArea.name);
                } else {
                    console.log('No nearby areas found');
                    // Hide loading indicator
                    const mapillaryLoading = document.getElementById('mapillary-loading');
                    if (mapillaryLoading) {
                        mapillaryLoading.classList.add('hidden');
                    }
                    
                    showError(`No nearby areas with 360° views found for "${currentLocation.name}". Try a different location.`);
                }
            } catch (error) {
                console.error('Error finding nearby area:', error);
                
                // Hide loading indicator
                const mapillaryLoading = document.getElementById('mapillary-loading');
                if (mapillaryLoading) {
                    mapillaryLoading.classList.add('hidden');
                }
                
                showError(`Error finding nearby area: ${error.message}`);
            }
        } else {
            console.log('Current location not set');
            showError('Current location not available. Please go back and search for a location again.');
        }
    });
    
    // Add buttons to container and append to body
    backButtonContainer.appendChild(backButton);
    backButtonContainer.appendChild(nextNearAreaButton);
    document.body.appendChild(backButtonContainer);
}

// Reset UI to initial state
function resetUI() {
    if (micButton) micButton.classList.remove('listening');
    loadingElement.classList.add('hidden');
    recognizedText.textContent = '';
}

let automaticNavigationInterval = null;
let automaticNavigationActive = false;

// Set up user interaction detection is now handled in setupViewerControls function

// Find nearby area with 360° view
async function findNearbyAreaWith360View(lat, lon, originalLocationName) {
    console.log('Searching for nearby areas with 360° views');
    
    try {
        // Use Mapillary access token from config
        const MAPILLARY_ACCESS_TOKEN = window.MAPILLARY_CONFIG?.ACCESS_TOKEN || 'YOUR_MAPILLARY_ACCESS_TOKEN_HERE';
        
        // Define search parameters for nearby areas
        // We'll search in expanding circles around the original location
        const searchOffsets = [
            { latOffset: 0.001, lonOffset: 0.001 },  // Very close
            { latOffset: -0.001, lonOffset: -0.001 },
            { latOffset: 0.001, lonOffset: -0.001 },
            { latOffset: -0.001, lonOffset: 0.001 },
            { latOffset: 0.002, lonOffset: 0.002 },  // A bit further
            { latOffset: -0.002, lonOffset: -0.002 },
            { latOffset: 0.002, lonOffset: -0.002 },
            { latOffset: -0.002, lonOffset: 0.002 },
            { latOffset: 0.003, lonOffset: 0.003 },  // Further out
            { latOffset: -0.003, lonOffset: -0.003 }
        ];
        
        // Try each offset to find a nearby area with images
        for (const offset of searchOffsets) {
            try {
                const nearbyLat = lat + offset.latOffset;
                const nearbyLon = lon + offset.lonOffset;
                
                console.log(`Checking nearby coordinates: ${nearbyLat}, ${nearbyLon}`);
                
                // Try to find images at this nearby location
                const response = await fetch(
                    `https://graph.mapillary.com/images?access_token=${MAPILLARY_ACCESS_TOKEN}&fields=id,computed_geometry&bbox=${nearbyLon-0.001},${nearbyLat-0.001},${nearbyLon+0.001},${nearbyLat+0.001}&limit=1`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.data && data.data.length > 0) {
                        // Found images at this nearby location
                        console.log('Found nearby area with 360° views');
                        
                        // Try to get a human-readable name for this location using reverse geocoding
                        try {
                            const reverseGeocodeResponse = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${nearbyLat}&lon=${nearbyLon}`,
                                {
                                    headers: {
                                        'User-Agent': 'SAY TO GO App/1.0 (Educational Project)'
                                    }
                                }
                            );
                            
                            if (reverseGeocodeResponse.ok) {
                                const reverseData = await reverseGeocodeResponse.json();
                                if (reverseData.display_name) {
                                    const nearbyName = reverseData.display_name.split(',')[0]; // Get just the first part
                                    return { lat: nearbyLat, lon: nearbyLon, name: `${nearbyName} (near ${originalLocationName})` };
                                }
                            }
                        } catch (geocodeError) {
                            console.log('Reverse geocoding failed:', geocodeError);
                        }
                        
                        // Fallback to coordinates if reverse geocoding fails
                        return { lat: nearbyLat, lon: nearbyLon, name: `Nearby area (${nearbyLat.toFixed(4)}, ${nearbyLon.toFixed(4)})` };
                    }
                }
            } catch (error) {
                console.log('Error checking nearby area:', error);
            }
        }
        
        // If we get here, no nearby areas with images were found
        console.log('No nearby areas with 360° views found');
        return null;
    } catch (error) {
        console.error('Error in findNearbyAreaWith360View:', error);
        throw error;
    }
}

// Show error message with enhanced information
function showError(message) {
    // Add troubleshooting information for network errors
    if (message.includes('network') || message.includes('Network')) {
        message += '\n\nTroubleshooting tips:\n';
        message += '• Try using a mobile hotspot\n';
        message += '• Disable VPN or firewall temporarily\n';
        message += '• Check if your network blocks speech APIs\n';
        message += '• Try a different network environment\n';
        message += '• See NETWORK-TROUBLESHOOTING.md for detailed help';
    }
    
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    
    // Hide error after 15 seconds for detailed messages
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 15000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('SAY TO GO app initialized');
    statusText.textContent = 'Click the button and say a location';
    
    // Check for browser compatibility
    if (!SpeechRecognition) {
        showError('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
    }
    
    // Check for secure context warning
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.warn('Speech recognition requires HTTPS in production');
    }
});