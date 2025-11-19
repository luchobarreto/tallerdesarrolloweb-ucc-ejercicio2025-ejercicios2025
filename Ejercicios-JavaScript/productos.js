import { productos } from './tienda.js';

const PRODUCTOS = productos;

const productsWrapper = document.getElementById('products-wrapper');

const showModal = (name, description) => {
    console.log("jsa")
    const modal = document.getElementById('modal');
    modal.innerHTML = buildDialogInnerHTML(name, description);
    modal.style.display = 'block';
}

const hideModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

const buildImageSource = (imageName) => `./images/${imageName}`;

const buildDialog = () => `<dialog id="modal"></dialog>`;

const buildProductHTML = (name, description, imageSource) => `
<div class="product-container">
    <img src="${imageSource}" alt="">
    <p>${name}</p>
    <button onclick="showModal('${name}', '${description}')">Ver Detalle del Producto</button>
</div>
`;

window.showModal = showModal;
window.hideModal = hideModal;

const buildDialogInnerHTML = (name, description) => `
    <h2>Detalle del Producto</h2>
    <h3>${name}</h3>
    <p>${description}</p>
    <button onclick="hideModal()">Cerrar</button>
`;

const renderProducts = () => {
    let productsHtml = "";
    PRODUCTOS.forEach(p => {
        productsHtml += buildProductHTML(
            p.nombre,
            p.description,
            buildImageSource(p.imagen)
        );
    });
    productsHtml += buildDialog();
    productsWrapper.innerHTML = productsHtml;
}

const main = () => {
    renderProducts();
}

main();