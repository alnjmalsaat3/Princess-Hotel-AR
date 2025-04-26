// DOM Elements
const bookingForm = document.querySelector('.booking-form');
const roomTypeSelect = document.getElementById('room-type');
const roomCards = document.querySelectorAll('.room-card');
const modal = document.getElementById('booking-modal');
const closeModal = document.querySelector('.close-modal');
const bookingSummary = document.getElementById('booking-summary');
const confirmBtn = document.querySelector('.confirm-btn');

// Room data
const roomData = {
    standard: {
        name: 'Standard Room',
        price: 99,
        maxGuests: 2
    },
    deluxe: {
        name: 'Deluxe Room',
        price: 149,
        maxGuests: 3
    },
    suite: {
        name: 'Suite',
        price: 249,
        maxGuests: 4
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDateInputs();
    setupRoomCardListeners();
    setupFormSubmission();
    setupModalHandling();
});

// Initialize date inputs with minimum dates
function initializeDateInputs() {
    const checkIn = document.getElementById('check-in');
    const checkOut = document.getElementById('check-out');
    const today = new Date().toISOString().split('T')[0];
    
    checkIn.min = today;
    checkOut.min = today;

    checkIn.addEventListener('change', () => {
        checkOut.min = checkIn.value;
        if (checkOut.value && checkOut.value < checkIn.value) {
            checkOut.value = checkIn.value;
        }
    });
}

// Setup room card selection
function setupRoomCardListeners() {
    roomCards.forEach(card => {
        card.addEventListener('click', () => {
            const roomType = card.dataset.room;
            roomTypeSelect.value = roomType;
            
            // Remove selected class from all cards
            roomCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
        });
    });
}

// Handle form submission
function setupFormSubmission() {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            checkIn: document.getElementById('check-in').value,
            checkOut: document.getElementById('check-out').value,
            guests: document.getElementById('guests').value,
            roomType: document.getElementById('room-type').value
        };

        if (validateBooking(formData)) {
            showBookingSummary(formData);
        }
    });
}

// Validate booking data
function validateBooking(data) {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const room = roomData[data.roomType];

    if (checkOutDate <= checkInDate) {
        alert('Check-out date must be after check-in date');
        return false;
    }

    if (data.guests > room.maxGuests) {
        alert(`Maximum ${room.maxGuests} guests allowed for ${room.name}`);
        return false;
    }

    return true;
}

// Calculate total price
function calculateTotal(checkIn, checkOut, roomType) {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const pricePerNight = roomData[roomType].price;
    return nights * pricePerNight;
}

// Show booking summary in modal
function showBookingSummary(data) {
    const total = calculateTotal(data.checkIn, data.checkOut, data.roomType);
    const room = roomData[data.roomType];

    bookingSummary.innerHTML = `
        <div class="summary-item">
            <p><strong>Room:</strong> ${room.name}</p>
            <p><strong>Check-in:</strong> ${formatDate(data.checkIn)}</p>
            <p><strong>Check-out:</strong> ${formatDate(data.checkOut)}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
            <p><strong>Price per night:</strong> $${room.price}</p>
            <p><strong>Total:</strong> $${total}</p>
        </div>
    `;

    modal.style.display = 'block';
}

// Format date for display
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Setup modal handling
function setupModalHandling() {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    confirmBtn.addEventListener('click', () => {
        alert('Booking confirmed! Thank you for choosing Princess Hotel.');
        modal.style.display = 'none';
        bookingForm.reset();
        roomCards.forEach(card => card.classList.remove('selected'));
    });
}