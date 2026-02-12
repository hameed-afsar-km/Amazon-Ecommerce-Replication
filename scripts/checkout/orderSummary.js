import { cart, removeFromCart, updateDeliveryOption, updateQuantity } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption } from '../utils/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {


    let cartHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingItem = getProduct(productId);
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
    <div class="delivery-date">
    Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
    <img class="product-image" src="${matchingItem.image}">
    <div class="cart-item-details">
    <div class="product-name">${matchingItem.name}</div>
    <div class="product-price">$${formatCurrency(matchingItem.priceCents)}</div>
    <div class="product-quantity js-product-quantity-${matchingItem.id}">
    <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}">Update</span>
    <input class="quantity-input js-quantity-input-${matchingItem.id}" type="number" value="${cartItem.quantity}" min="1" max="1000">
    <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingItem.id}">Save</span>
    <span class="delete-quantity-link link-primary" data-product-id="${matchingItem.id}">Delete</span>
    </div>
    </div>
    <div class="delivery-options">
    <div class="delivery-options-title">Choose a delivery option:</div>
    ${deliveryOptionsHTML(matchingItem, cartItem)}
    </div>
      </div>
      </div>`;
    });

    function deliveryOptionsHTML(matchingItem, cartItem) {
        let html = '';
        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            const priceString =
                deliveryOption.priceCents === 0
                    ? 'FREE'
                    : `$${formatCurrency(deliveryOption.priceCents)} -`;
            const isChecked = String(deliveryOption.id) === String(cartItem.deliveryOptionId);
            html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingItem.id}" data-delivery-option-id="${deliveryOption.id}">
            <input
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}"
            value="${deliveryOption.id}"
            ${isChecked ? 'checked' : ''}
            >
            <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
            </div>
            </div>`;
        });
        return html;
    }

    document.querySelector('.order-summary').innerHTML = cartHTML;

    document.querySelectorAll('.delete-quantity-link').forEach((btn) => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            if (container) container.remove();
            renderOrderSummary();
            renderPaymentSummary();
            cartNumber();
        });
    });

    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-product-quantity-${productId}`);
            container.classList.add('is-editing-quantity');
        });
    });

    document.querySelectorAll('.js-save-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-product-quantity-${productId}`);
            container.classList.remove('is-editing-quantity');

            const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
            const newQuantity = Number(quantityInput.value);

            if (newQuantity > 0 && newQuantity < 1000) {
                updateQuantity(productId, newQuantity);
                renderOrderSummary();
                renderPaymentSummary();
                cartNumber();
            } else {
                alert('Quantity must be between 1 and 999');
            }
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener("click", () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        })
    });
}

cartNumber();

export function cartNumber() {
    let productCount = 0;
    cart.forEach((cartElement) => {
        productCount += cartElement.quantity;
    });
    document.querySelector(".return-to-home-link").textContent = `${productCount} items`;
}
