let count = 0;
document.querySelector('.card-button').addEventListener("click", () => {
    if (count % 2 === 0){
        document.querySelector('.card-button').style.setProperty("--flip", "rotate(90deg)");
    }
    else {
        document.querySelector('.card-button').style.setProperty("--flip", "");
    }
    count++;
})
