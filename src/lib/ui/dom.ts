export const $ = {
  status: document.getElementById('status'),
  recognizedText: document.getElementById('recognized-text'),
  loading: document.getElementById('loading'),
  errorMessage: document.getElementById('error-message'),
  micButton: document.getElementById('mic-button'),
  appHeader: document.querySelector('.app-header'),
  mainContent: document.querySelector('.main-content'),
  mapillaryContainer: document.getElementById('mapillary-container'),
  mapillaryLoading: document.getElementById('mapillary-loading'),
  recentTags: document.getElementById('recent-tags'),
  recentSection: document.getElementById('recent-section'),
  searchInput: document.getElementById('search-input') as HTMLInputElement | null,
}
