document.addEventListener("DOMContentLoaded", ()=>{
    let info = document.getElementById("info");
    let wrapper = document.querySelector(".wrapper-carrossel")
    let carrossel = document.querySelector(".carrossel");
    let cards = document.querySelectorAll("#card-project");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    
    // Função para verificar e ajustar o estilo do carrossel
    function checkWidth() {
        let windowWidth = window.innerWidth;
        if (windowWidth < 900) {
            wrapper.style.display = "flex";
            carrossel.style.display = "flex";
            for (let i = 0; i < cards.length; i++) {
                carrossel.appendChild(cards[i]);
            }
        } else {
            wrapper.style.display = "none";
            carrossel.style.display = "none";
            for (let i = 0; i < cards.length; i++) {
                info.appendChild(cards[i]);
            }
        }
    }
    checkWidth();

    // Funções para movimentação do carrossel
    function prevCard() {
      
    }

    function nextCard() {
      
    }

    // Adicionar ouvinte de evento para redimensionamento da janela
    window.addEventListener("resize", checkWidth);
    // Adicionar ouvinte de evento para rolar o carrossel
    next.addEventListener("click", nextCard);
    prev.addEventListener("click", prevCard);
})