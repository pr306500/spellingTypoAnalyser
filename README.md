# spellingTypoAnalyser

This service generates the report of the spelling mistakes along with the suggestions to the user

### Running

- Clone the repository and run the following command to install the required dependencies:

  ```
  npm install
  ```

  
- Finally, run the application:

  ```
  node index.js
  ```

   Hit post request on `http://localhost:3000/generateSpellReport` with the request json body:
   {
    "description":" TEXT ENTERED BY USER "
   }
   and it will return the spelling typos along with the suggestion list.