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

