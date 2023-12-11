import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";


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



export { auth }