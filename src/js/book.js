let url = "https://projekt-auth.onrender.com/api/bookings";


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");

    // Eventlyssnare för form submit
    form.addEventListener("submit", (event) => {
        event.preventDefault();
     
            handleSubmit();
        
    });
});

// Funktion för att hantera form submit
async function handleSubmit() {
    const fullNameInput = document.querySelector("#fullname");
    const emailInput = document.querySelector("#email");
    const quantityInput = document.querySelector("#quantity");
    const dateTimeInput = document.querySelector("#time");

    const tableBooking = {
        fullname: fullNameInput.value,
        email: emailInput.value,
        quantity: quantityInput.value,
        date: dateTimeInput.value
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tableBooking),
        });
        const data = await response.json();
        console.log("Created new booking:", data);
    } catch (error) {
        console.error("Error creating booking:", error);
    }

    alert(`Du har bokat ett bord för ${quantityInput.value} personer`)

    // Återställ formulärfält
    const inputs = [fullNameInput, emailInput, quantityInput, dateTimeInput];
    inputs.forEach(input => input.value = "");
}