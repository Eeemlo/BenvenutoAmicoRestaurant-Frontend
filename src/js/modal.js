
//Eventlyssnare för att öppna/stänga modal
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.querySelector("#myModal");
    const btn = document.querySelector("#myBtn");
    const closeBtn = document.querySelector(".close");

    modal.style.display = "none";

    if (modal && btn && closeBtn) {
        btn.addEventListener("click", () => modal.style.display = "block");
        closeBtn.addEventListener("click", () => modal.style.display = "none");
        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        })
    }});
