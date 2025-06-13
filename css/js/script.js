// js/script.js

document.addEventListener("click", () => {
  const susto = document.createElement("img");
  susto.src = "../assets/imagens/susto1.png"; // coloque uma imagem assustadora
  susto.style.position = "fixed";
  susto.style.top = "50%";
  susto.style.left = "50%";
  susto.style.transform = "translate(-50%, -50%)";
  susto.style.zIndex = "1000";
  susto.style.maxWidth = "90%";

  document.body.appendChild(susto);

  // Toca som de susto
  const audio = new Audio("../assets/sons/grito.mp3"); // coloque um som assustador
  audio.play();

  // Remove a imagem após 3 segundos
  setTimeout(() => {
    susto.remove();
  }, 3000);
});
