let url = "http://localhost:3000/api/dinners";
let isUpdating = false;
let currentDinnerId = null;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
    const submitBtn = document.querySelector(".button");

    // Eventlyssnare för form submit
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isUpdating) {
            handleUpdate(currentDinnerId);
        } else {
            handleSubmit();
        }
    });

    getData(); // Säkerställ att data hämtas när sidan laddas
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

    /* Hämta menycontainrar */
    const dinnerSmallCourse = document.querySelector("#editSmallCourse");
    const dinnerPreCourse = document.querySelector("#editPreCourse");
    const dinnerMainCourse = document.querySelector("#editMainCourse");
    const dinnerDessert = document.querySelector("#editDessert");


    data.forEach((dinner) => {
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
            const dinnerElement = createDinnerElement(dinner);
            dinnerCategory.appendChild(dinnerElement);
        }
    });
}

// Funktion för att skapa HTML-element för ett menyobjekt
function createDinnerElement(dinner) {
    const dinnerElement = document.createElement("div");
    dinnerElement.classList.add("dinnerElement");

    let descriptionHTML = '';
    if (dinner.description !== null) {
        descriptionHTML = `<p>${dinner.description}</p>`;
    }

    dinnerElement.innerHTML = `
        <div>
            <h4>${dinner.name} ${dinner.price}:-</h4>
            <p>${descriptionHTML}</p>
            <button class="updateBtn" data-id="${dinner._id}">Uppdatera</button>
            <button class="deleteBtn" data-id="${dinner._id}">Radera</button>
        </div>
    `;
    const updateBtn = dinnerElement.querySelector(".updateBtn");
    const deleteBtn = dinnerElement.querySelector(".deleteBtn");

    updateBtn.addEventListener("click", () => openUpdateModal(dinner));
    deleteBtn.addEventListener("click", () => deleteDinner(dinner._id, dinner.name, dinnerElement));
    return dinnerElement;
}

// Funktion för att radera middag från API
async function deleteDinner(id, name, dinnerElement) {
    const isConfirmed = confirm(`Är du säker på att du vill radera ${name}?`);
    if (!isConfirmed) {
        return; // Avbryt raderingen om användaren inte bekräftar
    };

    try {
        const response = await fetch(url + "/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Unable to delete dinner");
            return;
        }
        dinnerElement.parentNode.removeChild(dinnerElement);
        console.log("Deleted dinner element:", dinnerElement);
    } catch (error) {
        console.error("Error deleting dinner:", error);
    }
}

// Funktion för att öppna modalen med befintliga värden
function openUpdateModal(dinner) {
    const dinnerNameInput = document.querySelector("#name");
    const dinnerCategory = document.querySelector("#category");
    const dinnerPrice = document.querySelector("#price");
    const veganOption = document.querySelector("#vegan");
    const vegetarianOption = document.querySelector("#vegetarian");
    const descriptionInput = document.querySelector("#description");
    const submitBtn = document.querySelector(".button");
    const modal = document.querySelector("#myModal");

    dinnerNameInput.value = dinner.name;
    dinnerCategory.value = dinner.category;
    dinnerPrice.value = dinner.price;
    veganOption.checked = dinner.vegan;
    vegetarianOption.checked = dinner.vegetarian;
    descriptionInput.value = dinner.description;

    submitBtn.textContent = "Uppdatera";

    isUpdating = true;
    currentDinnerId = dinner._id;

    modal.style.display = "block";
    console.log("Opened update modal for dinner:", dinner);
}

// Funktion för att hantera uppdatering av middag
async function handleUpdate(id) {
    const dinnerNameInput = document.querySelector("#name");
    const dinnerCategory = document.querySelector("#category");
    const dinnerPrice = document.querySelector("#price");
    const veganOption = document.querySelector("#vegan");
    const vegetarianOption = document.querySelector("#vegetarian");
    const descriptionInput = document.querySelector("#description");
    const submitBtn = document.querySelector(".button");
    const modal = document.querySelector("#myModal");

    const updatedDinner = {
        name: dinnerNameInput.value,
        category: dinnerCategory.value,
        price: dinnerPrice.value,
        description: descriptionInput.value,
        vegan: veganOption.checked,
        vegetarian: vegetarianOption.checked
    };

    try {
        const response = await fetch(url + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDinner),
        });
        const data = await response.json();
        console.log("Updated dinner:", data);
        getData();
    } catch (error) {
        console.error("Error updating dinner:", error);
    }

    submitBtn.textContent = "Lägg till";
    isUpdating = false;
    currentDinnerId = null;

    // Återställ formulärfält
    const inputs = [dinnerNameInput, dinnerCategory, dinnerPrice, descriptionInput];
    inputs.forEach(input => input.value = "");
    veganOption.checked = false;
    vegetarianOption.checked = false;
    modal.style.display = "none";
}

// Funktion för att hantera form submit
async function handleSubmit() {
    const dinnerNameInput = document.querySelector("#name");
    const dinnerCategory = document.querySelector("#category");
    const dinnerPrice = document.querySelector("#price");
    const veganOption = document.querySelector("#vegan");
    const vegetarianOption = document.querySelector("#vegetarian");
    const descriptionInput = document.querySelector("#description");
    const modal = document.querySelector("#myModal");

    const dinnerName = dinnerNameInput.value;
    const category = dinnerCategory.value;
    const price = dinnerPrice.value;
    const description = descriptionInput.value;

    const dinnerCourse = {
        name: dinnerName,
        category: category,
        price: price,
        description: description,
        vegan: veganOption.checked,
        vegetarian: vegetarianOption.checked
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dinnerCourse),
        });
        const data = await response.json();
        console.log("Created new dinner:", data);
        iterateData([data]);
    } catch (error) {
        console.error("Error creating dinner:", error);
    }

    // Återställ formulärfält
    const inputs = [dinnerNameInput, dinnerCategory, dinnerPrice, descriptionInput];
    inputs.forEach(input => input.value = "");
    veganOption.checked = false;
    vegetarianOption.checked = false;
    modal.style.display = "none";

    getData();
}