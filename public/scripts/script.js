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
                    card.querySelector("p").innerText = users.created_at;
                    card.querySelector("p1").innerText = users.body;

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