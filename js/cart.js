// Inicializar la página del carrito
function initCart() {
    console.log('Inicializando carrito...');
    
    // Debug del carrito
    const cart = getCartFromStorage();
    console.log('Carrito encontrado:', cart);
    
    renderCartItems();
    setupEventListeners();
    updateOrderSummary();
    setupPopupListener();
    
    // Asegurarse de que el popup esté oculto al inicio
    const popup = document.getElementById('thank-you-popup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

// Configurar event listener para el popup
function setupPopupListener() {
    const closePopupBtn = document.getElementById('close-popup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            const popup = document.getElementById('thank-you-popup');
            popup.classList.add('hidden');
            document.body.style.overflow = 'auto';
            // Redirigir a la página principal después de cerrar el popup
            window.location.href = 'index.html';
        });
    }
}

// Renderizar items del carrito - FUNCIÓN PRINCIPAL CORREGIDA
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = getCartFromStorage();
    
    console.log('Renderizando carrito. Items:', cart.length);
    console.log('Contenedor encontrado:', cartItemsContainer);
    
    if (!cartItemsContainer) {
        console.error('No se encontró el contenedor del carrito');
        return;
    }
    
    // Limpiar contenedor
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        console.log('Carrito vacío, mostrando estado vacío');
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos deportivos a tu carrito.</p>
                <a href="index.html" class="cta-button">
                    <span>Explorar Productos</span>
                    <div class="button-arrow">→</div>
                </a>
            </div>
        `;
        return;
    }
    
    console.log('Renderizando', cart.length, 'items del carrito');
    
    // Renderizar cada item del carrito
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-category">${getCategoryName(item.category)}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}" title="Eliminar producto">×</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Actualizar contador de items
    updateItemsCount(cart.length);
    
    // Actualizar resumen
    updateOrderSummary();
}

// Actualizar contador de items
function updateItemsCount(count) {
    const itemsCountElement = document.getElementById('items-count');
    if (itemsCountElement) {
        itemsCountElement.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    }
}

// Configurar event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Botones de cantidad - delegación de eventos
    document.addEventListener('click', (e) => {
        console.log('Click en:', e.target);
        
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const isPlus = e.target.classList.contains('plus');
            const isMinus = e.target.classList.contains('minus');
            
            console.log('Botón de cantidad clickeado:', { productId, isPlus, isMinus });
            
            if (isPlus) {
                updateCartItemQuantity(productId, 1);
            } else if (isMinus) {
                updateCartItemQuantity(productId, -1);
            }
        }
        
        // Botón eliminar
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            console.log('Eliminar producto:', productId);
            
            if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
                removeCartItem(productId);
            }
        }
        
        // Botón aplicar promo
        if (e.target.id === 'apply-promo') {
            applyPromoCode();
        }
    });
    
    // Inputs de cantidad
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value);
            
            console.log('Cambio de cantidad:', { productId, newQuantity });
            
            if (newQuantity > 0 && !isNaN(newQuantity)) {
                setCartItemQuantity(productId, newQuantity);
            } else {
                e.target.value = 1;
                setCartItemQuantity(productId, 1);
            }
        }
    });
    
    // Inputs del formulario
    document.addEventListener('input', (e) => {
        if (e.target.matches('#customer-form input, #customer-form textarea')) {
            validateForm();
        }
    });
    
    // Botón de confirmar pedido
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processOrder);
        console.log('Listener del botón checkout configurado');
    }
    
    // Enter en el código promocional
    const promoInput = document.getElementById('promo-code');
    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });
    }
}

// Actualizar cantidad de un item
function updateCartItemQuantity(productId, change) {
    console.log('Actualizando cantidad:', { productId, change });
    
    const cart = getCartFromStorage();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            removeCartItem(productId);
        } else {
            saveCartToStorage(cart);
            renderCartItems(); // Re-renderizar todo el carrito
        }
    }
}

// Establecer cantidad específica de un item
function setCartItemQuantity(productId, quantity) {
    console.log('Estableciendo cantidad:', { productId, quantity });
    
    const cart = getCartFromStorage();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        saveCartToStorage(cart);
        renderCartItems(); // Re-renderizar todo el carrito
    }
}

// Eliminar item del carrito
function removeCartItem(productId) {
    console.log('Eliminando producto:', productId);
    
    const cart = getCartFromStorage();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCartToStorage(updatedCart);
    renderCartItems(); // Re-renderizar todo el carrito
}

// Aplicar código promocional
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        alert('Por favor ingresa un código promocional');
        return;
    }
    
    // Códigos de ejemplo
    const validPromos = {
        'DEPORTE10': 10,
        'SPORT20': 20,
        'BIENVENIDO15': 15
    };
    
    if (validPromos[promoCode]) {
        const discount = validPromos[promoCode];
        const discountElement = document.getElementById('discount');
        discountElement.textContent = `-$${discount}.00`;
        discountElement.style.color = 'var(--success)';
        
        // Actualizar total con descuento
        updateOrderSummary(discount);
        
        alert(`¡Código aplicado! Descuento del ${discount}%`);
        promoInput.value = '';
    } else {
        alert('Código promocional no válido');
        promoInput.focus();
    }
}

// Validar formulario
function validateForm() {
    const form = document.getElementById('customer-form');
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
    });
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        const cart = getCartFromStorage();
        checkoutBtn.disabled = cart.length === 0 || !isValid;
    }
    
    return isValid;
}

// Actualizar resumen del pedido
function updateOrderSummary(discount = 0) {
    const cart = getCartFromStorage();
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Calcular envío (gratis para compras mayores a $100)
    const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
    
    // Calcular descuento
    const discountAmount = (subtotal * discount) / 100;
    const total = Math.max(0, subtotal + shipping - discountAmount);
    
    // Actualizar elementos del DOM
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Habilitar/deshabilitar botón de checkout
    if (checkoutBtn) {
        const isFormValid = validateForm();
        checkoutBtn.disabled = cart.length === 0 || !isFormValid;
    }
}

// Procesar pedido
function processOrder() {
    const cart = getCartFromStorage();
    
    console.log('Procesando pedido. Items en carrito:', cart.length);
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    if (!validateForm()) {
        alert('Por favor completa todos los campos requeridos del formulario');
        return;
    }
    
    // Mostrar loading en el botón
    const checkoutBtn = document.getElementById('checkout-btn');
    const btnText = checkoutBtn.querySelector('span');
    const btnLoading = checkoutBtn.querySelector('.btn-loading');
    
    btnText.textContent = 'PROCESANDO...';
    btnLoading.classList.remove('hidden');
    checkoutBtn.disabled = true;
    
    // Simular procesamiento
    setTimeout(() => {
        // Obtener datos del formulario
        const form = document.getElementById('customer-form');
        const formData = new FormData(form);
        const customerInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            notes: formData.get('notes') || ''
        };
        
        // Calcular totales
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const shipping = subtotal > 100 ? 0 : 9.99;
        const total = subtotal + shipping;
        
        // Crear objeto de pedido
        const order = {
            id: generateOrderId(),
            date: new Date().toISOString(),
            customer: customerInfo,
            items: [...cart],
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            status: 'confirmado'
        };
        
        console.log('Pedido creado:', order);
        
        // Guardar pedido
        saveOrderToStorage(order);
        
        // Mostrar popup de agradecimiento
        showThankYouPopup(order.id);
        
        // Limpiar carrito después de mostrar el popup
        saveCartToStorage([]);
        
        // Restaurar botón
        btnText.textContent = 'CONFIRMAR PEDIDO';
        btnLoading.classList.add('hidden');
        
    }, 2000);
}

// Generar ID de pedido
function generateOrderId() {
    return 'SP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
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

// Mostrar popup de agradecimiento
function showThankYouPopup(orderId) {
    const popup = document.getElementById('thank-you-popup');
    const orderIdElement = document.getElementById('popup-order-id');
    
    if (popup && orderIdElement) {
        orderIdElement.textContent = orderId;
        popup.classList.remove('hidden');
        
        // Deshabilitar scroll del body
        document.body.style.overflow = 'hidden';
    }
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando carrito...');
    initCart();
});

// También inicializar cuando la página está completamente cargada
window.addEventListener('load', function() {
    console.log('Página completamente cargada');
    debugCart();
});