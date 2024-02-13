const PURCHASE_FAILED_MESSAGE = "Purchase failed. Please try again.";

window.onload = async () => {
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

  Wized.request.await("Get Positions", async (response) => {
    setTimeout(async function () {
      window.Webflow && window.Webflow.destroy();
      window.Webflow && window.Webflow.ready();
      window.Webflow && window.Webflow.require("ix2").init();
      document.dispatchEvent(new Event("readystatechange"));
      console.log("Webflow Interactions have been reloaded!");
    }, 200);
    const positionsArray = await Wized.data.get("v.positions");

    const bindCheckoutToPurchaseButtons = () => {
      const targetNode = document.body;
      const config = { attributes: false, childList: true, subtree: true };
      let quantitiesMap = new Map();
      const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            const purchaseButtons = document.querySelectorAll(
              'a[wized="positiion_add_to_cart"]',
            );
            purchaseButtons.forEach((purchaseBtnEl) => {
              if (!purchaseBtnEl.classList.contains("event-attached")) {
                purchaseBtnEl.classList.add("event-attached");
                purchaseBtnEl.addEventListener("click", async () => {
                  const positionIdElement = purchaseBtnEl.querySelector(
                    ".hidden-position-id",
                  );
                  console.log("> Position ID element: ", positionIdElement);
                  if (!positionIdElement) {
                    console.error("Position ID element is missing");
                    return;
                  }

                  const positionId = positionIdElement.innerHTML;

                  if (!positionId) {
                    console.error("Position ID is not defined");
                    return;
                  }

                  purchaseBtnEl.classList.add("is-loading");
                  const products = quantitiesMap.get(positionId);

                  if (!products || products.length === 0) {
                    console.error(
                      "No products found for the given position ID",
                    );
                    return;
                  }

                  const response = await sendPositionIdQuantities(
                    positionId,
                    products,
                    purchaseBtnEl,
                  );
                  if (response) {
                    purchaseBtnEl.classList.remove("is-loading");
                  }
                });
              }
            });

            const quantityInputs = document.querySelectorAll(
              'input[wized="position-product_qty"]',
            );

            quantityInputs.forEach(function (inputEl) {
              const positionId = inputEl.getAttribute("positionId");
              const productId = inputEl.getAttribute("cargoId");
              console.log("> Input El value: ", inputEl.value);
              if (quantitiesMap.has(positionId)) {
                const productIndex = quantitiesMap
                  .get(positionId)
                  .findIndex((product) => product.id === productId);
                if (productIndex !== -1) {
                  quantitiesMap.get(positionId)[productIndex].quantity = Number(
                    inputEl.value,
                  );
                } else {
                  quantitiesMap.get(positionId).push({
                    id: productId,
                    quantity: Number(inputEl.value),
                  });
                }
              } else {
                quantitiesMap.set(positionId, [
                  {
                    id: productId,
                    quantity: Number(inputEl.value),
                  },
                ]);
              }

              if (!inputEl.classList.contains("event-attached")) {
                inputEl.classList.add("event-attached");
                inputEl.addEventListener("input", (event) => {
                  console.log("> Input event: ", event.target.value);
                  let quantitiesForPosId;
                  if (quantitiesMap.get(positionId)) {
                    quantitiesForPosId = quantitiesMap.get(positionId);
                    const productIndex = quantitiesForPosId.findIndex(
                      (product) => product.id === productId,
                    );
                    if (productIndex !== -1) {
                      quantitiesForPosId[productIndex].quantity = Number(
                        event.target.value,
                      );
                    } else {
                      quantitiesForPosId.push({
                        id: productId,
                        quantity: Number(event.target.value),
                      });
                    }
                  } else {
                    quantitiesForPosId = [
                      { id: productId, quantity: Number(event.target.value) },
                    ];
                  }
                  quantitiesMap.set(positionId, quantitiesForPosId);
                  let pricePerBag = 0;
                  const positionObj = positionsArray.find(
                    (positionObj) => positionObj.id === Number(positionId),
                  );
                  if (positionObj) {
                    console.log("Typeof productId: ", typeof productId);
                    console.log("Products: ", positionObj.products);
                    const product = positionObj.products.find((product) => {
                      console.log("product.cargos_id: ", product.cargos_id);
                      console.log("productId: ", Number(productId.trim()));
                      return product.cargos_id === Number(productId.trim());
                    });
                    console.log("> Product: ", product);
                    if (product) {
                      console.log("Found product:", product);
                      pricePerBag = parseFloat(product.price); // Convert to number
                    } else {
                      console.warn(
                        "No matching product found for productId:",
                        productId,
                      );
                    }
                  } else {
                    console.warn(
                      "No matching position found for positionId:",
                      positionId,
                    );
                  }
                  console.log("> Price per bag:", pricePerBag);
                  console.log("> Quantity from input:", event.target.value);

                  const updatedTotal =
                    pricePerBag * parseFloat(event.target.value); // Convert to number
                  console.log("> Computed total:", updatedTotal);

                  // let pricePerBag = 0;
                  // console.log("positionsArray: ", positionsArray);
                  // const positionObj = positionsArray.find(
                  //   (positionObj) => positionObj.id === Number(positionId)
                  // );
                  // if (positionObj) {
                  //   console.log(positionObj);
                  //   const product = positionObj.products.find(
                  //     (product) => product.products_id === productId
                  //   );
                  //   if (product) {
                  //     console.log("product: ", product);
                  //     pricePerBag = product.price;
                  //   }
                  // }
                  // const updatedTotal = pricePerBag * event.target.value;
                  const totalLabels = document.querySelectorAll(".total-label");
                  const totalElArray = Array.from(totalLabels);
                  console.log("Input position id: ", positionId);
                  const totalEl = totalElArray.find((el) => {
                    console.log(
                      "El position id: ",
                      el.getAttribute("positionid"),
                    );
                    return el.getAttribute("positionid") === positionId;
                  });
                  if (totalEl) {
                    console.log("Total El found: ", totalEl);
                    console.log("Updated total: ", updatedTotal);
                    totalEl.innerHTML = updatedTotal.toFixed(2);
                  }
                });
              }
            });
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    };

    bindCheckoutToPurchaseButtons();
  });

  const token = await Wized.data.get("c.token");

  const sendPositionIdQuantities = async (
    positionsId,
    products,
    purchaseBtnEl,
  ) => {
    const payload = {
      positions_id: positionsId,
      quantities: products,
    };

    const url =
      "https://xsiq-sv94-xbzu.n7c.xano.io/api:hzJ0YzyK/precheckout/from_position";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (data?.message) {
        purchaseBtnEl.classList.remove("is-loading");
        purchaseBtnEl.innerHTML = data.message;
        purchaseBtnEl.disabled = true;
      } else if (data) {
        window.location.href = data;
      }
    } catch (error) {
      purchaseBtnEl.innerHTML = error?.message
        ? `${error.message}`
        : PURCHASE_FAILED_MESSAGE;
    }
  };
};
