import "https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js";

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
});
AOS.init({
  offset: 400, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 1000 // values from 0 to 3000, with step 50ms
});

  

