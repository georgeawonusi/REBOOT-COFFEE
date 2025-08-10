let cart = [];

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('reboot-dark-mode', isDark ? 'true' : 'false');
}

function applyStoredTheme() {
  const saved = localStorage.getItem('reboot-dark-mode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
  }
}

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

function addToCart(product) {
  cart.push(product);
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

function viewCart() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "🛒 Your Cart:\n";
  let total = 0;
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - ₦${item.price}\n`;
    total += item.price;
  });
  message += `\nTotal: ₦${total}`;
  alert(message);
}

function payWithFlutterwave() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Show modal to collect shipping address
  document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').style.display = 'none';
}

function submitShipping(e) {
  e.preventDefault();

  const shippingData = {
    name: document.getElementById('shipName').value,
    email: document.getElementById('shipEmail').value,
    phone: document.getElementById('shipPhone').value,
    address: document.getElementById('shipAddress').value,
    city: document.getElementById('shipCity').value,
    state: document.getElementById('shipState').value,
    country: document.getElementById('shipCountry').value,
    postal: document.getElementById('shipPostal').value,
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-c9fd3c75ee52ae3845edccb44d5b7dd5-X",
    tx_ref: `RC-${Date.now()}`,
    amount: totalAmount,
    currency: "NGN",
    customer: {
      email: shippingData.email,
      name: shippingData.name,
      phone_number: shippingData.phone,
    },
    customizations: {
      title: "Reboot Coffee Checkout",
      description: "Payment for Coffee Order",
    },
    callback: function (data) {
      alert("Payment Complete! Transaction Ref: " + data.transaction_id);
      cart = [];
      updateCartCount();
      closeCheckoutModal();
    },
    onclose: function () {
      console.log("Modal closed");
    },
  });
}

// Run this on page load
window.onload = function () {
  applyStoredTheme();
  updateCartCount();
};
