const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'connection.db');
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/');
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET /restakers
app.get('/restakers', async (req, res) => {
  const getRestakersQuery = `
    SELECT 
      address, 
      amount_restaked, 
      validator 
    FROM 
      restakers;
  `;
  const result = await db.all(getRestakersQuery);
  res.send(result);
});

// GET /validators
app.get('/validators', async (req, res) => {
  const getValidatorsQuery = `
    SELECT 
      operator, 
      total_delegated, 
      slash_history, 
      status 
    FROM 
      validators;
  `;
  const result = await db.all(getValidatorsQuery);
  res.send(result);
});

// GET /rewards/:address
app.get('/rewards/:address', async (req, res) => {
  const getRewardsQuery = `
    SELECT 
      address, 
      total_rewards, 
      validator_breakdown, 
      timestamps 
    FROM 
      rewards 
    WHERE 
      address = ?;
  `;
  try {
    const result = await db.all(getRewardsQuery, [req.params.address]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No rewards found for this address' });
    }
    res.json(result[0]);  // Assuming one row per address
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
