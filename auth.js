let isSignUpMode = false;

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-title').innerText = isSignUpMode ? 'Sign Up' : 'Sign In';
    document.getElementById('auth-mode').innerText = isSignUpMode ? 'Sign In' : 'Sign Up';
    document.getElementById('user-id-input').value = '';
    document.getElementById('password-input').value = '';
}

function handleAuth() {
    const userId = document.getElementById('user-id-input').value;
    const password = document.getElementById('password-input').value;

    if (!userId || !password) {
        alert('Please fill in all fields.');
        return;
    }

    if (isSignUpMode) {
        // Sign Up
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.userId === userId)) {
            alert('User ID already exists. Please sign in or use a different ID.');
            return;
        }
        users.push({ userId, password, addresses: [], paymentMethod: null });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('user', JSON.stringify({ userId }));
        alert('Sign up successful! You are now logged in.');
    } else {
        // Sign In
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.userId === userId && user.password === password);
        if (!user) {
            alert('Invalid User ID or Password.');
            return;
        }
        localStorage.setItem('user', JSON.stringify({ userId }));
        alert('Sign in successful!');
    }

    closeAuthModal();
    updateProfile();
}

function logout() {
    localStorage.removeItem('user');
    updateProfile();
    window.location.reload();
}

function updateProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userIdSpan = document.getElementById('user-id');
    const profileOptions = document.getElementById('profile-options');

    if (user) {
        userIdSpan.innerText = user.userId;
        profileOptions.classList.remove('hidden');
    } else {
        userIdSpan.innerText = 'Profile';
        profileOptions.classList.add('hidden');
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    isSignUpMode = false;
    document.getElementById('auth-title').innerText = 'Sign In';
    document.getElementById('auth-mode').innerText = 'Sign Up';
    document.getElementById('user-id-input').value = '';
    document.getElementById('password-input').value = '';
}

function openAuthModalIfNotLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        openAuthModal();
    }
}

function openAddressModal() {
    document.getElementById('address-modal').classList.remove('hidden');
}

function closeAddressModal() {
    document.getElementById('address-modal').classList.add('hidden');
}

function saveAddress() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please sign in to add an address.');
        openAuthModal();
        return;
    }

    const address = document.getElementById('address-input').value;
    const city = document.getElementById('city-input').value;
    const state = document.getElementById('state-input').value;
    const zip = document.getElementById('zip-input').value;

    if (!address || !city || !state || !zip) {
        alert('Please fill in all address fields.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.userId === user.userId);
    users[userIndex].addresses.push({ address, city, state, zip });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Address saved successfully!');
    closeAddressModal();
}

function openPaymentModal() {
    document.getElementById('payment-modal').classList.remove('hidden');
    const paymentMethod = document.getElementById('payment-method');
    const cardDetails = document.getElementById('card-details');
    paymentMethod.addEventListener('change', () => {
        cardDetails.classList.toggle('hidden', paymentMethod.value === 'cod');
    });
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
}

function savePaymentMethod() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please sign in to save a payment method.');
        openAuthModal();
        return;
    }

    const paymentMethod = document.getElementById('payment-method').value;
    let paymentDetails = { method: paymentMethod };

    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;

        if (!cardNumber || !cardExpiry || !cardCvv) {
            alert('Please fill in all card details.');
            return;
        }

        paymentDetails = { ...paymentDetails, cardNumber, cardExpiry, cardCvv };
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.userId === user.userId);
    users[userIndex].paymentMethod = paymentDetails;
    localStorage.setItem('users', JSON.stringify(users));

    alert('Payment method saved successfully!');
    closePaymentModal();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateProfile();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && window.location.pathname.includes('index.html')) {
        openAuthModal();
    }
});