import { getGeolocation } from './geolocation.js';
let address


async function autofillLocation() {
    address = await getGeolocation();
    if (address.neighborhood != null){
        document.getElementById('post-location').value = `${address.neighborhood} neighborhood in ${address.city}  `
    } else if (address.full_address != null) {
        console.log("full_address")
        document.getElementById('post-location').value = `${address.full_address}`
    } else if (address.street_number  != null) {
        document.getElementById('post-location').value = `${address.street_number} ${address.street_name}, ${address.city}, ${address.state_short}`
    }
    else{
        document.getElementById('post-location').value = `Lattitude: ${address.latitude}, Longitude: ${address.longitude}`
    }
}
await autofillLocation()

async function fetchAndPopulateFeed() {
    const feedContent = document.getElementById("feed-content");

    clearFeedContent(feedContent);

    try {
        // Send a GET request to the server
        const response = await fetch("/posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();

        // test that we get the results back. 
        console.log("GET RESULTS: ", result);

        populateFeedCards(feedContent, result);

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
    // let postLocation = document.getElementById("post-location").value;
    // let postImages = document.getElementById("form-file-multiple").files; // This returns a FileList object
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



function clearFeedContent(feedContent) {
    // Clear existing cards
    // Remove all dynamically added cards (those with the class 'dynamic-card')
    const dynamicCards = feedContent.querySelectorAll(".dynamic-card");
    dynamicCards.forEach(card => feedContent.removeChild(card));

    console.log("Content cleared. Starting to populate...");
}

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
        const onSubmitMessage = document.getElementById("on-submit-message");

        // Handle response, e.g., by updating the UI or giving feedback to the user
        if (response.ok) {
            helpForm.reset();
            onSubmitMessage.classList.add("text-success");
            onSubmitMessage.textContent = "Your request has been successfully added to the feed!";
            fetchAndPopulateFeed(); // Refresh the feed
        } else {
            onSubmitMessage.classList.add("text-danger");
            onSubmitMessage.textContent = "Error creating post: " + (result.error || "Unknown error");
        }
    } catch (error) {
        console.error("Error posting data:", error);
        alert("An error occurred while posting data.");
    }
}


// Function to fetch posts by type
async function fetchPostsByType(type) {
    try {
        const response = await fetch(`/posts/type/${type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();

        // test that we get the results back. 
        console.log("POST TYPE RESULTS: ", result);
        const feedContent = document.getElementById("feed-content");

        // update community feed with only those cards
        clearFeedContent(feedContent);
        populateFeedCards(feedContent, result);


    } catch (error) {
        console.error("Error:", error);
        // Handle the error in your UI (e.g., display an error message)
    }
}

// Add event listeners to the tab links
document.querySelectorAll(".feed-tab").forEach(tabLink => {
    tabLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default tab switching behavior

        const postType = this.getAttribute("data-post-type");
        if (postType == "All Posts") {
            fetchAndPopulateFeed();
        } else {
            console.log(postType);
            fetchPostsByType(postType);
        }

    });
});


// helper function to populate feed cards
function populateFeedCards(feedContent, data) {
    // Select the template once
    const cardTemplate = document.querySelector("template");
    console.log(data);

    data.reverse().forEach((post) => {

        // Clone a copy of the template we can insert in the DOM as a real visible node
        const card = cardTemplate.content.cloneNode(true);

        // Update the content of the cloned template with the employee data we queried from the backend
        card.getElementById("post-card-title").innerText = post.title;

        // Parse and format the to date in MM/DD/YY format
        const toDate = new Date(post.request_to).toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });

        // Parse and format the from date in MM/DD/YY format
        const fromDate = new Date(post.request_from).toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });

        card.getElementById("from-date").innerText = fromDate;
        card.getElementById("to-date").innerText = toDate;
        card.getElementById("post-card-body").innerText = post.body;

        card.getElementById("post-card-type").innerText = post.type;

        // Create a new row div to wrap the card
        const colDiv = document.createElement("div");
        colDiv.classList.add("row");
        colDiv.classList.add("g-3");
        colDiv.classList.add("dynamic-card");

        // Append the card to the new row div
        colDiv.appendChild(card);

        // Append the new column div to the row
        feedContent.appendChild(colDiv);

        console.log("Card appended to feed content");

    });

}


// Export the fetchAndPopulateFeed function
export default {
    fetchAndPopulateFeed,
};