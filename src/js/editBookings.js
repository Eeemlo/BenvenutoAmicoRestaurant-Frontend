let url = "https://projekt-auth.onrender.com/api/bookings";

document.addEventListener("DOMContentLoaded", () => {
    getData(); // Hämta data när sidan laddats
});

// Funktion för att hämta data från API
async function getData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Data fetched from API:", data);

        // Filtrera bort bokningar som är i det förflutna
        const now = new Date();
        const futureBookings = data.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= now;
        });

        iterateData(futureBookings);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Funktion för att skriva ut data till DOM
function iterateData(data) {
    console.log("Iterating over data:", data);
    const tableBookingsContainer = document.querySelector(".tableBookingsContainer");
    tableBookingsContainer.innerHTML = ''; // Töm containern för att undvika dubletter

    data.forEach((booking) => {
        const bookingElement = createBookingElement(booking);
        tableBookingsContainer.appendChild(bookingElement); // Lägg till varje bookingElement i containern
    });
}

// Funktion för att skapa HTML-element för ett menyobjekt
function createBookingElement(booking) {
    const bookingElement = document.createElement("div");
    bookingElement.classList.add("bookingElement");

    // Formatera datumet
    const formattedDate = formatDate(new Date(booking.date));

    bookingElement.innerHTML = `
        <div class="lunchDay">
            <h4>${formattedDate}</h4>
            <p>Namn: ${booking.fullname}</p>
            <p>E-post: ${booking.email}</p>
            <p>Antal: ${booking.quantity} personer</p>
            <button class="deleteBtn" data-id="${booking._id}">Radera</button>
        </div>
    `;

    const deleteBtn = bookingElement.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => deleteBooking(booking._id, bookingElement));

    return bookingElement; // Returnerar det skapade elementet
}

// Funktion för att formatera ett datum
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Månader är 0-indexerade
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Funktion för att radera lunch från API
async function deleteBooking(id, bookingElement) {
    const isConfirmed = confirm(`Är du säker på att du vill radera bokning?`);
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
            console.error("Unable to delete booking");
            return;
        }
        bookingElement.parentNode.removeChild(bookingElement);
        console.log("Deleted booking:", bookingElement);
    } catch (error) {
        console.error("Error deleting booking:", error);
    }
}