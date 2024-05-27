let url = "https://projekt-auth.onrender.com/api/lunches";
let isUpdating = false;
let currentLunchId = null;

// Hämta formulärfältens element
const weekInput = document.querySelector("#week");
const weekdayInput = document.querySelector("#weekday");
const description1 = document.querySelector("#description1");
const description2 = document.querySelector("#description2");
const submitBtn = document.querySelector("#submitBtn");
const modal = document.querySelector("#myModal");

const weekError = document.querySelector("#weekError");
const weekdayError = document.querySelector("#weekdayError");
const description1Error = document.querySelector("#description1Error");
const description2Error = document.querySelector("#description2Error");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");

    function validateField(field, errorElement, errorMessage) {
        if (field.value.trim() === "") {
            errorElement.textContent = errorMessage;
            errorElement.style.display = "block";
            return false;
        } else {
            errorElement.textContent = "";
            errorElement.style.display = "none";
            return true;
        }
    }

    function validateForm() {
        const isWeekValid = validateField(weekInput, weekError, "Vecka är obligatorisk.");
        const isWeekdayValid = validateField(weekdayInput, weekdayError, "Veckodag är obligatorisk.");
        const isDescription1Valid = validateField(description1, description1Error, "Beskrivning 1 är obligatorisk.");
        const isDescription2Valid = validateField(description2, description2Error, "Beskrivning 2 är obligatorisk.");

        return isWeekValid && isWeekdayValid && isDescription1Valid && isDescription2Valid;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const isFormValid = validateForm();
        if (!isFormValid) {
            submitBtn.disabled = true;
            return;
        }

        submitBtn.disabled = false;

        if (isUpdating) {
            handleUpdate(currentLunchId);
        } else {
            handleSubmit();
        }
    });

    form.addEventListener("input", () => {
        submitBtn.disabled = !validateForm();
    });

    getData(); // Hämta data när sidan laddats
});

// Funktion för att hämta data från API
async function getData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Data fetched from API:", data);
        iterateData(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Funktion för att skriva ut data till DOM
function iterateData(data) {
    console.log("Iterating over data:", data);
    const lunchListContainer = document.querySelector(".lunchListContainer");
    lunchListContainer.innerHTML = ''; // Töm containern för att undvika dubletter

    const groupedData = groupByWeek(data);

    Object.keys(groupedData).forEach((week) => {
        const weekContainer = document.createElement("div");
        weekContainer.classList.add("weekContainer");
        weekContainer.innerHTML = `<h3>Vecka ${week}</h3>`;
        weekContainer.setAttribute("data-week", week);

        groupedData[week].forEach((lunch) => {
            const lunchElement = createLunchElement(lunch);
            weekContainer.appendChild(lunchElement);
        });

        lunchListContainer.appendChild(weekContainer);
    });
}

// Funktion för att skapa HTML-element för ett menyobjekt
function createLunchElement(lunch) {
    const lunchElement = document.createElement("div");
    lunchElement.classList.add("lunchElement");
    lunchElement.innerHTML = `
        <div class="lunchDay">
            <h4>${lunch.weekday}</h4>
            <p>${lunch.description1}</p>
            <p>${lunch.description2}</p>
            <button class="updateBtn" data-id="${lunch._id}">Uppdatera</button>
            <button class="deleteBtn" data-id="${lunch._id}">Radera</button>
        </div>
    `;
    const updateBtn = lunchElement.querySelector(".updateBtn");
    const deleteBtn = lunchElement.querySelector(".deleteBtn");

    updateBtn.addEventListener("click", () => openUpdateModal(lunch));
    deleteBtn.addEventListener("click", () => deleteLunch(lunch._id, lunchElement));
    return lunchElement;
}

// Funktion för att gruppera lunch baserat på veckonummer
function groupByWeek(data) {
    const groupedData = {};

    data.forEach((lunch) => {
        if (!groupedData[lunch.week]) {
            groupedData[lunch.week] = [];
        }
        groupedData[lunch.week].push(lunch);
    });
    return groupedData;
}

// Funktion för att radera lunch från API
async function deleteLunch(id, lunchElement) {
    const isConfirmed = confirm(`Är du säker på att du vill radera lunch?`);
    if (!isConfirmed) {
        return; // Avbryt raderingen om användaren inte bekräftar
    }

    try {
        const response = await fetch(url + "/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Unable to delete lunch");
            return;
        }
        lunchElement.parentNode.removeChild(lunchElement);
        console.log("Deleted lunch element:", lunchElement);
    } catch (error) {
        console.error("Error deleting lunch:", error);
    }
}

// Funktion för att öppna modalen med befintliga värden
function openUpdateModal(lunch) {
    weekInput.value = lunch.week;
    weekdayInput.value = lunch.weekday;
    description1.value = lunch.description1;
    description2.value = lunch.description2;

    submitBtn.textContent = "Uppdatera";

    isUpdating = true;
    currentLunchId = lunch._id;

    modal.style.display = "block";
    console.log("Opened update modal for lunch:", lunch);
}

// Funktion för att hantera uppdatering av lunch
async function handleUpdate(id) {
    const updatedLunch = {
        week: weekInput.value,
        weekday: weekdayInput.value,
        description1: description1.value,
        description2: description2.value
    };

    try {
        const response = await fetch(url + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedLunch),
        });
        const data = await response.json();
        console.log("Updated lunch:", data);
        getData(); // Hämta och rendera om all data för att visa uppdateringen
    } catch (error) {
        console.error("Error updating lunch:", error);
    }

    submitBtn.textContent = "Lägg till";
    isUpdating = false;
    currentLunchId = null;

    // Återställ formulärfält
    const inputs = [weekInput, weekdayInput, description1, description2];
    inputs.forEach(input => input.value = "");
    modal.style.display = "none";
}

// Funktion för att hantera form submit
async function handleSubmit() {
    const week = weekInput.value;
    const weekday = weekdayInput.value;
    const descriptionOne = description1.value;
    const descriptionTwo = description2.value;

    const lunch = {
        week: week,
        weekday: weekday,
        description1: descriptionOne,
        description2: descriptionTwo
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lunch),
        });
        const data = await response.json();
        console.log("Created new lunch:", data);
        addLunchToDOM(data); // Lägg till det nya objektet i DOM
    } catch (error) {
        console.error("Error creating lunch:", error);
    }

    // Återställ formulärfält
    const inputs = [weekInput, weekdayInput, description1, description2];
    inputs.forEach(input => input.value = "");
    modal.style.display = "none";
}

// Funktion för att lägga till nytt lunchobjekt i DOM
function addLunchToDOM(lunch) {
    const lunchListContainer = document.querySelector(".lunchListContainer");
    let weekContainer = lunchListContainer.querySelector(`.weekContainer[data-week="${lunch.week}"]`);
    const lunchElement = createLunchElement(lunch);
    if (weekContainer) {
        weekContainer.appendChild(lunchElement);
    } else {
        weekContainer = document.createElement("div");
        weekContainer.classList.add("weekContainer");
        weekContainer.setAttribute("data-week", lunch.week);
        weekContainer.innerHTML = `<h3>Vecka ${lunch.week}</h3>`;
        weekContainer.appendChild(lunchElement);
        lunchListContainer.appendChild(weekContainer);
    }
}