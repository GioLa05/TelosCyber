document.addEventListener("DOMContentLoaded", function () {
    // Check if we are on the product listing page (index.html)
    const productLists = document.querySelectorAll("#products-main");
    const productDiscountLists = document.querySelectorAll("#products-discount");
    if (productLists.length > 0 || productDiscountLists.length > 0) {
        // Initialize cart for product listing page
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Save cart to local storage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Add product to cart
        function addToCart(product) {
            const existingItem = cart.find(item => item.product.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ product: product, quantity: 1 });
            }
            saveCart();
            console.log("Cart updated:", cart);
        }

        // Populate regular products
        fetch("products.json")
            .then(response => response.json())
            .then(products => {
                productLists.forEach(productList => {
                    const cards = productList.querySelectorAll(".card");
                    products.forEach((product, index) => {
                        if (cards[index]) {
                            cards[index].innerHTML = `
                                <div class="favorite-btn">
                                    <img src="./assets/icons/Favorite_duotone.svg" alt="Favorite_duotone" />
                                </div>
                                <div class="iphone">
                                    <img src="${product.image}" alt="${product.name}" />
                                </div>
                                <div class="info-buy">
                                    <div class="info">
                                        <p>${product.name}</p>
                                        <p class="price">$${product.price}</p>
                                    </div>
                                    <div class="buy-now">
                                        <button>Buy Now</button>
                                    </div>
                                </div>
                            `;
                            const buyNowButton = cards[index].querySelector(".buy-now button");
                            buyNowButton.addEventListener("click", () => addToCart(product));
                        }
                    });
                });
            })
            .catch(error => console.error("Error loading products.json:", error));

        // Populate discount products
        fetch("products-discount.json")
            .then(response => response.json())
            .then(products => {
                productDiscountLists.forEach(productList => {
                    const cards = productList.querySelectorAll(".card");
                    products.forEach((product, index) => {
                        if (cards[index]) {
                            cards[index].innerHTML = `
                                <div class="favorite-btn">
                                    <img src="./assets/icons/Favorite_duotone.svg" alt="Favorite_duotone" />
                                </div>
                                <div class="iphone">
                                    <img src="${product.image}" alt="${product.name}" />
                                </div>
                                <div class="info-buy">
                                    <div class="info">
                                        <p>${product.name}</p>
                                        <p class="price">$${product.price}</p>
                                    </div>
                                    <div class="buy-now">
                                        <button>Buy Now</button>
                                    </div>
                                </div>
                            `;
                            const buyNowButton = cards[index].querySelector(".buy-now button");
                            buyNowButton.addEventListener("click", () => addToCart(product));
                        }
                    });
                });
            })
            .catch(error => console.error("Error loading products-discount.json:", error));
    }

    // Check if we are on the shopping cart page (shopping-cart.html)
    const shoppingCartsDiv = document.querySelector(".shopping-carts");
    if (shoppingCartsDiv) {
        // Initialize cart for shopping cart page
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Save cart to local storage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Remove product from cart and update UI
        function removeProductFromCart(productId, cartProductDiv) {
            cart = cart.filter(item => item.product.id !== productId);
            saveCart();
            cartProductDiv.remove();
            updateSummary();
            if (shoppingCartsDiv.querySelectorAll(".cart-product").length === 0) {
                if (!shoppingCartsDiv.querySelector(".empty-message")) {
                    const emptyMessage = document.createElement("p");
                    emptyMessage.classList.add("empty-message");
                    emptyMessage.textContent = "Your cart is empty.";
                    shoppingCartsDiv.appendChild(emptyMessage);
                }
            }
        }

        // Update subtotal in summary
        function updateSummary() {
            const subtotal = cart.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            );
            const subtotalElement = document.querySelector(".subtotal p:nth-child(2)");
            if (subtotalElement) {
                subtotalElement.textContent = `$${subtotal}`;
            }

            // Calculate tax and shipping dynamically
            const tax = subtotal > 0 ? 50 : 0; 
            const shipping = subtotal > 0 ? 29 : 0;
            const total = subtotal + tax + shipping;

            // Update tax and shipping
            const taxElement = document.querySelector(".taxes .tax:nth-child(1) p:nth-child(2)");
            const shippingElement = document.querySelector(".taxes .tax:nth-child(2) p:nth-child(2)");
            const totalElement = document.querySelector(".total p:nth-child(2)");

            if (taxElement) {
                taxElement.textContent = `$${tax.toFixed(2)}`;
            }
            if (shippingElement) {
                shippingElement.textContent = `$${shipping.toFixed(2)}`;
            }
            if (totalElement) {
                totalElement.textContent = `$${total.toFixed(2)}`;
            }
        }

        // Clear existing cart items (except title)
        const existingProducts = shoppingCartsDiv.querySelectorAll(".cart-product");
        existingProducts.forEach(product => product.remove());

        // Display cart items or empty message
        if (cart.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.classList.add("empty-message");
            emptyMessage.textContent = "Your cart is empty.";
            shoppingCartsDiv.appendChild(emptyMessage);
        } else {
            cart.forEach(cartItem => {
                const product = cartItem.product;
                const quantity = cartItem.quantity;

                const cartProductDiv = document.createElement("div");
                cartProductDiv.classList.add("cart-product");
                cartProductDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" />
                    <div class="info">
                        <div class="info-left">
                            <div class="text">
                                <p class="h1">${product.name}</p>
                                <p>#${product.id}</p>
                            </div>
                        </div>
                        <div class="info-right">
                            <div class="counter">
                                <img class="minus" src="./assets/icons/No Edit.svg" alt="no-edit" />
                                <button>${quantity}</button>
                                <img class="plus" src="./assets/icons/Edit.svg" alt="edit" />
                            </div>
                            <p class="price">$${product.price}</p>
                            <img src="./assets/icons/Close.svg" alt="close" />
                        </div>
                    </div>
                `;

                shoppingCartsDiv.appendChild(cartProductDiv);

                // Event listeners for quantity controls and removal
                const minusBtn = cartProductDiv.querySelector(".minus");
                const plusBtn = cartProductDiv.querySelector(".plus");
                const quantityBtn = cartProductDiv.querySelector(".counter button");
                const closeBtn = cartProductDiv.querySelector(".info-right > img");

                minusBtn.addEventListener("click", () => {
                    if (cartItem.quantity > 1) {
                        cartItem.quantity -= 1;
                        quantityBtn.textContent = cartItem.quantity;
                        saveCart();
                        updateSummary();
                    } else {
                        removeProductFromCart(product.id, cartProductDiv);
                    }
                });

                plusBtn.addEventListener("click", () => {
                    cartItem.quantity += 1;
                    quantityBtn.textContent = cartItem.quantity;
                    saveCart();
                    updateSummary();
                });

                closeBtn.addEventListener("click", () => {
                    removeProductFromCart(product.id, cartProductDiv);
                });
            });

            // Update subtotal initially
            updateSummary();
        }
    }
});
