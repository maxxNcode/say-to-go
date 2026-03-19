// ============================================================
// History — Search history via localStorage
// ============================================================

const STORAGE_KEY = 'stg_history';
const MAX_ENTRIES = 8;

/**
 * Save a search term (deduplicates, caps at MAX_ENTRIES).
 * @param {string} term
 */
export function saveSearch(term) {
    try {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        history = history.filter(h => h.toLowerCase() !== term.toLowerCase());
        history.unshift(term);
        if (history.length > MAX_ENTRIES) history = history.slice(0, MAX_ENTRIES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.log('Could not save search history:', e);
    }
}

/**
 * Get all saved search terms.
 * @returns {string[]}
 */
export function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

/**
 * Render history as clickable pills into the #recent-tags container.
 * @param {(term: string) => void} onSelect — callback when a pill is clicked
 */
export function renderRecentSearches(onSelect) {
    const section   = document.getElementById('recent-section');
    const container = document.getElementById('recent-tags');
    if (!section || !container) return;

    const history = getHistory();
    if (history.length === 0) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    container.innerHTML = '';

    history.forEach(term => {
        const tag = document.createElement('button');
        tag.className = 'recent-tag';
        tag.setAttribute('role', 'listitem');
        tag.textContent = term;
        tag.addEventListener('click', () => onSelect(term));
        container.appendChild(tag);
    });
}
