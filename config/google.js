//google apis setup
import { google } from 'googleapis';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();


export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.metadata.readonly'];
export const SHEET_ID = process.env.SHEET_ID;

export const authorize = async () => {
  const credentials = JSON.parse(await fs.readFile('credentials.json', 'utf8'));
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'), 
    SCOPES
  );
  await auth.authorize();

  return auth;
};
