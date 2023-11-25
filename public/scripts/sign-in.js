import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Firebase config. Only need once plus it's more protected this way
const firebaseConfig = {
    apiKey: "AIzaSyC0oWPskVb62ZSrP_0HXMtvHzeAju3hKKM",
    authDomain: "handinhand-d834c.firebaseapp.com",
    projectId: "handinhand-d834c"
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Get the authentication instance
const auth = getAuth(app);

// Function to sign in a user
function signInUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User signed in:", user);

            window.location.href = "index.html"; // Redirect upon successful sign-in
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // Handle specific errors
            if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
                // User not found or wrong password
                alert("Incorrect email or password. Please try again.");
            } else {
                // Other errors
                console.error("Sign-in error:", errorCode, errorMessage);
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