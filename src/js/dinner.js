/*URL till API*/
let url = "https://projekt-auth.onrender.com/api";

/* **** KOD FÖR MIDDAGSMENY *****/
/*Hämta menycontainrar*/
const dinnerSmallCourse = document.querySelector("#smallCourse");
const dinnerPreCourse = document.querySelector("#preCourse");
const dinnerMainCourse = document.querySelector("#mainCourse");
const dinnerDessert = document.querySelector("#dessert");

/*Hämta middagsrätter från API*/
async function getDinnerMenu() {
    try {
        const response = await fetch(url + "/dinners");
        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }
        const dinnerData = await response.json();

        console.log(dinnerData);
        iterateDinners(dinnerData);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

/*Iterera och skriv ut middagsrätter till DOM*/
function iterateDinners(dinnerData) {

    dinnerData.forEach((dinner) => {
        let dinnerCategory;

        switch (dinner.category) {
            case "Förrätt":
                dinnerCategory = dinnerPreCourse;
                break;
            case "Huvudrätt":
                dinnerCategory = dinnerMainCourse;
                break;
            case "Efterrätt":
                dinnerCategory = dinnerDessert;
                break;
            case "Smått":
                dinnerCategory = dinnerSmallCourse;
                break;
            default:
                console.warn(`Unknown category: ${dinner.category}`);
                return; // Skip unknown categories
        }

        if (dinnerCategory) {
            let dinnerDescription = dinner.description
                ? `<p>${dinner.description}</p>`
                : "";
            dinnerCategory.innerHTML += `
        <div><p class="courseName">${dinner.name} ${dinner.price}:- <br> ${dinnerDescription}</p></div>
       
      `;
        }
    });
}

getDinnerMenu();
