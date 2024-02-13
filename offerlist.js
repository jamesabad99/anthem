window.onload = async () => {
  // Initialize SlimSelect for a select element
  const select = new SlimSelect({
    select: "#multiple",
  });

  const select2 = new SlimSelect({
    select: "#multipleAromas",
  });

  const select3 = new SlimSelect({
    select: "#multipleOrigins",
  });

  const select4 = new SlimSelect({
    select: "#multipleCertifications",
  });

  const select5 = new SlimSelect({
    select: "#multipleProcesses",
  });

  let clearButton = document.querySelector('[wized="clear-filters"]');
  clearButton.addEventListener("click", async function (e) {
    await Wized.data.setVariable("valueorigin", "");
    await Wized.data.setVariable("processingfilter", "");
    await Wized.data.setVariable("featuresfilter", "");
    await Wized.data.setVariable("scorefilter", "");
    await Wized.data.setVariable("bagsavailablefilter", "");
    await Wized.data.setVariable("offerlistsearchinput", "");
    await Wized.data.setVariable("flavorsArray", "");
    await Wized.data.setVariable("aromasArray", "");
    await Wized.data.setVariable("originsArray", "");
    await Wized.data.setVariable("certificationsArray", "");
    select.setSelected();
    select2.setSelected();
    select3.setSelected();
    select4.setSelected();
    await Wized.request.execute("Render Products List");
    await Wized.request.execute("Get Orders");
    // If the repeated calls to setVariable with the same value are not needed, remove them.
  });

  Wized.request.await("Get Origins", async (response) => {
    const arrayToFormat2 = await Wized.data.get("r.20.d");
    const transformedArray2 = arrayToFormat2.map((item2) => ({
      text: `${item2.name}`,
      value: `${item2.id}`,
    }));
    select3.setData(transformedArray2);
  });

  Wized.request.await("Get Processes", async (response) => {
    const arrayToFormat5 = await Wized.data.get("r.61.d");
    const transformedArray5 = arrayToFormat5.map((item5) => ({
      text: `${item5.name}`,
      value: `${item5.id}`,
    }));
    select5.setData(transformedArray5);
  });

  Wized.request.await("Get Certifications", async (response) => {
    const arrayToFormat = await Wized.data.get("r.60.d");
    const transformedArray = arrayToFormat.map((item) => ({
      text: `${item.name}`,
      value: `${item.id}`,
    }));
    select4.setData(transformedArray);
  });

  // Select and check a specific radio button
  const radioToPreselect1 = document.querySelector(
    'input[wized="input_availability"][value="all"]',
  );
  if (radioToPreselect1) {
    radioToPreselect1.checked = true;
  }

  // Select elements by class name and add a class to the first one
  const radioToPreselect2 = document.getElementsByClassName("filters_radio-2");
  if (radioToPreselect2.length > 0) {
    radioToPreselect2[0].classList.add("w--redirected-checked");
  }

  // Event listener for a select element change
  document
    .getElementById("multipleProcesses")
    .addEventListener("change", async function () {
      const values = select.getSelected();
      await Wized.data.setVariable("processinglist", values);
      await Wized.request.execute("Render Products List");
    });

  document
    .getElementById("multiple")
    .addEventListener("change", async function () {
      const values = select.getSelected();
      await Wized.data.setVariable("flavorsArray", values);
      await Wized.request.execute("Render Products List");
    });

  // Event listener for a select element change
  document
    .getElementById("multipleAromas")
    .addEventListener("change", async function () {
      const values2 = select2.getSelected();
      await Wized.data.setVariable("aromasArray", values2);
      await Wized.request.execute("Render Products List");
    });

  // Event listener for a select element change
  document
    .getElementById("multipleOrigins")
    .addEventListener("change", async function () {
      const values3 = select3.getSelected();
      await Wized.data.setVariable("originsArray", values3);
      await Wized.request.execute("Render Products List");
    });

  // Event listener for a select element change
  document
    .getElementById("multipleCertifications")
    .addEventListener("change", async function () {
      const values4 = select4.getSelected();
      await Wized.data.setVariable("certificationsArray", values4);
      await Wized.request.execute("Render Products List");
    });

  Wized.data.listen("c.cartitems", async () => {
    const cart = await Wized.data.get("c.cartitems");

    let regularCheckout = document.querySelector(
      '[wized="cart_checkout-regular-wrap"]',
    );
    let preBuyCheckout = document.querySelectorAll(
      '[no-wized="cart_checkout-prebuy-wrap"]',
    );

    if (cart.cart_statuses.prebuy === true) {
      preBuyCheckout.forEach((element) => element.classList.remove("hide"));
    }

    if (cart.cart_statuses.prebuy === false) {
      preBuyCheckout.forEach((element) => element.classList.add("hide"));
    }

    if (cart.cart_statuses.regular_checkout === true) {
      regularCheckout.classList.remove("hide");
    }

    if (cart.cart_statuses.regular_checkout === false) {
      regularCheckout.classList.add("hide");
    }
  });

  // Additional functionality for handling product list rendering and like buttons
  Wized.request.await("Render Products List", (response) => {
    setTimeout(() => {
      $(".like-button").on("click", function () {
        $(this).siblings(".liked-button").addClass("is-active");
      });
      $(".liked-button").on("click", function () {
        $(this).removeClass("is-active");
      });

      var radioButtons = document.querySelectorAll(".filters_radio");
      radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
          var label = radioButton.nextElementSibling;
          if (label && label.classList.contains("filters_radio-label")) {
            label.classList.add("active");
          }
        }
      });
    }, 2000);
  });
};
