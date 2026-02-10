const cart = {
    cartItems: undefined,
    loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem("cart-oop"));
        if (!this.cartItems) {
            this.cartItems = [{
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
    },
    saveToStorage() {
        localStorage.setItem("cart-oop", JSON.stringify(this.cartItems));
    }
};

cart.loadFromStorage();



export function addToCart(productId) {
    let matchingItem;
    cart.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    })

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.cartItems.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: '1'
        });
    }

    cart.saveToStorage()
}

export function updateCartQty() {
    let cartQty = 0;
    cart.cartItems.forEach((cartItem) => {
        cartQty += cartItem.quantity;
    })

    document.querySelector(".cart-quantity").innerText = cartQty;

    cart.saveToStorage()
}

export function removeFromCart(productId) {
    let newCart = [];

    cart.cartItems.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            if (cartItem.quantity > 1) {
                newCart.push({
                    productId: productId,
                    quantity: (cartItem.quantity - 1),
                    deliveryOptionId: cartItem.deliveryOptionId
                });
            }
        } else {
            newCart.push(cartItem);
        }
    })
    cart.cartItems = newCart;

    cart.saveToStorage()
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    })

    matchingItem.deliveryOptionId = deliveryOptionId;

    cart.saveToStorage();
}

// function cartItemsCount() {
//     let qty = 0;
//     cart.forEach((e) => {
//         qty += 1;
//     })
//     return qty
// }