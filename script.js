const apiURL = 'https://fakestoreapi.com/products';
const productGrid = document.querySelector('.product-grid');
const categoryFilter = document.getElementById('category-filter');
const sortOptions = document.getElementById('sort-options');
const scrollToTopBtn = document.querySelector('.scroll-to-top');
const cartToast = document.getElementById('cart-toast');
const cartCountElement = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon img');
const loader = document.querySelector('.loader');

let products = [];
let cart = [];

async function fetchProducts() {
   
    loader.style.display = 'block';

    try {
        const response = await fetch(apiURL);
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
      
        loader.style.display = 'none';
    }
}

function renderProducts(filterCategory = 'all', sortOrder = 'asc') {
    productGrid.classList.add('fade');
    setTimeout(() => {
        productGrid.innerHTML = '';
        let filteredProducts = products;

        
        if (filterCategory !== 'all') {
            filteredProducts = products.filter(product => product.category.toLowerCase() === filterCategory.toLowerCase());
        }

    
        filteredProducts.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <h3>${product.title.substring(0, 12)}.....</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            const img = productCard.querySelector('img');
            img.onload = () => img.classList.add('loaded');
            productGrid.appendChild(productCard);
        });
        productGrid.classList.remove('fade');
    }, 300);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showCartToast();
        bounceCartIcon();
    }
}

function updateCartCount() {
    cartCountElement.textContent = cart.length;
}

function showCartToast() {
    cartToast.style.display = 'block';
    setTimeout(() => {
        cartToast.style.display = 'none';
    }, 3000);
}

function bounceCartIcon() {
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 300);
}


categoryFilter.addEventListener('change', (e) => {
    renderProducts(e.target.value, sortOptions.value);
});

sortOptions.addEventListener('change', (e) => {
    renderProducts(categoryFilter.value, e.target.value);
});

window.addEventListener('scroll', () => {
    scrollToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


fetchProducts();
