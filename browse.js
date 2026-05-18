/* ============================================
   BROWSE.JS - Browse Page Functionality
   ============================================ */

// State
let currentFilters = {
    categories: [],
    minPrice: 0,
    maxPrice: 10000,
    conditions: [],
    sortBy: 'recent',
    search: ''
};

let currentView = 'grid';
let displayedProducts = 8;
const productsPerLoad = 4;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const filtersSidebar = document.getElementById('filters-sidebar');
const filterOverlay = document.getElementById('filter-overlay');
const filterToggle = document.getElementById('filter-toggle');
const activeFiltersContainer = document.getElementById('active-filters');
const loadMoreBtn = document.getElementById('load-more');
const quickViewModal = document.getElementById('quick-view-modal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeBrowsePage();
    setupEventListeners();
    checkURLParams();
    renderProducts();
});

function initializeBrowsePage() {
    // User menu toggle
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            userDropdown.classList.remove('active');
        });
    }
    
    // Mobile hamburger
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
        });
    }
}

function setupEventListeners() {
    // Filter toggle (mobile)
    if (filterToggle) {
        filterToggle.addEventListener('click', toggleFilters);
    }
    
    if (filterOverlay) {
        filterOverlay.addEventListener('click', toggleFilters);
    }
    
    // Category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            if (category === 'all') {
                currentFilters.categories = [];
            } else {
                currentFilters.categories = [category];
            }
            
            displayedProducts = 8;
            renderProducts();
            updateActiveFilters();
        });
    });
    
    // Category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateCategoryFilters();
        });
    });
    
    // Condition checkboxes
    document.querySelectorAll('input[name="condition"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            currentFilters.conditions = Array.from(
                document.querySelectorAll('input[name="condition"]:checked')
            ).map(cb => cb.value);
            displayedProducts = 8;
            renderProducts();
            updateActiveFilters();
        });
    });
    
    // Sort options
    document.querySelectorAll('input[name="sort"]').forEach(radio => {
        radio.addEventListener('change', () => {
            currentFilters.sortBy = document.querySelector('input[name="sort"]:checked').value;
            renderProducts();
        });
    });
    
    // Price inputs
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceSlider = document.getElementById('price-slider');
    
    if (minPriceInput) {
        minPriceInput.addEventListener('change', () => {
            currentFilters.minPrice = parseInt(minPriceInput.value) || 0;
            displayedProducts = 8;
            renderProducts();
            updateActiveFilters();
        });
    }
    
    if (maxPriceInput) {
        maxPriceInput.addEventListener('change', () => {
            currentFilters.maxPrice = parseInt(maxPriceInput.value) || 10000;
            displayedProducts = 8;
            renderProducts();
            updateActiveFilters();
        });
    }
    
    if (priceSlider) {
        priceSlider.addEventListener('input', () => {
            currentFilters.maxPrice = parseInt(priceSlider.value);
            if (maxPriceInput) maxPriceInput.value = priceSlider.value;
        });
        
        priceSlider.addEventListener('change', () => {
            displayedProducts = 8;
            renderProducts();
            updateActiveFilters();
        });
    }
    
    // Clear filters
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            
            if (currentView === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
    
    // Load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedProducts += productsPerLoad;
            renderProducts();
        });
    }
    
    // Search
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentFilters.search = searchInput.value.trim();
            displayedProducts = 8;
            renderProducts();
            updateActiveFilters();
        });
    }
    
    // Quick view and product actions
    productsGrid.addEventListener('click', (e) => {
        const quickViewBtn = e.target.closest('.quick-view-btn');
        const wishlistBtn = e.target.closest('.wishlist-btn');
        const chatBtn = e.target.closest('.chat-btn');
        
        if (quickViewBtn) {
            openQuickView(quickViewBtn.dataset.id);
        }
        
        if (wishlistBtn) {
            wishlistBtn.querySelector('i').classList.toggle('far');
            wishlistBtn.querySelector('i').classList.toggle('fas');
        }
        
        if (chatBtn) {
            window.location.href = `chat.html?seller=${chatBtn.dataset.seller}`;
        }
    });
    
    // Modal close
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeQuickView);
    }
    
    if (quickViewModal) {
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === quickViewModal) {
                closeQuickView();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quickViewModal.classList.contains('active')) {
            closeQuickView();
        }
    });
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const search = params.get('search');
    
    if (category) {
        currentFilters.categories = [category];
        
        // Update UI
        const categoryTab = document.querySelector(`.category-tab[data-category="${category}"]`);
        if (categoryTab) {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            categoryTab.classList.add('active');
        }
        
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    if (search) {
        currentFilters.search = search;
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = search;
    }
}

function updateCategoryFilters() {
    currentFilters.categories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(cb => cb.value);
    
    // Update tabs
    if (currentFilters.categories.length === 0) {
        document.querySelector('.category-tab[data-category="all"]').classList.add('active');
    } else if (currentFilters.categories.length === 1) {
        document.querySelectorAll('.category-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.category === currentFilters.categories[0]);
        });
    } else {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    }
    
    displayedProducts = 8;
    renderProducts();
    updateActiveFilters();
}

function renderProducts() {
    const filteredProducts = filterProducts(currentFilters);
    const productsToShow = filteredProducts.slice(0, displayedProducts);
    
    // Update results count
    document.querySelector('.results-count strong').textContent = filteredProducts.length;
    
    // Update title
    let title = 'All Products';
    if (currentFilters.categories.length === 1) {
        title = capitalizeFirst(currentFilters.categories[0]);
    } else if (currentFilters.search) {
        title = `Results for "${currentFilters.search}"`;
    }
    document.querySelector('.results-info h2').textContent = title;
    
    // Render products
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
    } else {
        productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    }
    
    // Update load more button
    if (displayedProducts >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

function updateActiveFilters() {
    const tags = [];
    
    // Categories
    currentFilters.categories.forEach(cat => {
        tags.push(`
            <span class="filter-tag" data-type="category" data-value="${cat}">
                ${capitalizeFirst(cat)}
                <button onclick="removeFilter('category', '${cat}')"><i class="fas fa-times"></i></button>
            </span>
        `);
    });
    
    // Conditions
    currentFilters.conditions.forEach(cond => {
        tags.push(`
            <span class="filter-tag" data-type="condition" data-value="${cond}">
                ${capitalizeFirst(cond.replace('-', ' '))}
                <button onclick="removeFilter('condition', '${cond}')"><i class="fas fa-times"></i></button>
            </span>
        `);
    });
    
    // Price
    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < 10000) {
        tags.push(`
            <span class="filter-tag" data-type="price">
                ₹${currentFilters.minPrice} - ₹${currentFilters.maxPrice}
                <button onclick="removeFilter('price')"><i class="fas fa-times"></i></button>
            </span>
        `);
    }
    
    // Search
    if (currentFilters.search) {
        tags.push(`
            <span class="filter-tag" data-type="search">
                "${currentFilters.search}"
                <button onclick="removeFilter('search')"><i class="fas fa-times"></i></button>
            </span>
        `);
    }
    
    activeFiltersContainer.innerHTML = tags.join('');
}

function removeFilter(type, value) {
    switch (type) {
        case 'category':
            currentFilters.categories = currentFilters.categories.filter(c => c !== value);
            const catCheckbox = document.querySelector(`input[name="category"][value="${value}"]`);
            if (catCheckbox) catCheckbox.checked = false;
            
            if (currentFilters.categories.length === 0) {
                document.querySelector('.category-tab[data-category="all"]').classList.add('active');
            }
            break;
            
        case 'condition':
            currentFilters.conditions = currentFilters.conditions.filter(c => c !== value);
            const condCheckbox = document.querySelector(`input[name="condition"][value="${value}"]`);
            if (condCheckbox) condCheckbox.checked = false;
            break;
            
        case 'price':
            currentFilters.minPrice = 0;
            currentFilters.maxPrice = 10000;
            document.getElementById('min-price').value = '';
            document.getElementById('max-price').value = '';
            document.getElementById('price-slider').value = 5000;
            break;
            
        case 'search':
            currentFilters.search = '';
            document.getElementById('search-input').value = '';
            break;
    }
    
    displayedProducts = 8;
    renderProducts();
    updateActiveFilters();
}

function clearAllFilters() {
    currentFilters = {
        categories: [],
        minPrice: 0,
        maxPrice: 10000,
        conditions: [],
        sortBy: 'recent',
        search: ''
    };
    
    // Reset UI
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="condition"]').forEach(cb => cb.checked = false);
    document.querySelector('input[name="sort"][value="recent"]').checked = true;
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('price-slider').value = 5000;
    document.getElementById('search-input').value = '';
    
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.category-tab[data-category="all"]').classList.add('active');
    
    displayedProducts = 8;
    renderProducts();
    updateActiveFilters();
}

function toggleFilters() {
    filtersSidebar.classList.toggle('active');
    filterOverlay.classList.toggle('active');
    document.body.style.overflow = filtersSidebar.classList.contains('active') ? 'hidden' : '';
}

// Quick View Functions
function openQuickView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    document.getElementById('quick-view-image').src = product.images[0];
    document.getElementById('quick-view-category').textContent = capitalizeFirst(product.category);
    document.getElementById('quick-view-title').textContent = product.title;
    document.getElementById('quick-view-price').textContent = formatPrice(product.price);
    document.getElementById('quick-view-condition').textContent = product.condition;
    document.getElementById('quick-view-description').textContent = product.description;
    document.getElementById('quick-view-seller-img').src = product.seller.avatar;
    document.getElementById('quick-view-seller-name').textContent = product.seller.name;
    document.getElementById('quick-view-seller-info').textContent = `${product.seller.course}, ${product.seller.semester}`;
    
    document.getElementById('quick-view-chat').href = `chat.html?seller=${product.seller.id}&product=${product.id}`;
    document.getElementById('quick-view-details').href = `product.html?id=${product.id}`;
    
    // Thumbnails
    const thumbnailsContainer = document.getElementById('quick-view-thumbnails');
    thumbnailsContainer.innerHTML = product.images.map((img, index) => `
        <img src="${img}" alt="Thumbnail ${index + 1}" 
             class="${index === 0 ? 'active' : ''}"
             onclick="changeQuickViewImage('${img}', this)">
    `).join('');
    
    quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function changeQuickViewImage(src, thumb) {
    document.getElementById('quick-view-image').src = src;
    document.querySelectorAll('#quick-view-thumbnails img').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

function closeQuickView() {
    quickViewModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Utility
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
