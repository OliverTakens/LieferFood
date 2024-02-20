"use strict"

//  https://eatflix.niclasmichel.com/#mealsFav


// Initialisiere Elemente
const basketButton = document.querySelector(".small__basket-button");
const infoButton = document.querySelector(".info__button");
const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".popup");
const closeButtonPopup = document.getElementById("popup__close");
const basketPrice = document.querySelector(".price");
const basket = document.querySelector(".basket")




// Functions

/**
 * Open the Popup of the Info Button and the Overlay to grayscale the Background
 */
function openPopup() {
  popup.style.display = "block";
  overlay.style.display = "block";
};

/**
 * Close the Popup Modul
 */
function closePopup() {
    popup.style.display = "none";
    overlay.style.display = "none";
};

/**
 * Activate the Toggle Function in the Top Basket
 */
function basketDeliveryToggle() {
  const basketToggles = document.querySelectorAll(".basket__toggle div");

  basketToggles.forEach((toggle) => {
    toggle.addEventListener("click", function() {
      // Zuerst entfernen wir die "active"-Klasse von allen Elementen
      basketToggles.forEach(t => t.classList.remove("active"));
      
      // Dann fügen wir die "active"-Klasse nur dem geklickten Element hinzu
      this.classList.add("active");
      if(this.classList.contains("collection")){
        document.querySelector(".delivery__info").innerHTML = foodPickup();
      } else {
        document.querySelector(".delivery__info").innerHTML = foodDelivery();
      };
    });
  });
}
basketDeliveryToggle();

// Basket Functionality


let products = [];
let prices = [];
let amounts = [];

/**
 * Add a Product to the Basket Arrays
 * @param {String} product 
 * @param {String} price 
 */
function addToBasket(product, price) {
  let index = products.indexOf(product);
  const basketInfo = document.querySelector(".basket__info");
  basketInfo.style.display = "none";

  if(index == -1) {
    products.push(product);
    prices.push(price);
    amounts.push(1);
    index = products.length - 1;
  } else {
    amounts[index]++;
  }

  generateProductBasket(product, price, amounts[index])
  calculateBasket()
}


/**
 * Generate Basket HTML and Update Price/Amount
 * @param {String} product 
 * @param {String} price 
 * @param {Number} amount 
 */
function generateProductBasket(product, price, amount) {
  const basketItems = document.querySelector(".basket__items");
  basketPrice.style.display = "block";
  let productIndex = products.indexOf(product);
  let productElement = document.querySelector(`[data-product-index="${productIndex}"]`);

  if (amount === 1 || !productElement) {
    const productHTML = generateProductBasketHTML(product, price, amount);
    basketItems.innerHTML += `<div class="basket__card" data-product-index="${productIndex}">${productHTML}</div>`;
  } else {
    let newPrice = parseFloat(prices[productIndex]) * amount;
    productElement.querySelector(".basket__card-amount").innerText = amount;
    productElement.querySelector(".basket__card-price").innerText = `${newPrice.toFixed(2)} €`;
  };

  addEventListenersToButtons();
}

/**
 * Adding Event-Listener to plus and minus buttons in Basket Elements
 */
function addEventListenersToButtons() {
  document.querySelectorAll(".add__remove i").forEach((button) => {
    button.addEventListener("click", handleAmountButtonClick);
  });
}

/**
 * Handle Clicks on plus and minus Buttons
 * @param {Event} event 
 */
function handleAmountButtonClick(event) {
  const button = event.target;
  const basketCard = button.closest('.basket__card');
  const productIndex = parseInt(basketCard.getAttribute('data-product-index'), 10);

  adjustProductAmount(button.id, productIndex);
  updateAmountDisplay(basketCard, productIndex);
  updatePriceDisplay(basketCard, productIndex)

  if (amounts[productIndex] === 0) {
    removeProduct(basketCard, productIndex);
  }
}

// Passt die Produktmenge an
function adjustProductAmount(buttonId, productIndex) {
  if (buttonId === "plus") {
    amounts[productIndex]++;
    calculateBasket()
  } else {
    amounts[productIndex]--;
    calculateBasket()
  }
}

// Aktualisiert die Anzeige der Produktmenge
function updateAmountDisplay(basketCard, productIndex) {
  const amountDisplay = basketCard.querySelector('.basket__card-amount');
  amountDisplay.innerText = amounts[productIndex];
}

function updatePriceDisplay(basketCard, productIndex) {
  let newPrice = prices[productIndex] * amounts[productIndex];
  const priceDisplay = basketCard.querySelector('.basket__card-price');
  priceDisplay.innerText =  newPrice.toFixed(2) + " €";
}

// Entfernt ein Produkt, wenn seine Menge 0 erreicht
function removeProduct(basketCard, productIndex) {
  basketCard.remove(); // Entfernt das Element aus dem DOM
  products.splice(productIndex, 1);
  amounts.splice(productIndex, 1);
  prices.splice(productIndex, 1);
  updateProductIndices(); // Aktualisiert die Indizes aller Produkte
}

function updateProductIndices() {
  // Durchlaufe alle .basket__card Elemente und aktualisiere ihre data-product-index Attribute
  document.querySelectorAll('.basket__card').forEach((card, index) => {
    card.setAttribute('data-product-index', index);
  });
}

function calculateBasket() {
  let subTotalAmount = 0;
  let totalAmount = 0;
  for(let i = 0; i < products.length; i++){
    subTotalAmount += amounts[i] * prices[i];
  }
  totalAmount = subTotalAmount + 2;

  updatePriceSection(subTotalAmount, totalAmount)
}

function updatePriceSection(subTotalAmount, totalAmount) {
  const subtotal = document.getElementById("subtotal");
  const total = document.getElementById("total");
  const minOrderValue = document.getElementById("min__order__value");
  const smartphoneBasketButtonAmount = document.querySelector(".small__basket-button span");

  subtotal.innerText = subTotalAmount.toFixed(2) + " €";
  total.innerText = totalAmount.toFixed(2) + " €";
  smartphoneBasketButtonAmount.innerText = totalAmount.toFixed(2);
  let difference = 15 - subTotalAmount;
  minOrderValue.innerText = difference.toFixed(2) + " €";

  if(subTotalAmount >= 15){
    document.querySelector(".min__price").style.display = "none";
    document.querySelector(".order__button").classList.add("full__basket")
  } else {
    document.querySelector(".min__price").style.display = "block";
    document.querySelector(".order__button").classList.remove("full__basket")
  }
}





// Event-Listener

/**
 * Opens the Popup Modul of the Info Button
 */
infoButton.addEventListener("click", () => {
  openPopup();
});

/**
 * Set Event-Listener to close Popup on overlay clicking
 */
overlay.addEventListener("click", () => closePopup());

/**
 * Event for Closing Button in Popup
 */
closeButtonPopup.addEventListener("click", () => closePopup());


document.querySelector(".order__button").addEventListener("click", (event) => {
  event.preventDefault();
  let subtotalElement = document.getElementById("subtotal");
  let subtotalText = subtotalElement.innerText;

  // Entfernen Sie alles, was nicht Teil der Zahl ist, z.B. "Summe €", und konvertieren Sie den verbleibenden String in eine Zahl
  let subtotalNumber = parseFloat(subtotalText.replace(/[^\d,.]/g, '').replace(',', '.'));
  if(subtotalNumber >= 15){
    alert("Dies ist ein Test Programm, es wurde keine Bestellung aufgegeben!");
  }
})

document.querySelector(".small__basket-button").addEventListener("click", () => {
  if(basket.style.display === "block"){
    basket.style.display = "none"
  } else {
    basket.style.display = "block"
  }
})




// Generate HTML Structure

function foodPickup() {
  return `<span> Achtersteven 4 </span>`
}

function foodDelivery() {
  return `<i class='bx bx-shopping-bag' ></i><span> Min. 20.00 € </span><i class='bx bxs-circle circle' ></i> <i class='bx bx-car'></i><span> 2.00 €</span>`
}

function generateProductBasketHTML(product, price, amount) {
  // Rückgabe des Inhalts ohne den äußeren .basket__card Container
  return `
  <div class="basket__card-flex">
      <div class="basket__item">
          <span class="basket__card-amount">${amount}</span>
          <span class="basket__card-meal">${product}</span>
      </div>
      <div class="basket__price">
          <span class="basket__card-price">${price} €</span>
      </div>
  </div>
  <div class="add__remove">
      <a href="" class="add__remove-info">Anmerkung hinzufügen</a>
      <div>
          <i id="plus" class='bx bx-plus add__remove-icon'></i>
          <i id="minus" class='bx bx-minus add__remove-icon' ></i>
      </div>
  </div>`;
}


function emptyBasket() {
  return `<div class="basket__info">
  <i class='bx bx-shopping-bag basket__bag' ></i>
  <h2 class="basket__text">Fülle deinen Warenkorb</h2>
  <p class="basket__order-text">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</p>
</div>`
}