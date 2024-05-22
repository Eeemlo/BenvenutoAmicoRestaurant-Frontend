/*URL till API*/
let url = "https://projekt-auth.onrender.com/api";

/* **** KOD FÖR TAKEAWAYMENY *****/
/*Hämta menycontainrar*/
const takeawayDishes = document.querySelector("#takeawayDishes");
const takeawaySnacks = document.querySelector("#takeawaySnacks");

/*Hämta middagsrätter från API*/
async function getTakeawayMenu() {
    try {
        const response = await fetch(url + "/takeaways");
        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }
        const takeawayData = await response.json();

        console.log(takeawayData);
        iterateTakeaways(takeawayData);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

/*Iterera och skriv ut takeawayrätter till DOM*/
function iterateTakeaways(takeawayData) {

    takeawayData.forEach((takeaway) => {
        let takeawayCategory;

        switch (takeaway.category) {
            case "Middag":
                takeawayCategory = takeawayDishes;
                break;
            case "Smått":
                takeawayCategory = takeawaySnacks;
                break;
            default:
                console.warn(`Unknown category: ${takeaway.category}`);
                return; // Skip unknown categories
        }

        if (takeawayCategory) {
            let takeawayDescription = takeaway.description
                ? `<p>${takeaway.description}</p>`
                : "";
            takeawayCategory.innerHTML += `
        <div><p class="courseName">${takeaway.name} ${takeawayDescription} ${takeaway.price}:-</p></div>
       
      `;
        }
    });
}

getTakeawayMenu();