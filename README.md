video :- https://youtu.be/Z0GCGoov9Us

## Project Overview

This Node.js application demonstrates real-time, bidirectional synchronization between a Google Sheet and a PostgreSQL database. The system ensures that any changes made in either the Google Sheet or the PostgreSQL database are synchronized using a "last-write-wins" approach. The application supports CRUD operations, which automatically trigger the sync process, and also runs scheduled syncs every minute using `node-cron`.

---

## Setup Instructions

To get the application up and running, follow these steps:

### Prerequisites
- Docker and Docker Compose should be installed on your system.
- Set up Google API credentials (details in the block points section).

### Steps to Run
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. Build and start the services:
   ```bash
   docker-compose up --build
   docker-compose up
3. Once the services are running, the application will be accessible at:
   - Node.js app: [http://localhost:3000](http://localhost:3000)
   - PostgreSQL database: [localhost:5432](localhost:5432)
   - Adminer (database management): [http://localhost:8080](http://localhost:8080)

4. Set up your Google API credentials:
   - Obtain credentials from the Google Cloud Console by creating a new project and enabling the Google Sheets and Google Drive APIs.
   - Download the credentials file as `credentials.json` and place it in the project directory.
   - Ensure the correct `SHEET_ID` is set in `config/google.js` for your Google Sheet.

5. The application will automatically sync the data between Google Sheets and PostgreSQL both manually (via CRUD operations) and automatically (every minute using a cron job).

---

## Approach Towards the Solution

### Objective
The goal was to create a system that enables real-time synchronization of data between a Google Sheet and a PostgreSQL database, handling both manual and automated updates.

### Key Features:
1. **CRUD Operations with Sync:**  
   The app provides manual CRUD operations through REST API endpoints, ensuring that any creation, update, or deletion in the PostgreSQL database immediately triggers synchronization with the Google Sheet.

2. **Bidirectional Sync:**  
   The app syncs data both ways, meaning:
   - Changes in the Google Sheet are synced to the PostgreSQL database.
   - Changes in the PostgreSQL database are synced to the Google Sheet.

3. **Real-Time Monitoring:**  
   A cron job is set up to run every minute, checking for changes and synchronizing data between the Google Sheet and the PostgreSQL database in real-time.

4. **Last-Write-Wins Logic:**  
   The app tracks the "last modified" time of the data in both the PostgreSQL database and the Google Sheet. Whichever source has the most recent changes overwrites the other, ensuring data consistency.

---

## Block Points & Considerations

1. **Google Sheets API Setup:**  
   Integrating with the Google Sheets API required setting up proper OAuth credentials and ensuring that the app has the necessary permissions to read and write data. In addition, the Google Drive API was used to track changes made in the Google Sheet to determine which data source had the latest modifications.

2. **Tech Stack Choices:**  
   - **Initial Approach (Django):**  
     The project was initially implemented using Django, but it was soon realized that Node.js would be a better fit for handling real-time updates efficiently, especially with event-driven mechanisms.
   
   - **Final Approach (Node.js):**  
     Node.js, with its non-blocking I/O model and better support for asynchronous operations, was chosen to handle real-time synchronization more efficiently.

3. **Bidirectional Data Sync:**  
   The main challenge was ensuring seamless synchronization between the two systems. The Google Drive API was used to track modifications on Google Sheets, and a custom synchronization logic was implemented to handle updates between the Google Sheet and the PostgreSQL database.

---

## Project Structure

- `package.json`: Contains the dependencies used for the project, including `express`, `googleapis`, `node-cron`, `pg`, etc.
- `docker-compose.yml`: Defines the services, including PostgreSQL, Adminer, and the Node.js app.
- `app.js`: The main entry point for the application, handling CRUD operations and synchronization.
- `services/sheetsServices.js`: Handles reading and writing data to Google Sheets using the Google Sheets API.
- `services/syncServices.js`: Contains the logic for bidirectional data synchronization based on the "last-write-wins" approach.
- `config/db.js`: Contains the PostgreSQL connection pool configuration.
- `config/google.js`: Contains the Google API setup and authentication logic.

---

## Conclusion

This project successfully demonstrates how to synchronize data in real-time between a Google Sheet and a PostgreSQL database using Node.js, Docker, and Google APIs. The application is designed to handle CRUD operations, scheduled updates, and real-time bidirectional data synchronization with efficient handling of conflicts and changes.




*Add your video here, and your approach to the problem (optional). Leave some comments for us here if you want, we will be reading this :)*
