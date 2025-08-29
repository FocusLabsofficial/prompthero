// CodePrompt Hub - Main JavaScript functionality

// Global variables
let currentPrompts = [];
let allPrompts = [];

// Load prompts from API
async function loadPromptsFromAPI() {
    try {
        const response = await fetch('/api/prompts');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Transform API data to match frontend format
        allPrompts = data.prompts.map(prompt => ({
            id: prompt.id,
            title: prompt.title,
            category: prompt.category,
            language: prompt.language,
            text: prompt.prompt_text,
            description: prompt.description,
            rating: prompt.rating,
            ratingCount: prompt.rating_count || 0,
            uses: prompt.usage_count || 0,
            likes: 0, // API doesn't have likes yet
            tags: prompt.tags || [],
            created_at: prompt.created_at
        }));
        
        currentPrompts = [...allPrompts];
        loadPrompts(currentPrompts);
        updateResultsCount();
        
        console.log(`✅ Loaded ${allPrompts.length} prompts from API`);
    } catch (error) {
        console.error('❌ Error loading prompts from API:', error);
        // Fallback to empty state
        allPrompts = [];
        currentPrompts = [];
        loadPrompts([]);
        updateResultsCount();
    }
}

// Load prompts into the UI
function loadPrompts(prompts) {
    const grid = document.getElementById('unifiedGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (prompts.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>No prompts found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    prompts.forEach(prompt => {
        const promptCard = createPromptCard(prompt);
        grid.appendChild(promptCard);
    });
}

// Create a prompt card element
function createPromptCard(prompt) {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.innerHTML = `
        <div class="prompt-header">
            <h3 class="prompt-title">${prompt.title}</h3>
            <div class="prompt-meta">
                <span class="prompt-category">${prompt.category}</span>
                <span class="prompt-language">${prompt.language}</span>
            </div>
        </div>
        <p class="prompt-description">${prompt.description}</p>
        <div class="prompt-stats">
            <span class="rating">⭐ ${prompt.rating.toFixed(1)}</span>
            <span class="uses">📊 ${prompt.uses} uses</span>
        </div>
        <div class="prompt-actions">
            <button class="btn-copy" onclick="copyPrompt(${prompt.id})">Copy Prompt</button>
            <button class="btn-view" onclick="viewPrompt(${prompt.id})">View Details</button>
        </div>
    `;
    return card;
}

// Copy prompt to clipboard
function copyPrompt(promptId) {
    const prompt = allPrompts.find(p => p.id === promptId);
    if (!prompt) return;

    navigator.clipboard.writeText(prompt.text).then(() => {
        showToast('Prompt copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy prompt', 'error');
    });
}

// View prompt details
function viewPrompt(promptId) {
    const prompt = allPrompts.find(p => p.id === promptId);
    if (!prompt) return;

    // Create modal with prompt details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${prompt.title}</h3>
                <button onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <p><strong>Category:</strong> ${prompt.category}</p>
                <p><strong>Language:</strong> ${prompt.language}</p>
                <p><strong>Description:</strong> ${prompt.description}</p>
                <div class="prompt-text">
                    <h4>Prompt:</h4>
                    <pre>${prompt.text}</pre>
                </div>
                <button onclick="copyPrompt(${prompt.id})">Copy Prompt</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Update results count
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `Found (${currentPrompts.length} prompts)`;
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Handle search input
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    if (query.trim() === '') {
        currentPrompts = [...allPrompts];
    } else {
        currentPrompts = allPrompts.filter(prompt => 
            prompt.title.toLowerCase().includes(query) ||
            prompt.description.toLowerCase().includes(query) ||
            prompt.text.toLowerCase().includes(query) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    loadPrompts(currentPrompts);
    updateResultsCount();
}

// Initialize other features
function initializeFeatures() {
    // Add any additional feature initialization here
    console.log('✅ Features initialized');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing PromptHero...');
    
    // Load prompts from API
    loadPromptsFromAPI();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize other features
    initializeFeatures();
});

