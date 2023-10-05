console.log("script.js");

async function fetchAndPopulateFeed() {
    try {
        fetch("/posts")
            .then((response) => { return response.json(); })
            .then((data) => {

                const feedContent = document.getElementById("feed-content");

                data.forEach((users) => {
                    // Select the <template> we created in index.html
                    const cardTemplate = document.querySelector("template");

                    // Clone a copy of the template we can insert in the DOM as a real visible node
                    const card = cardTemplate.content.cloneNode(true);

                    // Update the content of the cloned template with the employee data we queried from the backend
                    card.querySelector("h4").innerText = users.title;

                    // Parse and format the date in MM/DD/YY format
                    const createdAt = new Date(users.created_at);
                    const formattedDate = createdAt.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
                    // Get the time in Hour:Minutes AM/PM format
                    const formattedTime = createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                    // Combine the date and time
                    const dateTimeString = `${formattedDate} ${formattedTime}`;
                    // Set the text of the <p> element to the combined date and time
                    card.querySelector("p").innerText = dateTimeString;

                    card.querySelector("p1").innerText = users.body;
                    
                    card.querySelector("p2").innerText = users.type;

                    // Create a new row div to wrap the card
                    const colDiv = document.createElement("div");
                    colDiv.classList.add("row");
                    colDiv.classList.add("g-3");

                    // Append the card to the new row div
                    colDiv.appendChild(card);

                    // Append the new column div to the row
                    feedContent.appendChild(colDiv);
                });
            });

    } catch (error) {
        console.error("Error fetching and populating feed:", error);
    }
}

fetchAndPopulateFeed(); 

// Export the fetchAndPopulateFeed function
module.exports = {
    fetchAndPopulateFeed,
};
