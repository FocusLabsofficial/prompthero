// CodePrompt Hub - Main JavaScript functionality

// Global variables
let currentPrompts = [];
let allPrompts = [];
let userIdentifier = null;
let currentFilter = 'all';
let userBookmarks = new Set();
let userLikes = new Set();

// Generate user identifier (IP-based for anonymous users)
function generateUserIdentifier() {
    if (!userIdentifier) {
        // Use a simple hash of user agent + timestamp for demo
        const userAgent = navigator.userAgent;
        const timestamp = Date.now();
        userIdentifier = btoa(`${userAgent}-${timestamp}`).substring(0, 20);
    }
    return userIdentifier;
}

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
            likes: prompt.likes_count || 0,
            tags: prompt.tags || [],
            created_at: prompt.created_at
        }));
        
        currentPrompts = [...allPrompts];
        loadPrompts(currentPrompts);
        updateResultsCount();
        
        // Load user's bookmarks and likes
        await loadUserData();
        
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

// Load user's bookmarks and likes
async function loadUserData() {
    const userId = generateUserIdentifier();
    
    try {
        // Load bookmarks
        const bookmarksResponse = await fetch(`/api/bookmarks?user_identifier=${userId}`);
        if (bookmarksResponse.ok) {
            const bookmarksData = await bookmarksResponse.json();
            userBookmarks = new Set(bookmarksData.bookmarks.map(b => b.id));
        }
        
        // Load likes
        const likesResponse = await fetch(`/api/likes?user_identifier=${userId}`);
        if (likesResponse.ok) {
            const likesData = await likesResponse.json();
            userLikes = new Set(likesData.likes.map(l => l.id));
        }
        
        // Reload prompts to show correct bookmark/like states
        loadPrompts(currentPrompts);
    } catch (error) {
        console.error('❌ Error loading user data:', error);
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
    const isBookmarked = userBookmarks.has(prompt.id);
    const isLiked = userLikes.has(prompt.id);
    
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
            <span class="rating" onclick="showRatingModal(${prompt.id})">⭐ ${prompt.rating.toFixed(1)} (${prompt.ratingCount})</span>
            <span class="uses">📊 ${prompt.uses} uses</span>
            <span class="likes">❤️ ${prompt.likes}</span>
        </div>
        <div class="prompt-actions">
            <button class="btn-copy" onclick="copyPrompt(${prompt.id})">Copy Prompt</button>
            <button class="btn-view" onclick="viewPrompt(${prompt.id})">View Details</button>
            <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${prompt.id})" title="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
                ${isBookmarked ? '🔖' : '📖'}
            </button>
            <button class="btn-like ${isLiked ? 'liked' : ''}" onclick="toggleLike(${prompt.id})" title="${isLiked ? 'Unlike' : 'Like'}">
                ${isLiked ? '❤️' : '🤍'}
            </button>
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
                <div class="modal-actions">
                    <button onclick="copyPrompt(${prompt.id})">Copy Prompt</button>
                    <button onclick="showRatingModal(${prompt.id})">Rate Prompt</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show rating modal
function showRatingModal(promptId) {
    const prompt = allPrompts.find(p => p.id === promptId);
    if (!prompt) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Rate: ${prompt.title}</h3>
                <button onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="rating-stars">
                    <span class="star" data-rating="1">⭐</span>
                    <span class="star" data-rating="2">⭐</span>
                    <span class="star" data-rating="3">⭐</span>
                    <span class="star" data-rating="4">⭐</span>
                    <span class="star" data-rating="5">⭐</span>
                </div>
                <textarea id="ratingReview" placeholder="Write a review (optional)..." rows="3"></textarea>
                <div class="modal-actions">
                    <button onclick="submitRating(${prompt.id})">Submit Rating</button>
                    <button onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add star rating functionality
    const stars = modal.querySelectorAll('.star');
    let selectedRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach((s, i) => {
                s.style.color = i < selectedRating ? '#ffd700' : '#ccc';
            });
        });
    });
}

// Submit rating
async function submitRating(promptId) {
    const stars = document.querySelectorAll('.star');
    const selectedRating = Array.from(stars).filter(s => s.style.color === 'rgb(255, 215, 0)').length;
    const review = document.getElementById('ratingReview')?.value || '';
    
    if (selectedRating === 0) {
        showToast('Please select a rating', 'error');
        return;
    }

    try {
        const response = await fetch('/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt_id: promptId,
                rating: selectedRating,
                review: review,
                user_identifier: generateUserIdentifier()
            })
        });

        if (response.ok) {
            showToast('Rating submitted successfully!', 'success');
            document.querySelector('.modal').remove();
            
            // Reload prompts to update ratings
            await loadPromptsFromAPI();
        } else {
            showToast('Failed to submit rating', 'error');
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
        showToast('Failed to submit rating', 'error');
    }
}

// Toggle bookmark
async function toggleBookmark(promptId) {
    try {
        const response = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt_id: promptId,
                user_identifier: generateUserIdentifier()
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.bookmarked) {
                userBookmarks.add(promptId);
                showToast('Bookmark added!', 'success');
            } else {
                userBookmarks.delete(promptId);
                showToast('Bookmark removed!', 'success');
            }
            
            // Update the UI
            loadPrompts(currentPrompts);
        } else {
            showToast('Failed to toggle bookmark', 'error');
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        showToast('Failed to toggle bookmark', 'error');
    }
}

// Toggle like
async function toggleLike(promptId) {
    try {
        const response = await fetch('/api/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt_id: promptId,
                user_identifier: generateUserIdentifier()
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.liked) {
                userLikes.add(promptId);
                showToast('Liked!', 'success');
            } else {
                userLikes.delete(promptId);
                showToast('Unliked!', 'success');
            }
            
            // Update the UI
            loadPrompts(currentPrompts);
        } else {
            showToast('Failed to toggle like', 'error');
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        showToast('Failed to toggle like', 'error');
    }
}

// Set unified filter
function setUnifiedFilter(filter) {
    currentFilter = filter;
    
    // Update filter button states
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
    
    // Apply filter
    applyFilters();
}

// Apply filters
function applyFilters() {
    let filteredPrompts = [...allPrompts];
    
    // Apply category filter
    if (currentFilter !== 'all') {
        switch (currentFilter) {
            case 'bookmarked':
                filteredPrompts = filteredPrompts.filter(p => userBookmarks.has(p.id));
                break;
            case 'popular':
                filteredPrompts = filteredPrompts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                filteredPrompts = filteredPrompts.filter(p => p.category === currentFilter);
        }
    }
    
    currentPrompts = filteredPrompts;
    loadPrompts(currentPrompts);
    updateResultsCount();
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
        applyFilters(); // Apply current filter
    } else {
        currentPrompts = allPrompts.filter(prompt => 
            prompt.title.toLowerCase().includes(query) ||
            prompt.description.toLowerCase().includes(query) ||
            prompt.text.toLowerCase().includes(query) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(query))
        );
        
        loadPrompts(currentPrompts);
        updateResultsCount();
    }
}

// Initialize other features
function initializeFeatures() {
    // Initialize filter buttons
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');
            setUnifiedFilter(filter);
        });
    });
    
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

