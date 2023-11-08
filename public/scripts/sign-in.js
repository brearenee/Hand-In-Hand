import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Initialize Firebase with your configuration
const firebaseConfig = {
    //Will need to figure out how to hide the api key in the future-- lets just get it working first
    apiKey: "AIzaSyC0oWPskVb62ZSrP_0HXMtvHzeAju3hKKM",
    authDomain: "handinhand-d834c.firebaseapp.com",
    projectId: "handinhand-d834c"
};
  
const app = initializeApp(firebaseConfig);
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
            console.error("Sign-in error:", errorCode, errorMessage);
            // Handle errors or display to the user
        });
}

// Event listener for sign-in button click
document.getElementById("sign-in-btn").addEventListener("click", () => {
    const email = document.getElementById("user-name").value;
    const password = document.getElementById("password").value;

    // Call the sign-in function with the provided email and password
    signInUser(email, password);
});

