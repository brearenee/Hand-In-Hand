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

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // User signed up successfully
            const user = userCredential.user;

     
            // Continue with any other logic after user registration
            alert(`User created! \nEMAIL: ${user.email}\nUUID: ${user.uid}\n`);

            // Redirect to sign-in after successful registration
            window.location.href = "sign-in";

        } catch (error) {
            // Handle the authentication error
            const errorCode = error.code.toLowerCase(); // Convert to lowercase
            const errorMessage = error.message;
            console.error("Sign-in error:", errorCode, errorMessage);

            // Handle specific errors
            if (errorCode === "auth/email-already-in-use") {
                // Alert for email-already-in-use
                alert("Sorry, this email is already in use. Please try again");
            } else {
                // Generic error msg for any other error that may occur during the sign-in process.
                alert("Sorry, there's something wrong. Please try again later.");
            }
        }
    });
});

/*Since sign-up is working we're going to commment this out for now and then come back to it later.
const helpForm = document.getElementById("helpSignUpForm");
helpForm.addEventListener("sign-up-submit", async function (event) {
        // Prevent the form from submitting
        event.preventDefault();

        // Fetch the values from the form for sign up
        let postSignUpUsername = document.getElementById("signup-username").value;
        let postSignUpEmail = document.getElementById("signup-email").value;
        let postPassword = document.getElementById("signup-password").value;
        //let postSignUpPhone = document.getElementById("signup-phone").value;
        //let postSignUpImg = document.getElementById("signup-img").value;
        //let postSignUpAddress = document.getElementById("signup-address").value;
        //let postSignUpCity = document.getElementById("signup-city").value;
        //let selectElement = document.getElementById("signup-state"); // selects the select box 
        //let postState = selectElement.options[selectElement.selectedIndex].text; // targets the selected item from the drop down 
        //let postSignUpZip = document.getElementById("signup-zip").value;
        //let postSignUpBio = document.getElementById("signup-about-me").value;
                
        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: postSignUpUsername,
                    email: postSignUpEmail,
                    password: postPassword,
                    //phone: postSignUpPhone,
                    //img: postSignUpImg,
                    //address: postSignUpAddress,
                    //city: postSignUpCity,
                    //state: postState,
                    //zip: postSignUpZip,
                    //bio: postSignUpBio
                })
            });
            const data = await response.json();
            console.log('Success:', data);
            window.location.href = "sign-in";
        } catch (error) {
            console.error('Error:', error);
        }
});
*/