/*URL till API*/
let url = "https://projekt-auth.onrender.com/api";

/* **** KOD FÖR LUNCHMENY *****/
/*Hämta menycontainrar*/
const mondayLunch = document.querySelector("#mondayLunch");
const tuesdayLunch = document.querySelector("#tuesdayLunch");
const wednesdayLunch = document.querySelector("#wednesdayLunch");
const thursdayLunch = document.querySelector("#thursdayLunch");
const fridayLunch = document.querySelector("#fridayLunch");
const weekContainer = document.querySelector("#currentWeek"); //Container för att skriva ut aktuell vecka

/*Hämta aktuellt veckonummer*/
/*Kod från stackOverflow https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php*/
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

const currentWeek = getWeekNumber(new Date());

/*Skruv ut aktuell vecka till DOM*/
weekContainer.innerHTML = "Vecka " + currentWeek[1];

/*Hämta lunchrätter från API*/
async function getLunchMenu() {
    try {
        const response = await fetch(url + "/lunches");
        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }
        const lunchData = await response.json();

        console.log(lunchData);
        iterateLunches(lunchData);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

/*Iterera och skriv ut lunchrätter till DOM*/
function iterateLunches(lunchData) {
    lunchData.forEach((lunch) => {
      if(lunch.week === currentWeek[1]) {
        let lunchDay;

        switch (lunch.weekday) {
            case "Måndag":
                lunchDay = mondayLunch;
                break;
            case "Tisdag":
                lunchDay = tuesdayLunch;
                break;
            case "Onsdag":
                lunchDay = wednesdayLunch;
                break;
            case "Torsdag":
                lunchDay = thursdayLunch;
                break;
            case "Fredag":
                lunchDay = fridayLunch;
                break;
            default:
                console.warn(`Unknown weekday: ${lunch.weekday}`);
                return; // Skip unknown categories
        }

        if (lunchDay) {
            lunchDay.innerHTML += `
        <p>${lunch.description1} <br> ${lunch.description2}</p> 
      `;
        }
      }
    });
}

getLunchMenu();