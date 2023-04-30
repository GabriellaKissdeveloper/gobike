This is my solution for Solita pre-assignment Helsinki City Bike App.

The backend uses Node.js and TypeScript, the frontend is React.js framework. The data is stored in MongoDB Atlas. I could upload only the journey data from May and June, and the station data, because of the limit of storage size in MongoDB Atlas.

---

Download and install the packages:
Download the files from github, then install the packages at the frontend and at the backend.
First at the root folder run the command: npm install, then enter the backend folder, and also run 'npm install' command.
Backend runs on port 8000, frontend runs on port 3000.

Upload the data:
Rename the .env.sample file to .env, and change the username, password and cluster name in MONGO_URI variable. Or change the whole string if you want to load the data to local MongoDB storage.
Put the .csv files about journey data of May and June (or if you have more storage size then 512MB, also July) into folder backend/database/data. In the terminal run the following command: npm db-start or npx ts-node database/readJourneys.ts
The function will check the csv files in data folder and create a database named 'gobike' with two collections: 'stations' and 'journeys'. Then it uploads the data from the files.

---
