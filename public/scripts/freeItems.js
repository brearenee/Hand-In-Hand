
//script to call freeItem route
async function getPostsAndPutIntoDB(latitude, longitude) {
    let data;
    try {
        //make the call to freeItems route with location params
        const response = await fetch("/freeItems/lat/" + latitude + "/long/" + longitude,
            {method: "GET",
                headers: {
                    "Content-type":"application/json",
                }
            });
        data = await response.json();
        return data;

    } catch (error) {
        console.error("Could not fetch free items.", error);
        return data;
    
    }
}

export{
    getPostsAndPutIntoDB,
};