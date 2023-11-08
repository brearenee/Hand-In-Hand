let latitude;
let longitude;
async function getGeolocation() {
    let data
    if ("geolocation" in navigator) {
        console.log("Testing geolocation");
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            latitude = await position.coords.latitude;
            longitude = await position.coords.longitude;

            const coordinates = {
                "latitude": latitude, 
                "longitude": longitude
            }

            //reverse geocode those coordinates by calling our api.
            try{
            
            const response = await fetch(`/locations/lat/${latitude}/long/${longitude}`); 
            data = await response.json(); // Parse the JSON data from the response
            }
            catch(error){ console.log("fetch locationApi err", error)}
            return data

        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function addLocation() {
}

export { getGeolocation }
