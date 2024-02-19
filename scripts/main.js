"use strict"

//  https://eatflix.niclasmichel.com/#mealsFav


// Initialisiere Elemente
const basketButton = document.querySelector(".small__basket-button");
const infoButton = document.querySelector(".info__button");
const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".popup");
const closeButtonPopup = document.getElementById("popup__close");


// Funktionen für die Funktionlaität

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






// Generate HTML Structure

function foodPickup() {
  return `<span> Achtersteven 4 </span>`
}

function foodDelivery() {
  return `<i class='bx bx-shopping-bag' ></i><span> Min. 20.00 € </span><i class='bx bxs-circle circle' ></i> <i class='bx bx-car'></i><span> 2.00 €</span>`
}