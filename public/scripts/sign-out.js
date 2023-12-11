import { auth } from "./auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";



const signOutBtn = document.getElementById("sign-out-btn");

signOutBtn.addEventListener("click", () => {
    // Sign out the user
    signOut(auth).then(() => {
        // Sign-out successful, redirect to sign-in page
        console.log("User signed out.");
        localStorage.removeItem('userData');
        window.location.href = "/sign-in";
    }).catch((error) => {
        // Handle any errors here
        console.error("Error signing out:", error);
    });

}); 
