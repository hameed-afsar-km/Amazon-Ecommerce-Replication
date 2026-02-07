export let cart = JSON.parse(localStorage.getItem("cart"));

// if (!cart) {
//     cart = [{ productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", quantity: 2 },
//     { productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d", quantity: 3 }];
// }



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
            quantity: 1
        });
    }

    saveToStorage()
}

export function updateCartQty() {
    let cartQty = 0;
    cart.forEach((cartItem) => {
        cartQty += cartItem.quantity;
        console.log(cartQty);
    })

    document.querySelector(".cart-quantity").innerText = cartQty;

    saveToStorage()
}

export function removeFromCart(productId) {
    let newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push({
                productId: productId,
                quantity: (cartItem.quantity - 1)
            });
        }
    })
    cart = newCart;

    console.log(cart);

    saveToStorage()
}