// Datos de productos deportivos
const products = [
    {
        id: 1,
        name: "Zapatillas Running Nike Air Max",
        price: 129.99,
        category: "zapatillas",
        image: "./img/NikeAirMax.png"
    },
    {
        id: 2,
        name: "Camiseta Deportiva Adidas",
        price: 34.99,
        category: "ropa",
        image: "./img/camiseta-adidas.png"
    },
    {
        id: 3,
        name: "Balón de Fútbol Professional",
        price: 49.99,
        category: "equipamiento",
        image: "./img/balonfutbol.png"
    },
    {
        id: 4,
        name: "Raqueta de Tenis Wilson",
        price: 89.99,
        category: "equipamiento",
        image: "./img/raqueta.png"
    },
    {
        id: 5,
        name: "Short Deportivo Nike Dri-FIT",
        price: 29.99,
        category: "ropa",
        image: "./img/short.png"
    },
    {
        id: 6,
        name: "Zapatillas Basketball Jordan",
        price: 159.99,
        category: "zapatillas",
        image: "./img/zapatillajordan.png"
    },
    {
        id: 7,
        name: "Pelota de Baloncesto Spalding",
        price: 39.99,
        category: "equipamiento",
        image: "./img/spalding.png"
    },
    {
        id: 8,
        name: "Sudadera con Capucha Under Armour",
        price: 59.99,
        category: "ropa",
        image: "./img/sudadera.png"
    }
];

// Inicializar la tienda
function initStore() {
    renderProducts();
    setupCategoryFilters();
}

// Renderizar productos en la página
function renderProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="empty-products">No hay productos en esta categoría.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-category">${getCategoryName(product.category)}</span>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Configurar filtros por categoría
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            e.target.classList.add('active');
            
            // Filtrar productos
            const category = e.target.getAttribute('data-category');
            filterProducts(category);
        });
    });
}

// Filtrar productos por categoría
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}

// Obtener nombre legible de categoría
function getCategoryName(category) {
    const categoryNames = {
        'ropa': 'Ropa Deportiva',
        'zapatillas': 'Zapatillas',
        'equipamiento': 'Equipamiento'
    };
    
    return categoryNames[category] || category;
}

// En la función addToCart de store.js, agregar logs:
function addToCart(productId) {
    console.log('Agregando al carrito producto ID:', productId);
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Producto no encontrado:', productId);
        return;
    }
    
    const cart = getCartFromStorage();
    console.log('Carrito antes de agregar:', cart);
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Producto existente, cantidad aumentada:', existingItem);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
        console.log('Nuevo producto agregado:', product.name);
    }
    
    saveCartToStorage(cart);
    console.log('Carrito después de agregar:', getCartFromStorage());
    showNotification(`${product.name} agregado al carrito`);
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Inicializar la tienda cuando se carga la página
document.addEventListener('DOMContentLoaded', initStore);