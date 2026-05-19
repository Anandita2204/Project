/* ============================================
   PRODUCTS.JS - Product Data & Management
   ============================================ */

// Sample Products Data
const productsData = [
    {
        id: 1,
        title: "Engineering Mathematics - Volume 1 & 2",
        category: "books",
        price: 450,
        originalPrice: 800,
        condition: "Like New",
        description: "Complete set of Engineering Mathematics textbooks by B.S. Grewal. Minimal highlighting, all pages intact. Perfect for 1st and 2nd year engineering students.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500)",
            "[images.unsplash.com](https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500)"
        ],
        seller: {
            id: 1,
            name: "Priya Sharma",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/women/44.jpg)",
            course: "B.Tech ECE",
            semester: "6th Sem"
        },
        postedDate: "2025-05-15",
        views: 234,
        isNew: true,
        isFeatured: true
    },
    {
        id: 2,
        title: "HP Laptop - Intel i5, 8GB RAM, 512GB SSD",
        category: "electronics",
        price: 35000,
        originalPrice: 55000,
        condition: "Good",
        description: "HP Pavilion laptop, 2 years old, well maintained. Battery health 85%. Comes with charger and laptop bag. Great for programming and regular use.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500)",
            "[images.unsplash.com](https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500)"
        ],
        seller: {
            id: 2,
            name: "Rahul Verma",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/32.jpg)",
            course: "B.Tech CSE",
            semester: "8th Sem"
        },
        postedDate: "2025-05-14",
        views: 567,
        isNew: false,
        isFeatured: true
    },
    {
        id: 3,
        title: "Badminton Racket - Yonex Nanoray",
        category: "sports",
        price: 1200,
        originalPrice: 2500,
        condition: "Good",
        description: "Yonex Nanoray badminton racket. Used for one season. Grip recently changed. Perfect for intermediate players.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500)"
        ],
        seller: {
            id: 3,
            name: "Ankit Singh",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/45.jpg)",
            course: "BBA",
            semester: "4th Sem"
        },
        postedDate: "2025-05-13",
        views: 189,
        isNew: true,
        isFeatured: false
    },
    {
        id: 4,
        title: "Scientific Calculator - Casio FX-991EX",
        category: "stationery",
        price: 800,
        originalPrice: 1500,
        condition: "Like New",
        description: "Casio FX-991EX scientific calculator. Used only for exams. All functions working perfectly. Comes with protective case.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500)"
        ],
        seller: {
            id: 4,
            name: "Sneha Patel",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/women/68.jpg)",
            course: "B.Sc Physics",
            semester: "6th Sem"
        },
        postedDate: "2025-05-12",
        views: 342,
        isNew: false,
        isFeatured: false
    },
    {
        id: 5,
        title: "Study Table with Chair",
        category: "miscellaneous",
        price: 2500,
        originalPrice: 4500,
        condition: "Good",
        description: "Wooden study table with cushioned chair. Drawer storage included. Minor scratches on surface. Self-pickup only.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500)"
        ],
        seller: {
            id: 5,
            name: "Vikram Reddy",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/52.jpg)",
            course: "MBA",
            semester: "4th Sem"
        },
        postedDate: "2025-05-11",
        views: 156,
        isNew: false,
        isFeatured: false
    },
    {
        id: 6,
        title: "Data Structures & Algorithms Book",
        category: "books",
        price: 350,
        originalPrice: 650,
        condition: "Good",
        description: "Introduction to Algorithms by Cormen (CLRS). Some pages have notes and highlights. Great reference book for competitive programming.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500)"
        ],
        seller: {
            id: 6,
            name: "Meera Gupta",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/women/33.jpg)",
            course: "B.Tech CSE",
            semester: "6th Sem"
        },
        postedDate: "2025-05-10",
        views: 423,
        isNew: true,
        isFeatured: false
    },
    {
        id: 7,
        title: "Wireless Earbuds - JBL Tune 230NC",
        category: "electronics",
        price: 4500,
        originalPrice: 7999,
        condition: "Like New",
        description: "JBL Tune 230NC wireless earbuds with active noise cancellation. Purchased 3 months ago. Under warranty. Excellent sound quality.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500)"
        ],
        seller: {
            id: 7,
            name: "Arjun Mehta",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/67.jpg)",
            course: "B.Tech IT",
            semester: "4th Sem"
        },
        postedDate: "2025-05-09",
        views: 678,
        isNew: false,
        isFeatured: true
    },
    {
        id: 8,
        title: "Cricket Kit - Complete Set",
        category: "sports",
        price: 3500,
        originalPrice: 7000,
        condition: "Good",
        description: "Complete cricket kit including bat (SG), pads, gloves, helmet, and kit bag. Used for college matches. Good condition overall.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500)"
        ],
        seller: {
            id: 8,
            name: "Rohan Kumar",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/22.jpg)",
            course: "B.Com",
            semester: "6th Sem"
        },
        postedDate: "2025-05-08",
        views: 234,
        isNew: false,
        isFeatured: false
    },
    {
        id: 9,
        title: "Drawing Kit - Professional Grade",
        category: "stationery",
        price: 1800,
        originalPrice: 3200,
        condition: "Like New",
        description: "Professional drawing kit with Staedtler pencils, charcoal set, erasers, and A3 drawing sheets. Perfect for architecture/design students.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500)"
        ],
        seller: {
            id: 9,
            name: "Kavya Nair",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/women/55.jpg)",
            course: "B.Arch",
            semester: "4th Sem"
        },
        postedDate: "2025-05-07",
        views: 145,
        isNew: true,
        isFeatured: false
    },
    {
        id: 10,
        title: "Mini Refrigerator - 50L",
        category: "miscellaneous",
        price: 5500,
        originalPrice: 9000,
        condition: "Good",
        description: "Compact mini refrigerator, perfect for hostel rooms. 50 liters capacity. Works perfectly. 1.5 years old.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500)"
        ],
        seller: {
            id: 10,
            name: "Siddharth Roy",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/36.jpg)",
            course: "B.Tech ME",
            semester: "8th Sem"
        },
        postedDate: "2025-05-06",
        views: 312,
        isNew: false,
        isFeatured: false
    },
    {
        id: 11,
        title: "Organic Chemistry Textbook - Morrison Boyd",
        category: "books",
        price: 500,
        originalPrice: 950,
        condition: "Good",
        description: "Organic Chemistry by Morrison and Boyd. 7th Edition. Some wear on cover but pages are in great condition.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500)"
        ],
        seller: {
            id: 11,
            name: "Pooja Sharma",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/women/42.jpg)",
            course: "B.Sc Chemistry",
            semester: "6th Sem"
        },
        postedDate: "2025-05-05",
        views: 198,
        isNew: false,
        isFeatured: false
    },
    {
        id: 12,
        title: "Mechanical Keyboard - Redgear Shadow",
        category: "electronics",
        price: 2200,
        originalPrice: 3500,
        condition: "Like New",
        description: "Redgear Shadow Blade mechanical keyboard with RGB lighting. Blue switches. Barely used for 2 months.",
        images: [
            "[images.unsplash.com](https://images.unsplash.com/photo-1595225476474-87563907a212?w=500)"
        ],
        seller: {
            id: 12,
            name: "Aditya Verma",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/41.jpg)",
            course: "B.Tech CSE",
            semester: "4th Sem"
        },
        postedDate: "2025-05-04",
        views: 445,
        isNew: true,
        isFeatured: true
    }
];

// Product Helper Functions
function getProductById(id) {
    return productsData.find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
    if (category === 'all') return productsData;
    return productsData.filter(product => product.category === category);
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return productsData.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

function filterProducts(filters) {
    let filtered = [...productsData];
    
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(product => 
            filters.categories.includes(product.category)
        );
    }
    
    // Filter by price range
    if (filters.minPrice !== undefined) {
        filtered = filtered.filter(product => product.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(product => product.price <= filters.maxPrice);
    }
    
    // Filter by condition
    if (filters.conditions && filters.conditions.length > 0) {
        filtered = filtered.filter(product => 
            filters.conditions.includes(product.condition.toLowerCase().replace(' ', '-'))
        );
    }
    
    // Sort
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        }
    }
    
    return filtered;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Generate Product Card HTML
function createProductCard(product) {
    const badges = [];
    if (product.isNew) badges.push('<span class="badge-tag badge-new">New</span>');
    if (product.isFeatured) badges.push('<span class="badge-tag badge-featured">Featured</span>');
    
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
                ${badges.length > 0 ? `<div class="product-badges">${badges.join('')}</div>` : ''}
                <div class="product-actions">
                    <button class="action-btn quick-view-btn" data-id="${product.id}" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn wishlist-btn" data-id="${product.id}" title="Add to Wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category-tag">${capitalizeFirst(product.category)}</span>
                <h3 class="product-title">
                    <a href="product.html?id=${product.id}">${product.title}</a>
                </h3>
                <div class="product-meta">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <span class="product-condition">${product.condition}</span>
                </div>
                <div class="product-seller">
                    <img src="${product.seller.avatar}" alt="${product.seller.name}">
                    <span class="seller-name">
                        <strong>${product.seller.name}</strong>
                        <br>${product.seller.course}
                    </span>
                    <button class="chat-btn" data-seller="${product.seller.id}">
                        <i class="fas fa-comments"></i> Chat
                    </button>
                </div>
            </div>
        </div>
    `;
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsData,
        getProductById,
        getProductsByCategory,
        searchProducts,
        filterProducts,
        formatPrice,
        getTimeAgo,
        createProductCard
    };
}
