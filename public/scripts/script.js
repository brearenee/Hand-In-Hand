import { getPostsAndPutIntoDB } from "./freeItems.js";
import { getGeolocation, parseLocationInfo } from "./geolocation.js";
import { auth } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { respondButtonEmailHandler } from "./post-respond.js";


// Check for user authentication before loading page content 
window.addEventListener("DOMContentLoaded", () => {
    const userData = localStorage.getItem("userData");
    const loadingContent = document.getElementById("loading");
    const authContent = document.getElementById("auth-content");
    if (userData) {
        // User data is cached, display relevant content immediately
        loadingContent.style.display = "none";
        authContent.style.display = "block";
    } else { 
        window.location.href = "/sign-in";
    }


});


let address;

async function autofillLocation() {
    address = await getGeolocation();
    if (address.neighborhood != null) {
        document.getElementById("post-location").value = `${address.neighborhood} neighborhood in ${address.city}  `;
    } else if (address.full_address != null) {
        document.getElementById("post-location").value = `${address.full_address}`;
    } else if (address.street_number != null) {
        document.getElementById("post-location").value = `${address.street_number} ${address.street_name}, ${address.city}, ${address.state_short}`;
    }
    else {
        document.getElementById("post-location").value = "Type Address Here";
    }
}

await autofillLocation();

async function populateDB() {
    //function to populate our db with trashnothing posts.
    try {
        //address = await getGeolocation(); //gets location again
        await getPostsAndPutIntoDB(address.lat, address.long); //calls the script that calls our freeItems route
    } catch (error) {
        console.error("Error populating DB:", error);
    }
}


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

        await populateFeedCards(feedContent, result);

    } catch (error) {
        console.error("Error fetching and populating feed:", error);
    }
}

async function initFeed() {
    //calls our populate db function, forces a 4 second delay to allow for population of posts db
    //calls the fetchAndPopulateFeed function
    await populateDB();
    await fetchAndPopulateFeed();
    //setTimeout(fetchAndPopulateFeed, 2000); //timeout to allow for posts to populate db
    await respondButtonEmailHandler();

}


initFeed(); 



const helpForm = document.getElementById("helpFormSubmit");

helpForm.addEventListener("submit", function (event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Fetch the values from the form
    let postSummary = document.getElementById("post-summary").value;
    let postDescription = document.getElementById("post-description").value;
    let postLocation = address;
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
        request_from: postFromDate,
        request_to: postToDate,
        location: postLocation,
        // Handle images later 
    };

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
            await fetchAndPopulateFeed(); // Refresh the feed
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

        const feedContent = document.getElementById("feed-content");

        // update community feed with only those cards
        clearFeedContent(feedContent);
        await populateFeedCards(feedContent, result);


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
            fetchPostsByType(postType);
        }

    });
});


// helper function to populate feed cards
async function populateFeedCards(feedContent, data) {
    // Select the template once
    const cardTemplate = document.querySelector("template");

    // Iterate over the data array using for...of loop
    for (const post of data.reverse()) {
        const currentDate = new Date().toLocaleDateString("en-US", { timeZone: "UTC", year: "2-digit", month: "2-digit", day: "2-digit" });
        let postEndDate = new Date(post.request_to).toLocaleDateString("en-US", { timeZone: "UTC", year: "2-digit", month: "2-digit", day: "2-digit" });

        // Only show the card if the post is a future date (including today)
        if (postEndDate >= currentDate) {
            try {
                const apiAddress = await fetch(`/locations/id/${post.location_id}`);
                address = await apiAddress.json();
                address.full_address = `${address.street_number} ${address.street_name} ${address.city}, ${address.state_short}`;
            } catch (error) {
                console.log("fetch locationApi err", error);
            }

            // Clone a copy of the template we can insert in the DOM as a real visible node
            const card = cardTemplate.content.cloneNode(true);

            // Update the content of the cloned template with the employee data we queried from the backend
            card.getElementById("post-card-title").innerText = post.title;

            // Assign toDate to parsed request_to date.
            const toDate = postEndDate;

            // Parse and format the to date in MM/DD/YY format
            const fromDate = new Date(post.request_from).toLocaleDateString("en-US", { timeZone: "UTC", year: "2-digit", month: "2-digit", day: "2-digit" });

            card.getElementById("from-date").innerText = fromDate;
            card.getElementById("to-date").innerText = toDate;
            card.getElementById("post-card-body").innerText = post.body;
            card.getElementById("post-card-type").innerText = post.type;
            card.getElementById("location").innerText =
                address.neighborhood ? `${address.neighborhood}, ${address.city}` : address.full_address;

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
        }
    }
}


const searchInput = document.getElementById("post-location");
const autocompleteDropdown = document.getElementById("autocompleteDropdown");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value;

    try {
        const response = await fetch(`/geocode/${query}`);
        const data = await response.json();

        // Display autocomplete results in the dropdown
        displayAutocompleteResults(data.features);

    } catch (error) {
        console.error("Error fetching geocoding data:", error);
    }
});

function displayAutocompleteResults(results) {
    // Clear previous results
    autocompleteDropdown.innerHTML = "";

    // Create and append a list of results to the dropdown
    const ul = document.createElement("ul");
    ul.className = "autocomplete-list";

    results.forEach((result) => {
        const li = document.createElement("li");
        li.textContent = result.place_name;

        // Handle click on a result
        li.addEventListener("click", () => {
            // Set the selected result as the input value
            searchInput.value = result.place_name;
            const rawAddress = result;
            address = parseLocationInfo(rawAddress);
            // Clear the dropdown
            autocompleteDropdown.innerHTML = "";
            // Optionally, you can trigger additional actions here

        });

        ul.appendChild(li);
    });

    // Append the list to the dropdown
    autocompleteDropdown.appendChild(ul);
}

// Close the dropdown when clicking outside of it
document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !autocompleteDropdown.contains(event.target)) {
        autocompleteDropdown.innerHTML = "";
    }
});



// Export the fetchAndPopulateFeed function
export default {
    fetchAndPopulateFeed,
};