[![Lint Code](https://github.com/msu-denver/senior-experience-group-project-community-first/actions/workflows/lint.yml/badge.svg)](https://github.com/msu-denver/senior-experience-group-project-community-first/actions/workflows/lint.yml)
# Hand In Hand
Web Application created as a project for MSU Denver's Fall 2023 Senior Experience Course.  Authors are Sarah Barnes, Brea Chaney, Erika Sadsad, Jessica Gardner, Alyssa Williams 

>TEAM: Please see our Teams channel documentation for more detailed instructions about each section.


**Environment Variables Needed**:  
- POSTGRES_PORT, POSTGRES_DB, POSTGRES_USR, POSTGRES_PWD, POSTGRES_HOST, POSTGRES_URL, PGADMIN_DEFAULT_EMAIL,  PGADMIN_DEFAULT_PASSWORD


## To Run: 

>you must have Docker Compose installed **AND** running. 

>run the command:   
```
docker compose up
```

head to https://localhost:3000/ in your browser. That's it! 



#### **Useful Commands**
If any changes to the Dockerfile or Compose file are pulled in/made, you will need to rebuild the containers. This is done with   
```
docker compose up --build
```  

To stop the containers: (ctrl+C also works)

```
docker compose down
```


## PG-ADMIN TOOL ##
This project contains access to Pg-Admin, a GUI tool for accessing our database in local development. 

### Run ###
>Make sure container is running, and head to 
http://localhost:16543/  

***Login***  
*(can be changed in environment variables)*  
*username:* example@email.com  
*password:* 123fakepassword 


## ESLint and StyleLint
### Linter Purpose and Instructions

>A linter ensures that code conforms to best coding practices. This project supports linting for JavaScript, HTML, CSS and SCSS.   

_**PLEASE LINT YOUR CODE BEFORE EVERY PULL REQUEST!**_

### To Run
In a new terminal, access the container command-line by running:
    
```
docker exec -it senior-experience-group-project-community-first-app-1 sh
```
#### ESLint 
Then while inside the container, run the linter for either **.js** files or **.html** files: 
 
```
npx eslint yourfile.js/html
```
**NOTE:** You can lint all files by running: 
```
npx eslint .
```
You should then see the linter's response to your code in the terminal. It will tell you about problematic portions of code or that your code is good to go.

If running into issues with "sh" being unavailble, please see documentation in Teams on how to install npm locally. 

##### To auto-fix via ESLint
 
```
npx eslint yourfile.js --fix
```
**NOTE:** You can lint/fix all files by running: 
```
npx eslint . --fix
```

#### StyleLint 
From inside the same app container, run the following command to lint either **.css** or **.scss** files:  
```
npx stylelint path/myFile.css/scss
```

##### To auto-fix style files via StyleLint: 
```
npx stylelint path/myFile.css/scss --fix
```

### *Current code standards:*
- JavaScript Standards: 
   - Indentation must be 4 spaces, not tabs
   - We are using unix linebreak style
   - Strings must be in double quotes
   - There must always be an ending semicolon. 
- HTML Standards 
   - All errors are reported/fixed based off of the Best Practice Rules from [HTML ESLint Docs](https://yeonjuan.github.io/html-eslint/docs/rules/)


## Swagger Documentation ##
You may need to run following command inside the app-1 Docker container.
```
npm install swagger-ui-express swagger-jsdoc
```

Inside app-1 Docker container, run
```
npm run start
```

Go to Swagger API docs in https://localhost:3000/api-docs/ 


### coverage report
`npm run coverage`
`npx nyc --reporter=lcov --reporter=text mocha   "tests/**/*.js" "src/**/*.js" --exit`
