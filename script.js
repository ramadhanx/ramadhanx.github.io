const cards = document.querySelectorAll(".card");

cards.forEach(card => {

card.addEventListener("mousemove", () => {

card.style.boxShadow =
"0 0 20px rgba(56,189,248,.3)";

});

card.addEventListener("mouseleave", () => {

card.style.boxShadow = "none";

});

});
