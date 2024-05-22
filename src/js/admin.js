 /*URL till API*/
let url = "http://localhost:3000/api";
 

// Funktion för att göra fetch-anrop till den skyddade routen med token i header
async function fetchData() {
    try {
        const token = localStorage.getItem("token");

        //Hämta protected routen och skicka med bearer token
        const response = await fetch(url + "/admin", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        });

        // Felmeddelande
        if (!response.ok) {
            throw new Error("Kunde inte hämta data från den skyddade routen!");
        }

        const data = await response.json();
        console.log("Skyddad data:", data);
        window.location.href = "/admin-takeaway.html"; //Omdirigera användaren till skyddad route
    } catch (error) {
        console.error("Fel vid hämtning av skyddad data:", error.message);
    }
}

// Anropa funktionen för att hämta skyddad data när sidan laddas
fetchData();
 