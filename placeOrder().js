<script>
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to place an order.');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please sign in to place an order.');
        openAuthModal();
        return;
    }

    const addressSelect = document.getElementById('delivery-address');
    const paymentSelect = document.getElementById('payment-method-checkout');
    if (!addressSelect.value) {
        alert('Please select a delivery address.');
        return;
    }
    if (!paymentSelect.value) {
        alert('Please select a payment method.');
        return;
    }

    // ✅ Go to payment.html instead of index
    window.location.href = 'payment.html';
}
</script>
