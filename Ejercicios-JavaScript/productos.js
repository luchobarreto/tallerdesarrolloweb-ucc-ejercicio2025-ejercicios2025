import {products as PRODUCTS} from './tienda.js';

const LOCAL_STORAGE_CART_KEY = "cart";

const productsWrapper = document.getElementById('products-wrapper');
const cartWrapper = document.getElementById('cart-wrapper');
const cleanCartButton = document.getElementById('clean-cart');
const searchForm = document.getElementById('search-form');
const clearFiltersButton = document.getElementById('clear-filters');
const brandSelect = document.getElementById('brand-select');
const cartCounter = document.getElementById('cart-counter');
const checkoutContainer = document.getElementById('checkout-container');
const sortSelect = document.getElementById('sort-select');

const buildImageSource = (imageName) => `./images/${imageName}`;
const buildDialog = () => `<dialog id="modal"></dialog>`;
const buildPriceLocale = (val) => new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
}).format(val);

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
    <span>
        ${buildPriceLocale(product.price)}
    </span>
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
        <span>
            ${buildPriceLocale(productCart.price)}
        </span>
        <span>Unidades: ${productCart.units}</span>
        <button onclick="addToCart('${productCart.id}')" class="mt-auto">
            Añadir una unidad
        </button>  
        <button onclick="removeFromCart('${productCart.id}')" class="btn-white mt-6">
            ${productCart.units < 2 ? 'Eliminar del carrito' : 'Eliminar una unidad'}
        </button>
    </div>
`;

const buildCheckoutProductHTML = (productCart) => `
    <p>
        <b>Producto:</b> ${productCart.name}<br/>
        <b>Precio:</b> ${productCart.price}<br/>
        <b>Cantidad:</b> ${productCart.units}<br/>
    </p>
    <hr/>
`;

let searchQuery = "";
let minPrice = "";
let maxPrice = "";
let protectorsChecked = false;
let trainingChecked = false;
let doboksChecked = false;
let selectedBrand = "";
let currentSort = "";

const filterProducts = (searchQuery, minPrice, maxPrice, protectors, training, doboks, selectedBrand) => {
    return PRODUCTS.filter(product => {
        const matchesSearch = searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;

        const matchesMinPrice = minPrice ? product.price >= minPrice : true;

        const matchesMaxPrice = maxPrice ? product.price <= maxPrice : true;

        const matchesCategory =
            (protectors && product.category === 'Protectores') ||
            (training && product.category === 'Entrenamiento') ||
            (doboks && product.category === 'Dobok') ||
            (!protectors && !training && !doboks);

        const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;

        return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCategory && matchesBrand;
    });
};

const sortProducts = (productsArray, sortOption) => {
    const arr = [...productsArray];
    switch (sortOption) {
        case 'price-asc':
            arr.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            arr.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            arr.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            arr.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            break;
    }
    return arr;
};

const renderProducts = () => {
    if (productsWrapper) {
        const filteredProducts = filterProducts(
            searchQuery,
            minPrice,
            maxPrice,
            protectorsChecked,
            trainingChecked,
            doboksChecked,
            selectedBrand
        );

        const finalProducts = currentSort ? sortProducts(filteredProducts, currentSort) : filteredProducts;

        let productsHtml = "";
        finalProducts.forEach(p => {
            productsHtml += buildProductHTML(p);
        });
        productsHtml += buildDialog();

        productsWrapper.innerHTML = productsHtml;
    }
}

const renderCheckout = () => {
    if(checkoutContainer) {
        const rawLocalStorageCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if(!rawLocalStorageCart) {
            checkoutContainer.innerHTML = "-";
        } else {
            const currentCart = JSON.parse(rawLocalStorageCart);
            let checkoutHtml = "";
            let total = 0;
            currentCart.forEach(productCart => {
                checkoutHtml += buildCheckoutProductHTML(productCart);
                total += productCart.price * productCart.units;
            });
            checkoutHtml += `
                <p>
                    <b>Total:</b>   
                    ${buildPriceLocale(total)}
                </p>
            `;
            checkoutContainer.innerHTML = checkoutHtml;
        }
    }
}

const renderCart = () => {
    let productsAmount = 0;
    let cartHtml = "";
    const rawLocalStorageCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if(!rawLocalStorageCart) {
        cartHtml = buildEmptyCartMessageHTMl();
    } else {
        const currentCart = JSON.parse(rawLocalStorageCart);
        if(currentCart.length > 0) {
            currentCart.forEach(productCart => {
                productsAmount++;
                cartHtml += buildCartProductHTML(productCart);
            });
        } else {
            cartHtml = buildEmptyCartMessageHTMl();
        }
    }
    if(cartWrapper) {
        cartWrapper.innerHTML = cartHtml;
    }
    if(cartCounter) {
        cartCounter.innerHTML = String(productsAmount);
    }
    renderCheckout();
}

const getUniqueBrands = () => {
    const brands = PRODUCTS.map(product => product.brand);
    return [...new Set(brands)];
}

const renderBrands = () => {
    if(brandSelect) {
        const uniqueBrands = getUniqueBrands();
        uniqueBrands.forEach(brand => {
            const option = document.createElement("option");
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    }
};

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

if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();

        searchQuery = document.getElementById('search-input').value;
        minPrice = document.getElementById('min-price-input').value;
        maxPrice = document.getElementById('max-price-input').value;

        protectorsChecked = document.getElementById('protectors').checked;
        trainingChecked = document.getElementById('training').checked;
        doboksChecked = document.getElementById('doboks').checked;

        selectedBrand = brandSelect.value;

        renderProducts();
    });
}

if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', () => {
        searchQuery = "";
        minPrice = "";
        maxPrice = "";
        protectorsChecked = false;
        trainingChecked = false;
        doboksChecked = false;
        selectedBrand = "";
        currentSort = "";

        document.getElementById('search-input').value = "";
        document.getElementById('min-price-input').value = "";
        document.getElementById('max-price-input').value = "";
        document.getElementById('protectors').checked = false;
        document.getElementById('training').checked = false;
        document.getElementById('doboks').checked = false;
        brandSelect.value = "";
        if (sortSelect) sortSelect.value = "";

        renderProducts();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });
}

window.showModal = showModal;
window.hideModal = hideModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

const main = () => {
    renderProducts();
    renderBrands();
    renderCart();
}

main();
