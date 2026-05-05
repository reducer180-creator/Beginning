document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Sticky Navbar background change on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Check on load
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
  }

  // Scroll Animations (Intersection Observer)
  const fadeElements = document.querySelectorAll('.fade-in-up');

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    root: null,
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });

  // --- Real Cart System (localStorage) ---
  const cartIconBadge = document.getElementById('cartCount');

  // Load cart from localStorage
  function getCart() {
    const cart = localStorage.getItem('rasa_cart');
    return cart ? JSON.parse(cart) : [];
  }

  // Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem('rasa_cart', JSON.stringify(cart));
    updateCartIcon();
  }

  // Update cart badge icon
  function updateCartIcon() {
    if (!cartIconBadge) return;
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartIconBadge.textContent = totalCount;
  }

  // Init badge
  updateCartIcon();

  // Add to Cart Logic (Event Delegation for dynamically loaded products)
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart-btn') || e.target.classList.contains('btn-add')) {
      e.preventDefault();
      const btn = e.target;

      let productName, productPrice, productImg, quantity;

      // Extract details depending on the page structure
      const productCard = btn.closest('.product-card');
      const productDetails = btn.closest('.product-details') || document.querySelector('.product-details');

      if (productCard) {
        // This is index.html or category.html
        productName = productCard.querySelector('h3').textContent.trim();
        const priceText = productCard.querySelector('.product-price').textContent;
        productPrice = parseFloat(priceText.replace('₹', '').replace(/,/g, ''));
        const imgElement = productCard.querySelector('img');
        productImg = imgElement ? imgElement.src : 'assets/img/prod_brass_thali.png';
        quantity = 1;
      } else if (productDetails) {
        // This is product.html
        productName = productDetails.querySelector('.product-title').textContent.trim();
        const priceText = productDetails.querySelector('.product-price-large').textContent;
        productPrice = parseFloat(priceText.replace('₹', '').replace(/,/g, ''));
        productImg = document.getElementById('mainImage').src;
        const qtyInput = document.getElementById('qtyInput');
        quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      }

      if (productName && productPrice && productImg) {
        const cart = getCart();
        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({
            name: productName,
            price: productPrice,
            image: productImg,
            quantity: quantity
          });
        }
        saveCart(cart);

        // Simple pop animation for cart icon
        if (cartIconBadge) {
          cartIconBadge.style.transform = 'scale(1.5)';
          cartIconBadge.style.color = 'var(--color-accent-gold)';
          setTimeout(() => {
            cartIconBadge.style.transform = 'scale(1)';
            cartIconBadge.style.color = 'inherit';
          }, 300);
        }
      }

      // Visual feedback on button
      const originalText = btn.textContent;
      btn.textContent = 'Added!';

      if (btn.classList.contains('btn-add-cart')) {
        btn.style.backgroundColor = 'var(--color-accent-gold)';
        btn.style.color = 'var(--color-primary-dark)';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        if (btn.classList.contains('btn-add-cart')) {
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }
      }, 1500);
    }
  });

  // Product Page Quantity Selector
  const decreaseQty = document.getElementById('decreaseQty');
  const increaseQty = document.getElementById('increaseQty');
  const qtyInput = document.getElementById('qtyInput');

  if (decreaseQty && increaseQty && qtyInput) {
    decreaseQty.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value);
      if (currentVal > 1) {
        qtyInput.value = currentVal - 1;
      }
    });

    increaseQty.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value);
      qtyInput.value = currentVal + 1;
    });
  }
  // --- Backend Integration ---
  const categoryCards = document.querySelectorAll('.user-category-grid .category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const href = card.getAttribute('href');
      if (href && href.includes('category.html')) {
        window.location.href = href;
      }
    });
  });

  // Fetch Featured Products for index.html
  const featuredProductGrid = document.getElementById('featuredProductGrid');
  if (featuredProductGrid) {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        // Just take the first 4 for the homepage
        const featured = data.slice(0, 4);
        featuredProductGrid.innerHTML = featured.map(item => `
          <div class="product-card">
            <a href="product.html?id=${item.id}">
              <div class="product-image hover-zoom">
                <!-- Using placeholder images or logic for real images based on item.type could be added here -->
                <img src="assets/img/prod_brass_thali.png" alt="${item.name}">
              </div>
            </a>
            <div class="product-info">
              <a href="product.html?id=${item.id}"><h3>${item.name}</h3></a>
              <div class="product-price">₹${item.price.toLocaleString('en-IN')}</div>
              <button class="btn-add-cart add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        `).join('');
      })
      .catch(err => {
        console.error("Failed to load featured products:", err);
        featuredProductGrid.innerHTML = '<p class="text-center text-red" style="grid-column: 1/-1;">Failed to connect to backend server on port 3000...</p>';
      });
  }

});

