// Funciones para manejar el almacenamiento local

// Guardar carrito en localStorage
function saveCartToStorage(cart) {
    localStorage.setItem('sportsStoreCart', JSON.stringify(cart));
    updateCartCount();
}

// Obtener carrito desde localStorage
function getCartFromStorage() {
    const cart = localStorage.getItem('sportsStoreCart');
    return cart ? JSON.parse(cart) : [];
}

// Guardar pedidos en localStorage
function saveOrderToStorage(order) {
    const orders = getOrdersFromStorage();
    orders.push(order);
    localStorage.setItem('sportsStoreOrders', JSON.stringify(orders));
}

// Obtener pedidos desde localStorage
function getOrdersFromStorage() {
    const orders = localStorage.getItem('sportsStoreOrders');
    return orders ? JSON.parse(orders) : [];
}

// Actualizar contador de carrito en el header
function updateCartCount() {
    const cart = getCartFromStorage();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Actualizar en todas las páginas
    const cartCountElements = document.querySelectorAll('#header-cart-count');
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = count;
        }
    });
    
    return count;
}

// Función para debug
function debugCart() {
    const cart = getCartFromStorage();
    console.log('Carrito actual:', cart);
    console.log('Número de items:', cart.length);
    return cart;
}

// Inicializar contador de carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Debug: mostrar carrito en consola
    console.log('Carrito al cargar:', getCartFromStorage());
});