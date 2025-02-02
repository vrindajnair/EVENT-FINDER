document.addEventListener("DOMContentLoaded", async () => {
    const eventList = document.getElementById("event-list");
    const locationInput = document.getElementById("location");
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("location");
    
    locationInput.addEventListener('input', () => {
        const locationValue = locationInput.value;
    });

    async function searchEventsByLocation(location) {
        try {   
            console.log(encodeURIComponent(location))
            const response = await fetch(`http://127.0.0.1:8001/events/search?location=${encodeURIComponent(location)}`);
            if (!response.ok) {
                throw new Error(`An error occurred: ${response.statusText}`);
            }
            const events = await response.json();
            renderEvents(events);
        } catch (error) {
            console.error("Error fetching events:", error);
            alert("An error occurred while searching for events. Please try again later.");
        }
    }

    searchButton.addEventListener("click", async () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            await searchEventsByLocation(searchTerm);
        } else {
            alert("Please enter a location to search.");
        }
    });

    
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);

    
    const styles = document.createElement('style');
    styles.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
            background-color: white;
            margin: 15% auto;
            padding: 20px;
            border-radius: 8px;
            width: 70%;
            max-width: 600px;
            position: relative;
            animation: modalSlide 0.3s ease-out;
        }
        @keyframes modalSlide {
            from {transform: translateY(-100px); opacity: 0;}
            to {transform: translateY(0); opacity: 1;}
        }
        .close {
            position: absolute;
            right: 20px;
            top: 10px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #666;
        }
        .close:hover {
            color: #000;
        }
        .modal-event-image {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .modal-event-details {
            margin-top: 15px;
        }
        .event-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .event-card img {
            width: 100%;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .event-card h3 {
            margin: 10px 0 5px;
        }
        .event-card p {
            margin: 5px 0;
        }
        .book-btn {
            margin-top: 10px;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: #007BFF;
            color: white;
            cursor: pointer;
        }
        .book-btn:hover {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(styles);

    
    const response = await fetch("http://127.0.0.1:8001/events/get-all-events");
    const events = await response.json();

    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    
    const showEventDetails = (event) => {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>${event.name}</h2>
            <div class="modal-event-details">
                <p><strong>Date:</strong> ${formatDate(event.date)} at ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Description:</strong></p>
                <p>${event.description}</p>
            </div>
        `;
        modal.style.display = 'block';
    };

    
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    
    const createEventCard = (event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");

        
        eventCard.innerHTML = `
            <img src="${event.imageUrl}" alt="${event.name}">
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${formatDate(event.date)} at ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <button class="book-btn">Show Details</button>
        `;

        
        const button = eventCard.querySelector('.book-btn');
        button.addEventListener('click', () => showEventDetails(event));

        
        eventList.appendChild(eventCard);
    };

    
    const renderEvents = (eventsToRender) => {
        eventList.innerHTML = ""; 
        if (eventsToRender.length === 0) {
            eventList.innerHTML = "<p>No events found.</p>";
        } else {
            eventsToRender.forEach(createEventCard);
        }
    };

    
    renderEvents(events);
});
