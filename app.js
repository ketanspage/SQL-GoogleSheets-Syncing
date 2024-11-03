import express from 'express';
import { pool } from './config/db.js';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import { syncDataBidirectionally } from './services/syncServices.js';
const app = express();
app.use(bodyParser.json());

// manual CRUD Endpoints
app.post('/create', async (req, res) => {
  const { column1, column2, column3, column4 } = req.body;
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO my_table (column1, column2, column3, column4, last_modified) VALUES ($1, $2, $3, $4, NOW()) RETURNING *';
    const result = await client.query(query, [column1, column2, column3, column4]);
    await syncDataBidirectionally();  // Trigger sync after creation
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

app.get('/read', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM my_table');
    res.json(result.rows);
  } finally {
    client.release();
  }
});

app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { column1, column2, column3, column4 } = req.body;
  const client = await pool.connect();
  try {
    const query = 'UPDATE my_table SET column1 = $1, column2 = $2, column3 = $3, column4 = $4, last_modified = NOW() WHERE id = $5 RETURNING *';
    const result = await client.query(query, [column1, column2, column3, column4, id]);
    await syncDataBidirectionally();  // Trigger sync after updating
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const query = 'DELETE FROM my_table WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);
    await syncDataBidirectionally();  // Trigger sync after deleting
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

// Sync both ways manually
app.get('/sync', async (req, res) => {
  try {
    await syncDataBidirectionally();  // Sync both ways
    res.send('Synced both ways successfully.');
  } catch (error) {
    res.status(500).send('Error syncing: ' + error.message);
  }
});

// Cron Job to Sync Every Minute
cron.schedule('* * * * *', async () => {
  try {
    await syncDataBidirectionally();
    console.log('Cron job synced Google Sheets to DB and vice versa');
  } catch (error) {
    console.error('Cron job error syncing:', error.message);
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
