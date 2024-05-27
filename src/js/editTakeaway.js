let url = "https://projekt-auth.onrender.com/api/takeaways";
let isUpdating = false;
let currentTakeawayId = null;

const takeawayNameInput = document.querySelector("#name");
const takeawayCategory = document.querySelector("#category");
const takeawayPrice = document.querySelector("#price");
const descriptionInput = document.querySelector("#description");
const modal = document.querySelector("#myModal");
const submitBtn = document.querySelector("#submitBtn");
const nameError = document.querySelector("#nameError");
const categoryError = document.querySelector("#categoryError");
const priceError = document.querySelector("#priceError");

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
        const isNameValid = validateField(
            takeawayNameInput,
            nameError,
            "Namn på rätt är obligatoriskt."
        );
        const isCategoryValid = validateField(
            takeawayCategory,
            categoryError,
            "Kategori är obligatoriskt."
        );
        const isPriceValid = validateField(
            takeawayPrice,
            priceError,
            "Pris är obligatoriskt."
        );
      
        submitBtn.disabled = !(
            isNameValid &&
            isCategoryValid &&
            isPriceValid
        );
    }

    form.addEventListener("input", validateForm);

    // Eventlyssnare för form submit
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isUpdating) {
            handleUpdate(currentTakeawayId);
        } else {
            handleSubmit();
        }
    });

    getData(); // Hämta data när sidan laddats

    validateForm(); // Kör initial validering
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
    const takeawaySnacks = document.querySelector("#editTakeawaySnacks");
    const takeawayMainCourse = document.querySelector("#editTakeawayDinner");


    data.forEach((takeaway) => {
        let takeawayCategory; 

        switch (takeaway.category) {
            case "Smått":
                takeawayCategory = takeawaySnacks;
                break;
            case "Middag":
                takeawayCategory = takeawayMainCourse;
                break;
            default:
                console.warn(`Unknown category: ${takeaway.category}`);
                return; // Skip unknown categories
        }

        if (takeawayCategory) {
            const takeawayElement = createTakeawayElement(takeaway);
            takeawayCategory.appendChild(takeawayElement);
        }
    });
}

// Funktion för att skapa HTML-element för ett menyobjekt
function createTakeawayElement(takeaway) {
    const takeawayElement = document.createElement("div");
    takeawayElement.classList.add("takeawayElement");

    let descriptionHTML = '';
    if (takeaway.description !== null) {
        descriptionHTML = `<p>${takeaway.description}</p>`;
    }

    takeawayElement.innerHTML = `
        <div>
            <h4>${takeaway.name} ${takeaway.price}:-</h4>
            ${descriptionHTML}
            <button class="updateBtn" data-id="${takeaway._id}">Uppdatera</button>
            <button class="deleteBtn" data-id="${takeaway._id}">Radera</button>
        </div>
    `;

    const updateBtn = takeawayElement.querySelector(".updateBtn");
    const deleteBtn = takeawayElement.querySelector(".deleteBtn");

    updateBtn.addEventListener("click", () => openUpdateModal(takeaway));
    deleteBtn.addEventListener("click", () => deleteTakeaway(takeaway._id, takeaway.name, takeawayElement));
    return takeawayElement;
}

// Funktion för att radera middag från API
async function deleteTakeaway(id, name, takeawayElement) {
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
            console.error("Unable to delete takeaway");
            return;
        }
        takeawayElement.parentNode.removeChild(takeawayElement);
        console.log("Deleted takeaway element:", takeawayElement);
    } catch (error) {
        console.error("Error deleting takeaway:", error);
    }
}

// Funktion för att öppna modalen med befintliga värden
function openUpdateModal(takeaway) {

    takeawayNameInput.value = takeaway.name;
    takeawayCategory.value = takeaway.category;
    takeawayPrice.value = takeaway.price;
    descriptionInput.value = takeaway.description;

    submitBtn.textContent = "Uppdatera";

    isUpdating = true;
    currentTakeawayId = takeaway._id;

    modal.style.display = "block";
    console.log("Opened update modal for takeaway:", takeaway);
}

// Funktion för att hantera uppdatering av middag
async function handleUpdate(id) {
    const takeawayNameInput = document.querySelector("#name");
    const takeawayCategory = document.querySelector("#category");
    const takeawayPrice = document.querySelector("#price");
    const descriptionInput = document.querySelector("#description");
    const submitBtn = document.querySelector(".button");
    const modal = document.querySelector("#myModal");

    const updatedTakeaway = {
        name: takeawayNameInput.value,
        category: takeawayCategory.value,
        price: takeawayPrice.value,
        description: descriptionInput.value,
    };

    try {
        const response = await fetch(url + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTakeaway),
        });
        const data = await response.json();
        console.log("Updated takeaway:", data);
        getData();
    } catch (error) {
        console.error("Error updating takeaway:", error);
    }

    submitBtn.textContent = "Lägg till";
    isUpdating = false;
    currentTakeawayId = null;

    // Återställ formulärfält
    const inputs = [takeawayNameInput, takeawayCategory, takeawayPrice, descriptionInput];
    inputs.forEach(input => input.value = "");
    modal.style.display = "none";
}

// Funktion för att hantera form submit
async function handleSubmit() {
    const takeawayNameInput = document.querySelector("#name");
    const takeawayCategory = document.querySelector("#category");
    const takeawayPrice = document.querySelector("#price");
    const descriptionInput = document.querySelector("#description");
    const submitBtn = document.querySelector(".button");
    const modal = document.querySelector("#myModal");

    const takeawayItem = {
        name: takeawayNameInput.value,
        category: takeawayCategory.value,
        price: takeawayPrice.value,
        description: descriptionInput.value,
    };


    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(takeawayItem),
        });
        const data = await response.json();
        console.log("Created new takeaway:", data);
        iterateData([data]);
    } catch (error) {
        console.error("Error creating takeaway:", error);
    }

    // Återställ formulärfält
    const inputs = [takeawayNameInput, takeawayCategory, takeawayPrice, descriptionInput];
    inputs.forEach(input => input.value = "");
    modal.style.display = "none";

    getData();
}