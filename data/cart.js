export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
    cart = [{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 3,
        deliveryOptionId: '2'
    }];
}



function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    })

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: '1'
        });
    }

    saveToStorage()
}

export function updateCartQty() {
    let cartQty = 0;
    cart.forEach((cartItem) => {
        cartQty += cartItem.quantity;
    })

    document.querySelector(".cart-quantity").innerText = cartQty;

    saveToStorage()
}

export function removeFromCart(productId) {
    let newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            if (cartItem.quantity > 1) {
                newCart.push({
                    productId: productId,
                    quantity: (cartItem.quantity - 1)
                });
            }
        } else {
            newCart.push(cartItem);
        }
    })
    cart = newCart;

    saveToStorage()
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    })

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}

// function cartItemsCount() {
//     let qty = 0;
//     cart.forEach((e) => {
//         qty += 1;
//     })
//     return qty
// }