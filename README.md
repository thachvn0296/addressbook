# Simple address book

A simple address book for management, in which allows you to View, Add, Update, Delete (people only), and Disable (organisation only) people and organisations.

## General project structure
This project includes one React.js source (as front end source code, **client** folder), and one Node.js source (express based, as back end source code, **api** folder).

Client will run on port 3000, and api will reserves port 9000 as default.

Data will be stored in json files.

## How to start the project

**Environmental setup:**
- Node.js: https://nodejs.org/en/
- Yarn (optional): https://classic.yarnpkg.com/en/docs/install/#windows-stable

**Guideline and Important scripts:**
Please note that all the script need to be executed in a command line interpreter application (I will call it Terminal in here). Use terminal, or cmd (or any command prompt that suit to you and your OS).
- Use 2 Terminals, one is navigate to client folder, and the other one will need to point to api folder
- On both, run `npm install && npm start` or `yarn install && yarn start` (to install node modules, and start the project afterward)

