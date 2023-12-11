import { auth } from "./auth.js";
import {  signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Function to sign in a user
function signInUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User signed in:", user);
             // Cache non-sensitive user data
             const userData = {
                token: user.getIdToken(), 
                email: user.email,
                // Add any other non-sensitive fields you need
            };
            localStorage.setItem('userData', JSON.stringify(userData));

            window.location.href = "/"; // Redirect upon successful sign-in
        })
        .catch((error) => {
            const errorCode = error.code.toLowerCase(); // Convert to lowercase
            const errorMessage = error.message;
            console.error("Sign-in error:", errorCode, errorMessage);

            // Handle specific errors
            if (errorCode === "auth/user-not-found" || errorCode === "auth/invalid-login-credentials") {
                // Alert for user-not-found or wrong-password
                alert("Sorry, your email or password is incorrect. Please try again.");
                // Alert for too many failed attempts
            } else if (errorCode === "auth/too-many-requests"){
                alert("Too many failed attempts. Please try again later.");
            } else {
                // Generic error msg for any other error that may occur during the sign-in process.
                alert("Oops, something went wrong. Please try again later.");
            }
        });
}



const signInForm = document.getElementById("sign-in-form"); 

// Event listener for form submit on sign-in button click
signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("user-name").value;
    const password = document.getElementById("password").value;

    // Call the sign-in function with the provided email and password
    signInUser(email, password);
});