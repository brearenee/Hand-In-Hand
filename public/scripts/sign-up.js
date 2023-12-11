import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    //HTML button with id="sign-up-submit"
    const signUpButton = document.getElementById("sign-up-submit");

    const signUpForm = document.getElementById("sign-up-form");

    // Add a submit event listener to the sign-up button of the form 
    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        // Fetch the values from the form for sign up
        //let postSignUpPhone = document.getElementById("signup-phone").value;
        //let postSignUpImg = document.getElementById("signup-img").value;
        //let postSignUpAddress = document.getElementById("signup-address").value;
        //let postSignUpCity = document.getElementById("signup-city").value;
        //let selectElement = document.getElementById("signup-state"); // selects the select box 
        //let postState = selectElement.options[selectElement.selectedIndex].text; // targets the selected item from the drop down 
        //let postSignUpZip = document.getElementById("signup-zip").value;
        //let postSignUpBio = document.getElementById("signup-about-me").value;

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // User signed up successfully
            const user = userCredential.user;
            const location = await getTempLocation();
            console.log(location); 
            const newUser = {
                username: username,
                last_location: location,
                email: user.email,
                firebase_id: user.uid
                //,phone: postSignUpPhone,
                //img: postSignUpImg,
                //address: postSignUpAddress,
                //city: postSignUpCity,
                //state: postState,
                //zip: postSignUpZip,
                //bio: postSignUpBio
            };

            console.log(newUser);
            // Continue with any other logic after user registration
            alert("User created! Please sign in to access your account.");
            const response = await fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });
            const data = await response.json();
            console.log("Success:", data);
            // Redirect to sign-in after successful registration
            window.location.href = "/sign-in";

        } catch (error) {
            // Handle the authentication error
            const errorCode = error.code.toLowerCase(); // Convert to lowercase
            const errorMessage = error.message;
            console.error("Sign-in error:", errorCode, errorMessage);

            // Handle specific errors
            if (errorCode === "auth/email-already-in-use") {
                // Alert for email-already-in-use
                alert("Sorry, this email is already in use. Please try again.");
            } else {
                // Generic error msg for any other error that may occur during the sign-up process.
                alert("Oops, something went wrong. Please try again later.");
            }
        }
    });
});

async function getTempLocation() {
    try {
        const lat = 39.7452242;
        const long = -105.0088767;
        const response = await fetch(`/locations/lat/${lat}/long/${long}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const location_id = data.id;
        return location_id;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}