console.log("script.js");

async function fetchAndPopulateFeed() {
    const feedContent = document.getElementById("feed-content");
    // Select the template once
    const cardTemplate = document.querySelector("template");

    try {
        const response = await fetch("/posts");
        const data = await response.json();

        data.forEach((users) => {

            // Clone a copy of the template we can insert in the DOM as a real visible node
            const card = cardTemplate.content.cloneNode(true);

            // Update the content of the cloned template with the employee data we queried from the backend
            card.querySelector("h4").innerText = users.title;

            // Parse and format the date in MM/DD/YY format
            const createdAt = new Date(users.created_at);
            const formattedDate = createdAt.toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
            // Get the time in Hour:Minutes AM/PM format
            const formattedTime = createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
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

    } catch (error) {
        console.error("Error fetching and populating feed:", error);
    }
}
fetchAndPopulateFeed();

document.getElementById("helpFormSubmit").addEventListener("submit", function (event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Fetch the values from the form
    let postSummary = document.getElementById("post-summary").value;
    let postDescription = document.getElementById("post-description").value;
    let postLocation = document.getElementById("post-location").value;
    let postImages = document.getElementById("form-file-multiple").files; // This returns a FileList object
    let selectElement = document.getElementById("post-type-select"); // selects the select box 
    let postType = selectElement.options[selectElement.selectedIndex].text; // targets the seelcted item fromt eh drop down 
    let postFromDate = document.getElementById("post-from-date").value;
    let postToDate = document.getElementById("post-to-date").value;

    // save values to variables or send them to your API
    const formData = {
        title: postSummary,
        body: postDescription,
        type: postType
        // location: postLocation,
        // fromDate: postFromDate,
        // toDate: postToDate,
        // Handle images later 
    };
    console.log("Form Data from submit button: \n", formData);

    postData(formData);
});



// function to post a new form entry to DB
async function postData(data) {

    console.log("Form Data in postData: \n", data);

    try {
        // Send a POST request to the server
        const response = await fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        // Handle response, e.g., by updating the UI or giving feedback to the user
        if (response.ok) {
            alert("Post created successfully!");
            fetchAndPopulateFeed(); // Refresh the feed
        } else {
            alert("Error creating post: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error posting data:", error);
        alert("An error occurred while posting data.");
    }
}



// Export the fetchAndPopulateFeed function
module.exports = {
    fetchAndPopulateFeed,
};


