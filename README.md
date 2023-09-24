
# Hand In Hand
Web Application created as a project for MSU Denver's Fall 2023 Senior Experience Course.  Authors are Sarah Barnes, Brea Chaney, Erika Sadsad, Jessica Gardner, Alyssa Williams 

>TEAM: Please see our Teams channel documentation for more detailed instructions about each section. 


**Environment Variables Needed**:  
- POSTGRES_PORT, POSTGRES_DB, POSTGRES_USR, POSTGRES_PWD, POSTGRES_HOST, POSTGRES_URL, PGADMIN_DEFAULT_EMAIL,  PGADMIN_DEFAULT_PASSWORD


## To Run: 

>you must have Docker Compose installed **AND** running. 

>run the command:   
```docker compose up```

head to http://localhost:3000/ in your browser. That's it! 



#### **Useful Commands**
if any changes to the Dockerfile or Compose file are pulled in/made, you will need to rebuild the containers. This is done with   
```docker compose up --build```  

To stop the containers: (ctrl+C also works)

```docker compose down```


## PG-ADMIN TOOL ##
This project contains access to Pg-Admin, a GUI tool for accessing our database in local development. 

### Run ###
>Make sure container is running, and head to 
http://localhost:16543/  

***Login***  
 *(can be changed in environment variables)*  
*username:* example@email.com  
*password:* 123fakepassword 


## ESLint ##
### Linter Purpose and Instructions ###

>A linter ensures that code conforms to best coding practices.  

_**PLEASE LINT YOUR CODE BEFORE EVERY PULL REQUEST!**_

 ## To run ##
    in a new terminal, access the containers command-line by running:
    
 ```docker exec -it senior-experience-group-project-community-first-app-1 sh ```

    then while inside the container, run the linter: 
 
`````` npx eslint yourfile.js ``````

You should then see the linter's response to your code in the terminal. It will tell you about problematic portions of code or that your code is good to go.

if running into issues with "sh" being unavailble, please see documentation in Teams on how to install npm locally. 

#### To auto-fix code ####
 
```npx eslint yourfile.js --fix```


*Current code standards:*
* Indentation must be 4 spaces, not tabs
* We are using unix linebreak style
* Strings must be in double quotes
* There must always be a following semicolon


## Swagger Documentation ##

See Swagger API docs in http://localhost:3000/api-docs/ 