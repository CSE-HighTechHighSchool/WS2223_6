

document.querySelectorAll('.card-button').forEach((button) => {
    let count = 0;

    button.addEventListener("click", () => {
        if (count % 2 === 0) {
            button.style.transform = "rotate(180deg)";
        }
        else {
            button.style.transform = "rotate(0deg)";
        }
        count++;
    })
});//Rotates the card buttons on click


AOS.init({
  offset: 400, 
  delay: 0, 
  duration: 1000 

});//Initializes the onScroll timeline animations

  

