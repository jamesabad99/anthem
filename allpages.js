window.onload = async () => {
  Wized.data.listen("c.cartitems", async () => {
    const cart = await Wized.data.get("c.cartitems"); // Get new value

    // Get the element with the specified attribute
    let regularCheckout = document.querySelector(
      '[wized="cart_checkout-regular-wrap"]',
    );
    let preBuyCheckout = document.querySelectorAll(
      '[no-wized="cart_checkout-prebuy-wrap"]',
    );

    let onlyOnContractCopy = document.querySelector(
      '[wized="only-on-contract-copy"]',
    );

    // Check if the element exists before adding the class
    if (cart.cart_statuses.prebuy === true) {
      // Add the "hide" class to the element
      preBuyCheckout.forEach(function (element) {
        element.classList.remove("hide");
      });
    }

    if (cart.cart_statuses.prebuy === false) {
      // Add the "hide" class to the element
      preBuyCheckout.forEach(function (element) {
        element.classList.add("hide");
      });
    }
    // Check if the element exists before adding the class
    if (cart.cart_statuses.regular_checkout === true) {
      // Add the "hide" class to the element
      regularCheckout.classList.remove("hide");
      console.log(cart.cart_statuses.regular_checkout);
    }

    if (cart.cart_statuses.regular_checkout === false) {
      regularCheckout.classList.add("hide");
    }

    // Check if the element exists before adding the class
    if (
      cart.cart_statuses.regular_checkout === false &&
      cart.cart_statuses.prebuy === false
    ) {
      // Add the "hide" class to the element
      onlyOnContractCopy.classList.remove("hide");
    } else {
      onlyOnContractCopy.classList.add("hide");
    }
  });
};
