        // Hämta formulärets element
        const updateLunchBtn = document.querySelector("#box1");
        const updateDinnerBtn = document.querySelector("#box2");
        const updateTakeawayBtn = document.querySelector("#box3");
        const updateUserBtn = document.querySelector("#box4");

        updateLunchBtn.addEventListener("click", () => {
            window.location.href = "/admin-lunch.html"; //Omdirigera användaren till skyddad route
        });

        updateDinnerBtn.addEventListener("click", () => {
            window.location.href = "/admin-dinner.html"; //Omdirigera användaren till skyddad route
        });

        updateTakeawayBtn.addEventListener("click", () => {
            window.location.href = "/admin-takeaway.html"; //Omdirigera användaren till skyddad route
        });

        updateUserBtn.addEventListener("click", () => {
            window.location.href = "/admin-user.html"; //Omdirigera användaren till skyddad route
        });