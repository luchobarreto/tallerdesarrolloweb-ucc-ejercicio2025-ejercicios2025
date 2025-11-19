import {products as PRODUCTS} from './tienda.js';

const LOCAL_STORAGE_CART_KEY = "cart";

const productsWrapper = document.getElementById('products-wrapper');
const cartWrapper = document.getElementById('cart-wrapper');
const cleanCartButton = document.getElementById('clean-cart');

const buildImageSource = (imageName) => `./images/${imageName}`;

const buildDialog = () => `<dialog id="modal"></dialog>`;

const buildDialogInnerHTML = (name, description) => `
    <h2>Detalle del Producto</h2>
    <h3>${name}</h3>
    <p>${description}</p>
    <button onclick="hideModal()">Cerrar</button>
`;

const buildProductHTML = (product) => `
<div class="product-container">
    <img src="${buildImageSource(product.image)}" alt="">
    <p>${product.name}</p>
    <button onclick="showModal('${product.name}', '${product.description}')" class="btn-white mt-auto">
        Ver Detalle del Producto
    </button>
    <button onclick="addToCart('${product.id}')" class="mt-6">
        Añadir al Carrito
    </button>
</div>
`;

const buildEmptyCartMessageHTMl = () => `
<div class="empty-cart-message">
    Tu carrito está vacio, revisa nuestro <a href="productos.html">Catálogo</a> para añadir productos!
</div>
`;

const buildCartProductHTML = (productCart) => `
    <div class="product-container">
        <img src="${buildImageSource(productCart.image)}" alt="">
        <p>${productCart.name}</p>
        <span>Unidades: ${productCart.units}</span>
        <button onclick="addToCart('${productCart.id}')" class="mt-auto">
            Añadir una unidad
        </button>  
        <button onclick="removeFromCart('${productCart.id}')" class="btn-white mt-6">
            ${productCart.units < 2 ? 'Eliminar del carrito' : 'Eliminar una unidad'}
        </button>
    </div>
`;

const renderProducts = () => {
    if(productsWrapper) {
        let productsHtml = "";
        PRODUCTS.forEach(p => {
            productsHtml += buildProductHTML(p);
        });
        productsHtml += buildDialog();
        productsWrapper.innerHTML = productsHtml;
    }
}

const renderCart = () => {
    if(cartWrapper) {
        let cartHtml = "";
        const rawLocalStorageCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if(!rawLocalStorageCart) {
            cartHtml = buildEmptyCartMessageHTMl();
        } else {
            const currentCart = JSON.parse(rawLocalStorageCart);
            if(currentCart.length > 0) {
                currentCart.forEach(productCart => {
                    cartHtml += buildCartProductHTML(productCart);
                });
            } else {
                cartHtml = buildEmptyCartMessageHTMl();
            }
        }
        cartWrapper.innerHTML = cartHtml;
    }
}

const showModal = (name, description) => {
    const modal = document.getElementById('modal');
    modal.innerHTML = buildDialogInnerHTML(name, description);
    modal.style.display = 'block';
}

const hideModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

const addToCart = (productIdString) => {
    const productId = Number(productIdString);
    const product = PRODUCTS.find(p => p.id === productId);
    let rawLocalStorage = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    let currentLocalStorage = [];

    if(!rawLocalStorage) {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify([]));
    } else {
        currentLocalStorage = JSON.parse(rawLocalStorage);
    }

    let currentProductIndex = -1;

    if(currentLocalStorage.length > 0) {
        currentProductIndex = currentLocalStorage.findIndex(p => p.id === productId);
    }

    if(currentProductIndex !== -1) {
        const currentProduct = currentLocalStorage[currentProductIndex];
        currentProduct.units += 1;
        currentLocalStorage[currentProductIndex] = currentProduct;
    } else {
        currentLocalStorage.push({
            ...product,
            units: 1
        });
    }

    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(currentLocalStorage));
    renderCart();
    alert("Producto añadido al carrito exitosamente!");
}

const removeFromCart = (productIdString) => {
    const rawLocalStorage = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if(rawLocalStorage) {
        const productId = Number(productIdString);
        const currentLocalStorage = JSON.parse(rawLocalStorage);
        const currentProductIndex = currentLocalStorage.findIndex(p => p.id === productId);
        const currentProduct = currentLocalStorage[currentProductIndex];

        if(currentProduct.units > 1) {
            currentProduct.units -= 1;
            currentLocalStorage[currentProductIndex] = currentProduct;
        } else {
            currentLocalStorage.splice(currentProductIndex, 1);
        }

        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(currentLocalStorage));
        renderCart();
    }
}

if(cleanCartButton) {
    cleanCartButton.addEventListener('click', () => {
       localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify([]));
       renderCart();
    });
}

window.showModal = showModal;
window.hideModal = hideModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

const main = () => {
    renderProducts();
    renderCart();
}

main();