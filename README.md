
# Hand In Hand
**hint:** open this file as *preview* to see markdown formatting

-insert project vision statement here-    
  
Created as a project for MSU Denver's Fall 2023 Senior Experience Course.  Authors are Sarah Barnes, Brea Chaney, Erika Sadsad Jessica Gardner, Alyssa Williams 




### First Time Application Setup

>you must have Docker Compose installed **AND** running. 

run this command in your command line to check if Docker Compose is installed:

```docker compose version```  

if this returns without a version, please go to https://docs.docker.com/compose/install/ to install Docker Desktop (follow the download for "Scenario one").

**Environment Variables**:  
- POSTGRES_PORT
- POSTGRES_DB
- POSTGRES_USR
- POSTGRES_PWD
- POSTGRES_HOST
- POSTGRES_URL
- PGADMIN_DEFAULT_EMAIL
- PGADMIN_DEFAULT_PASSWORD
>TEAM: Please see our Teams channel for the "env.txt" file and follow the instructions in the comment section at the top to add a .env file to the root folder. This will handle all of the values listed. 


### To Start Application:

run the command:   
```docker compose up```

This will build the images (if needed) and run the container and application. 

once the container has started, head to http://localhost:3000/ in your browser. And that's it!  

Note: nodemon has been installed with this program, so once any changes to a .js file are saved, the server will automatically refresh with the updates, allowing for easier development. 

### Useful Commands
if any changes to the Dockerfile or Compose file are pulled in/made, you will need to manually rebuild the containers. This is done with   
```docker compose up --build```  

To stop the containers: (ctrl+C also works)

```docker compose down```

### File Structure
 
 >We can adjust this as needed, but here's the general idea. files/subfiles can and should be added as needed.  

 - **/db:** database seed files/scripts/migration 
 - **/node_modules:** this is autogenerated by node. We don't need to worry about it. 
 - **/public:** Front-End things. 
    - **/scripts:** This folder contains all the js logic files. 
    - **/css:** This folder contains css files. 
 - **/src:** Back-End things.
    - **/controllers:** This folder will contain all the functions for our APIs. Naming of files- xxxxx.controllers.js
    - **/routes:** This folder will contain all the routes that you have created. The logic they use will be exported from a Controller file. Naming of files- xxxxx.routes.js
    - **/models:** This folder will contain all our schema files and and the functions required for the schema. Naming of files- xxxxx.js
    - **/utils:**  The common functions that we require multiple times throughout our code 
 - **/tests:**: This folder holds our test files. Subfiles added as needed. 




## PG-ADMIN TOOL ##
This project contains access to Pg-Admin, a tool for accessing our database in local development. 

### Setup ###
>Make sure container is running, and head to 
http://localhost:16543/  

***Login***  

*username:* example@email.com  
*password:* 123fakepassword 


After logging in,  right click on "Servers" (far left) and click register->server...    

**General:**   
*name* = whatever you want. (I named mine HiH).   

**Connection:**  
*host*: postgres  
*username*: root  
*password*: root   

Leave the rest of the fields as is, click save.  

Now if you explore Servers > HiH > postgres > Schemas > public > Tables, you will see a list of all of the tables in this database.  

### Query Tool: ###
>Right click on any item in the list to find "Query Tool" option. Here you can query your local DB and test out any SQL logic before implementing it in the code base. 



