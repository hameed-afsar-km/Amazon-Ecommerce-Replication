import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js';
import products from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions } from './utils/deliveryOptions.js';

function renderOrderSummary() {


    let cartHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        let matchingItem;
        products.forEach((product) => {
            if (product.id === productId) {
                matchingItem = product;
            }
        });

        const deliveryOptionId = String(cartItem.deliveryOptionId);
        let deliveryOption = deliveryOptions.find((option) => option.id === deliveryOptionId);
        if (!deliveryOption) deliveryOption = deliveryOptions[0];

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
    <div class="product-quantity">
    <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
    <span class="update-quantity-link link-primary" data-product-id="${matchingItem.id}">Update</span>
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
            <div class="delivery-option" js-delivery-option data-product-id="${matchingItem.id}" data-delivery-option-id="${deliveryOption.id}">
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
        });
    });

    document.querySelectorAll('.update-quantity-link').forEach((btn) => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener("click", () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
        })
    });
}

renderOrderSummary();