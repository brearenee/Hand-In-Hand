console.log("script.js");

async function fetchAndPopulateFeed() {
    const feedContent = document.getElementById("feed-content");
    // Select the template once
    const cardTemplate = document.querySelector("template");

    try {
        // Send a POST request to the server
        const response = await fetch("/posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();

        // test that we get the results back. 
        console.log("GET RESULTS: ", result)

        result.forEach((posts) => {

            // Clone a copy of the template we can insert in the DOM as a real visible node
            const card = cardTemplate.content.cloneNode(true);

            // Update the content of the cloned template with the employee data we queried from the backend
            card.getElementById("post-card-title").innerText = posts.title;

            // Parse and format the to date in MM/DD/YY format
            const toDate= new Date(posts.request_to).toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
          
            // Parse and format the from date in MM/DD/YY format
            const fromDate= new Date(posts.request_from).toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
          
            card.getElementById("from-date").innerText = fromDate; 
            card.getElementById("to-date").innerText = toDate;
            card.getElementById("post-card-body").innerText = posts.body;

            card.getElementById("post-card-type").innerText = posts.type;

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

const helpForm = document.getElementById("helpFormSubmit");
helpForm.addEventListener("submit", function (event) {
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
        type: postType,
        fromDate: postFromDate,
        toDate: postToDate,
        // location: postLocation,
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
        const onSubmitMessage = document.getElementById('on-submit-message');

        // Handle response, e.g., by updating the UI or giving feedback to the user
        if (response.ok) {
            helpForm.reset();
            onSubmitMessage.classList.add("text-success")
            onSubmitMessage.textContent = "Your request has been successfully added to the feed!"
            fetchAndPopulateFeed(); // Refresh the feed
        } else {
            onSubmitMessage.classList.add("text-danger")
            onSubmitMessage.textContent = "Error creating post: " + (result.error || "Unknown error")
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


