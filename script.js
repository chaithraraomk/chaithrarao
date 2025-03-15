async function searchPlace() {
    const query = document.getElementById('search').value;
    if (!query) return;

    try {
        const response = await fetch(`http://localhost:5000/search?q=${query}`);
        const data = await response.json();
        
        if (data.error) {
            document.getElementById('results').innerHTML = `<p>${data.error}</p>`;
        } else {
            displayResults([data]);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('results').innerHTML = "<p>Something went wrong. Try again.</p>";
    }
}

function displayResults(places) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    places.forEach(place => {
        const placeCard = document.createElement("div");
        placeCard.classList.add("place-card");
        placeCard.innerHTML = `
            <h2>${place.display_name}</h2>
            <p>Latitude: ${place.lat}, Longitude: ${place.lon}</p>
            <img src="https://source.unsplash.com/400x250/?travel" alt="${place.display_name}">
        `;
        resultsDiv.appendChild(placeCard);
    });
}
