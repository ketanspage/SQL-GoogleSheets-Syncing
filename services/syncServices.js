import { pool } from '../config/db.js';
import { authorize } from '../config/google.js';
import { getSheetData,updateSheetData,getSheetLastModifiedTime } from './sheetsServices.js';
// Sync data from Google Sheets to PostgreSQL
const syncSheetToDB = async () => {
    const auth = await authorize();
    const sheetData = await getSheetData(auth);
  
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM my_table');  // Clear the table before syncing
      for (const row of sheetData) {
        const query = 'INSERT INTO my_table (column1, column2, column3, column4, last_modified) VALUES ($1, $2, $3, $4, NOW())';
        await client.query(query, row);
      }
      await client.query('COMMIT');
      console.log('Data synced from Google Sheets to PostgreSQL');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };
  
// Sync data from PostgreSQL to Google Sheets
const syncDBToSheet = async () => {
    const auth = await authorize();
  
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM my_table');
      const sheetData = result.rows.map(row => [row.column1, row.column2, row.column3, row.column4]);
      await updateSheetData(auth, sheetData);
      console.log('Data synced from PostgreSQL to Google Sheets');
    } finally {
      client.release();
    }
};

// Get the last modification times from both Google Sheets and PostgreSQL
const getLastModifiedTimes = async (auth) => {
    // Get Google Sheets last modified time
    const sheetModifiedTime = new Date(await getSheetLastModifiedTime(auth));
  
    // Get the latest modification time from PostgreSQL
    const client = await pool.connect();
    const result = await client.query('SELECT MAX(last_modified) as last_modified FROM my_table');
    client.release();
    const dbModifiedTime = new Date(result.rows[0].last_modified || 0);
  
    return { sheetModifiedTime, dbModifiedTime };
};

// Main function to sync data based on last write (last-write-wins approach)
export const syncDataBidirectionally = async () => {
    const auth = await authorize();
    const { sheetModifiedTime, dbModifiedTime } = await getLastModifiedTimes(auth);
  
    if (sheetModifiedTime > dbModifiedTime) {
      // Sheets data is newer, sync to DB
      await syncSheetToDB();
      console.log('Changes detected in Google Sheets. Data synced to PostgreSQL.');
    } else if (dbModifiedTime > sheetModifiedTime) {
      // DB data is newer, sync to Sheets
      await syncDBToSheet();
      console.log('Changes detected in PostgreSQL. Data synced to Google Sheets.');
    } else {
      console.log('No new changes detected in either Google Sheets or DB');
    }
  };
