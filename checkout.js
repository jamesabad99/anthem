window.onload = async () => {
  Wized.request.await("new_address", (response) => {
    let address = document.querySelector('[wized="input_address"]');
    let postalCode = document.querySelector('[wized="input_postal_code"]');
    let city = document.querySelector('[wized="input_city_address"]');
    let state = document.querySelector('[wized="select_state"]');
    let stateDropdown = document.querySelector(
      '[wized="select_current_state"]',
    );
    if (response.status == 200) {
      let addressModal = document.querySelector('[wized="address_modal"]');
      if (addressModal) {
        addressModal.style.display = "none";
        address.value = "";
        postalCode.value = "";
        city.value = "";
        state.value = "";
        stateDropdown.textContent == "Select a state";
      }
    }
  });

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

  Wized.data.listen("v.addresstoedit", async () => {
    let address = document.querySelector('[wized="input_address"]');
    let postalCode = document.querySelector('[wized="input_postal_code"]');
    let city = document.querySelector('[wized="input_city_address"]');
    let state = document.querySelector('[wized="select_state"]');
    let stateDropdown = document.querySelector(
      '[wized="select_current_state"]',
    );
    const newValue = await Wized.data.get("v.addresstoedit");

    if (newValue) {
      address.value = newValue.address;
      postalCode.value = newValue.postal_code;
      city.value = newValue.city;
      state.value = newValue.state;
      stateDropdown.textContent == newValue.state;
    } else {
      address.value = "";
      postalCode.value = "";
      city.value = "";
      state.value = "";
    }
  });

  let button = document.querySelector('[wized="add_address_button"]');
  button.addEventListener("click", async (event) => {
    const addressToEdit = await Wized.data.get("v.addresstoedit");
    const authToken = await Wized.data.get("c.token");
    const url = "https://xsiq-sv94-xbzu.n7c.xano.io/api:hzJ0YzyK/address/edit";
    const data = {
      address: document.querySelector('[wized="input_address"]').value,
      postal_code: document.querySelector('[wized="input_postal_code"]').value,
      city: document.querySelector('[wized="input_city_address"]').value,
      state: document.querySelector('[wized="select_state"]').value,
      old_address: addressToEdit,
    };
    if (addressToEdit != null) {
      button.classList.add("is-loading");
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          let addressModal = document.querySelector('[wized="address_modal"]');
          if (addressModal) {
            addressModal.style.display = "none";
          }
          await Wized.request.execute("Load user");
        }

        const responseData = await response.json();
        if (responseData.message) {
          let errorText = document.querySelector(
            '[wized="address_error_message"]',
          );
          if (errorText) {
            errorText.style.display = "block";
            errorText.textContent = responseData.message;
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        button.classList.remove("is-loading");
      }
    }
  });

  Wized.request.await("Load user", (response) => {
    let addressModal = document.querySelector('[wized="address_modal"]');
    let openModal = document.querySelectorAll('[wized="open_address_modal"]');
    openModal.forEach((button) => {
      button.addEventListener("click", () => {
        if (addressModal) {
          addressModal.style.display = "flex";
        }
      });
    });

    let closeModal = document.querySelectorAll('[wized="address_modal_close"]');
    closeModal.forEach((button) => {
      button.addEventListener("click", () => {
        if (addressModal) {
          addressModal.style.display = "none";
        }
      });
    });
    setTimeout(async function () {
      let openEdit = document.querySelectorAll(
        '[wized="open_edit_address_modal"]',
      );
      openEdit.forEach((button) => {
        button.addEventListener("click", () => {
          if (addressModal) {
            addressModal.style.display = "flex";
          }
        });
      });
    }, 200);
  });

  let selectedAddress;

  Wized.data.listen("v.addressSelected", async () => {
    selectedAddress = await Wized.data.get("v.addressSelected");
  });

  let step1 = document.querySelector('[wized="checkout_step_1"]');
  let step2 = document.querySelector('[wized="checkout_step_2"]');
  let step3 = document.querySelector('[wized="checkout_step_3"]');
  let step4 = document.querySelector('[wized="checkout_step_4"]');
  let step1ButtonNext = document.querySelector(
    '[wized="checkout_button-step-1"]',
  );
  let step2ButtonBack = document.querySelector(
    '[wized="checkout_button-step-2-back"]',
  );
  let step2ButtonNext = document.querySelector(
    '[wized="checkout_button-step-2"]',
  );
  let step3ButtonBack = document.querySelector(
    '[wized="checkout_button-step-3-back"]',
  );
  let step3ButtonNext = document.querySelector(
    '[wized="checkout_button-step-3-next"]',
  );
  let step4ButtonBack = document.querySelector(
    '[wized="checkout_button_step_4_back"]',
  );

  step1ButtonNext.addEventListener("click", () => {
    if (selectedAddress != "Local Pick Up") {
      step1.style.display = "none";
      step2.style.display = "flex";
    } else {
      step1.style.display = "none";
      step3.style.display = "flex";
    }
  });

  step2ButtonBack.addEventListener("click", () => {
    step1.style.display = "flex";
    step2.style.display = "none";
  });

  step2ButtonNext.addEventListener("click", () => {
    step2.style.display = "none";
    step3.style.display = "flex";
  });

  step3ButtonBack.addEventListener("click", () => {
    if (selectedAddress != "Local Pick Up") {
      step2.style.display = "flex";
      step3.style.display = "none";
    } else {
      step1.style.display = "flex";
      step3.style.display = "none";
    }
  });
  step3ButtonNext.addEventListener("click", () => {
    step3.style.display = "none";
    step4.style.display = "flex";
  });
  step4ButtonBack.addEventListener("click", () => {
    step3.style.display = "flex";
    step4.style.display = "none";
  });
};
