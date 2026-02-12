import { cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { getDeliveryOption } from "../utils/deliveryOptions.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let productCount = 0;


  cart.forEach((cartElement) => {
    const matchingItem = getProduct(cartElement.productId);
    productPriceCents += matchingItem.priceCents * cartElement.quantity;
    const deliveryOption = getDeliveryOption(cartElement.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
    productCount += cartElement.quantity;
  });
  let productPrice = productPriceCents;
  let shippingPrice = shippingPriceCents;
  let beforeTax = productPrice + shippingPrice;
  let afterTax = beforeTax + (beforeTax * 0.1);

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${productCount}):</div>
          <div class="payment-summary-money">$${formatCurrency(productPrice)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${formatCurrency(shippingPrice)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${formatCurrency(beforeTax)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${formatCurrency(afterTax - beforeTax)}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${formatCurrency(afterTax)}</div>
        </div>

        <button class="place-order-button button-primary js-place-order">
          Place your order
        </button>
    `;

  document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order').addEventListener('click', () => {
    const toast = document.querySelector('.js-checkout-toast');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  });
}