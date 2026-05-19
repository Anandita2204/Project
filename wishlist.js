const wishlistBtn = document.getElementById("wishlistBtn");
const wishlistSidebar = document.getElementById("wishlistSidebar");
const closeWishlist = document.getElementById("closeWishlist");
const wishlistOverlay = document.getElementById("wishlistOverlay");
const wishlistItemsContainer = document.getElementById("wishlistItems");
const wishlistCount = document.getElementById("wishlistCount");

let wishlist = [];


/* =========================
   OPEN / CLOSE SIDEBAR
========================= */

wishlistBtn.addEventListener("click", () => {
    wishlistSidebar.classList.add("active");
    wishlistOverlay.classList.add("active");
});

closeWishlist.addEventListener("click", closeWishlistSidebar);
wishlistOverlay.addEventListener("click", closeWishlistSidebar);

function closeWishlistSidebar() {
    wishlistSidebar.classList.remove("active");
    wishlistOverlay.classList.remove("active");
}


/* =========================
   ADD TO WISHLIST
========================= */

document.addEventListener("click", function(e){

    const button = e.target.closest(".wishlist-btn");

    if(!button) return;

    const productCard = button.closest(".product-card");

    const title = productCard.querySelector(".product-title").innerText;

    const price = productCard.querySelector(".product-price").innerText;

    const image = productCard.querySelector(".product-image img").src;

    const product = {
        title,
        price,
        image
    };

    const exists = wishlist.find(item => item.title === title);

    if (!exists) {

        wishlist.push(product);

        button.classList.add("active");

        button.innerHTML = `<i class="fas fa-heart"></i>`;

    } else {

        wishlist = wishlist.filter(item => item.title !== title);

        button.classList.remove("active");

        button.innerHTML = `<i class="far fa-heart"></i>`;
    }

    updateWishlist();

});
       
/* =========================
   UPDATE WISHLIST UI
========================= */

function updateWishlist() {

    wishlistItemsContainer.innerHTML = "";

    wishlist.forEach((item,index) => {

        wishlistItemsContainer.innerHTML += `
        
            <div class="wishlist-item">

                <img src="${item.image}">

                <div class="wishlist-info">

                    <h4>${item.title}</h4>

                    <p>${item.price}</p>

                    <button class="remove-wishlist" onclick="removeWishlist(${index})">
                        Remove
                    </button>

                </div>

            </div>

        `;
    });

    wishlistCount.innerText = wishlist.length;
}


/* =========================
   REMOVE ITEM
========================= */

function removeWishlist(index){

    const removedItem = wishlist[index];

    wishlist = wishlist.filter((item,i)=> i !== index);

    // remove active heart
    document.querySelectorAll(".product-card").forEach(card => {

        const title = card.querySelector("h3").innerText;

        if(title === removedItem.title){

            const btn = card.querySelector(".add-to-wishlist");

            btn.classList.remove("active");

            btn.innerHTML = `<i class="far fa-heart"></i>`;
        }

    });

    updateWishlist();
}