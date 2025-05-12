let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`${name} has been added to your cart!`);
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const orderSummaryDiv = document.getElementById('order-summary');
    cartItemsDiv.innerHTML = '';
    if (orderSummaryDiv) orderSummaryDiv.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center p-2 border-b';
        itemDiv.innerHTML = `
            <div>
                <h4 class="text-lg font-semibold text-blue-100">${item.name}</h4>
                <p class="text-blue-100">₹${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div>
                <span class="text-lg font-semibold text-blue-100">₹${itemTotal.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})" class="ml-4 bg-red-600 text-white px-2 py-1 rounded">Remove</button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);

        if (orderSummaryDiv) {
            const summaryItem = document.createElement('div');
            summaryItem.className = 'flex justify-between p-2 border-b';
            summaryItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            orderSummaryDiv.appendChild(summaryItem);
        }
    });

    document.getElementById('cart-total').innerText = total.toFixed(2);
    if (document.getElementById('order-total')) {
        document.getElementById('order-total').innerText = total.toFixed(2);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    displayCart();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    displayCart();
}

function closeCart() {
    document.getElementById('cart-modal').classList.add('hidden');
}

function placeOrder() {
    const fullName = document.getElementById('full-name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const phone = document.getElementById('phone').value;

    if (!fullName || !address || !city || !state || !zip || !phone) {
        alert('Please fill in all billing details.');
        return;
    }

    alert('Order placed successfully! Thank you for shopping with Quick Mart And Snacks.');
    clearCart();
    window.location.href = 'index.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items')) {
        displayCart();
    }
    if (document.getElementById('order-summary')) {
        displayCart();
    }
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            document.getElementById('cart-modal').classList.remove('hidden');
            displayCart();
        });
    }
});