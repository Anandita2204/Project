// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
});

function initializeDashboard() {
    setupSidebarToggle();
    setupTabs();
    setupImageUpload();
    setupProductForm();
    loadListings();
}

// ==============================
// Sidebar Toggle
// ==============================

function setupSidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}

// ==============================
// Tab Switching
// ==============================

function setupTabs() {
    const navItems = document.querySelectorAll(".nav-item[data-tab]");

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();

            const tabName = item.getAttribute("data-tab");
            showTab(tabName);

            // Active nav item
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
        });
    });
}

function showTab(tabName) {
    const tabs = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.classList.add("active");
    }

    // Update page title
    const pageTitle = document.getElementById("page-title");

    const titles = {
        overview: "Dashboard Overview",
        listings: "My Listings",
        "add-product": "Add Product"
    };

    pageTitle.textContent = titles[tabName] || "Dashboard";
}

// ==============================
// Dummy Listings Data
// ==============================

let listings = [
    {
        id: 1,
        title: "HP Laptop",
        category: "Electronics",
        price: 25000,
        condition: "Good",
        status: "active",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 2,
        title: "Engineering Books",
        category: "Books",
        price: 1200,
        condition: "Like New",
        status: "sold",
        image: "https://via.placeholder.com/300x200"
    }
];

// ==============================
// Load Listings
// ==============================

function loadListings() {
    const listingsContainer = document.getElementById("my-listings");

    if (!listingsContainer) return;

    listingsContainer.innerHTML = "";

    listings.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("listing-card");

        card.innerHTML = `
            <div class="listing-image">
                <img src="${product.image}" alt="${product.title}">
            </div>

            <div class="listing-content">
                <h3>${product.title}</h3>

                <p class="listing-category">${product.category}</p>

                <div class="listing-meta">
                    <span>₹${product.price}</span>
                    <span>${product.condition}</span>
                </div>

                <div class="listing-status ${product.status}">
                    ${product.status.toUpperCase()}
                </div>

                <div class="listing-actions">
                    <button class="btn btn-outline btn-sm" onclick="editListing(${product.id})">
                        Edit
                    </button>

                    <button class="btn btn-danger btn-sm" onclick="deleteListing(${product.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;

        listingsContainer.appendChild(card);
    });
}

// ==============================
// Delete Listing
// ==============================

function deleteListing(id) {
    const confirmDelete = confirm("Are you sure you want to delete this listing?");

    if (!confirmDelete) return;

    listings = listings.filter(item => item.id !== id);

    loadListings();
}

// ==============================
// Edit Listing
// ==============================

function editListing(id) {
    const product = listings.find(item => item.id === id);

    if (!product) return;

    showTab("add-product");

    document.getElementById("product-title").value = product.title;
    document.getElementById("product-category").value = product.category.toLowerCase();
    document.getElementById("product-condition").value = product.condition.toLowerCase();
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-description").value =
        "Edit your product description here...";
}

// ==============================
// Image Upload Preview
// ==============================

function setupImageUpload() {
    const uploadArea = document.getElementById("image-upload-area");
    const fileInput = document.getElementById("product-images");
    const previewContainer = document.getElementById("image-previews");

    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        const files = e.target.files;

        previewContainer.innerHTML = "";

        Array.from(files).forEach(file => {
            const reader = new FileReader();

            reader.onload = function(event) {
                const preview = document.createElement("div");
                preview.classList.add("image-preview");

                preview.innerHTML = `
                    <img src="${event.target.result}" alt="Preview">
                `;

                previewContainer.appendChild(preview);
            };

            reader.readAsDataURL(file);
        });
    });
}

// ==============================
// Product Form Submit
// ==============================

function setupProductForm() {
    const form = document.getElementById("product-form");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("product-title").value;
        const category = document.getElementById("product-category").value;
        const condition = document.getElementById("product-condition").value;
        const price = document.getElementById("product-price").value;
        const description = document.getElementById("product-description").value;

        // Validation
        if (!title || !category || !condition || !price || !description) {
            alert("Please fill all required fields.");
            return;
        }

        // Create Product Object
        const newProduct = {
            id: Date.now(),
            title,
            category,
            condition,
            price,
            description,
            status: "active",
            image: "https://via.placeholder.com/300x200"
        };

        // Add to listings
        listings.unshift(newProduct);

        // Reload listings
        loadListings();

        // Reset form
        form.reset();

        document.getElementById("image-previews").innerHTML = "";

        // Success message
        alert("Product listed successfully!");

        // Switch to listings tab
        showTab("listings");
    });
}

// ==============================
// Filter Listings
// ==============================

const filterSelect = document.getElementById("listings-status");

if (filterSelect) {
    filterSelect.addEventListener("change", () => {
        const selected = filterSelect.value;

        const cards = document.querySelectorAll(".listing-card");

        cards.forEach((card, index) => {
            const product = listings[index];

            if (selected === "all" || product.status === selected) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}