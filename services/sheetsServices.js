import { google } from "googleapis";
import { SHEET_ID } from "../config/google.js";
// Get data from Google Sheets
export const getSheetData = async (auth) => {
    const sheets = google.sheets({ version: 'v4', auth });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1:D',
    });
    return result.data.values;
  };
  
// Update Google Sheets with data from PostgreSQL
export const updateSheetData = async (auth, data) => {
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      resource: { values: data },
    });
  };
  
// Get last modified time of Google Sheets using Google Drive API
export const getSheetLastModifiedTime = async (auth) => {
    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.get({
      fileId: SHEET_ID,
      fields: 'modifiedTime',
    });
    return response.data.modifiedTime;
  };