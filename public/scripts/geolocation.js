let latitude;
let longitude;


async function getGeolocation() {
    let data;

    if ("geolocation" in navigator) {
        console.log("Testing geolocation");
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;


            // reverse geocode those coordinates by calling our API
            try {
                const response = await fetch(`/locations/lat/${latitude}/long/${longitude}`);
                data = await response.json(); // Parse the JSON data from the response
            } catch (error) {
                console.log("fetch locationApi err", error);
            }

        } catch (error) {
            console.error(error.message);
            data = { 
                "lat": 0, 
                "long": 0, 
            };
        }
    } else {
        console.log("Geolocation is not supported by this browser.");
        // Handle the case where geolocation is not supported
        data = { 
            "lat": 0, 
            "long": 0, 
        };
    }

    return data;
}

function parseLocationInfo(jsonResponse) {
    const address= {};
    address.lat = jsonResponse.center[1];
    address.long = jsonResponse.center[0];
    address.full_address = jsonResponse.place_name;
    console.log("parseLocationInfo Address", address);
    return address;

}
export { getGeolocation, parseLocationInfo };
