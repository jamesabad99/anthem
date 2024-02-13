window.onload = async () => {
  $(function () {
    $("body").scrollTop(0);
  });

  Wized.data.listen("c.cartitems", async () => {
    const cart = await Wized.data.get("c.cartitems"); // Get new value

    console.log(cart);

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
      console.log(cart.cart_statuses.regular_checkout);
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

  Wized.request.await("Load Product", (response) => {
    // Delay the execution of the code inside the setTimeout by 2 seconds (500 milliseconds)
    setTimeout(function () {
      $(".like-button").on("click", function () {
        $(this).siblings(".liked-button").addClass("is-active");
      });
      $(".liked-button").on("click", function () {
        $(this).removeClass("is-active");
      });
    }, 500);
  });

  Wized.data.listen("v.option", async () => {
    // Get the input element
    const quantityInput = document.getElementById("qty");
    // Set the maximum value
    let cargo = await Wized.data.get("v.option");

    let maxValue = cargo.maxQuantity;

    // Add onchange event listener to the input element
    quantityInput.addEventListener("change", async function () {
      cargo = await Wized.data.get("v.option");
      maxValue = cargo.maxQuantity;
      if (quantityInput.value > maxValue) quantityInput.value = maxValue;
      await Wized.data.setVariable("productquantity", quantityInput.value);
      await Wized.request.execute("Get Product Price");
    });

    // Get all elements with the attribute [wized="product-source_option-wrap"]
    var elements = document.querySelectorAll(
      '[wized="product-source_option-wrap"]',
    );

    // Add a click event listener to each element
    elements.forEach(function (element) {
      element.addEventListener("click", async function () {
        cargo = await Wized.data.get("v.option");
        maxValue = cargo.maxQuantity;
        const quantityInput = document.getElementById("qty");
        if (quantityInput.value > maxValue) quantityInput.value = maxValue;
        await Wized.data.setVariable("productquantity", quantityInput.value);
        await Wized.request.execute("Get Product Price");
      });
    });
  });
};
