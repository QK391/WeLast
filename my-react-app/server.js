// server.js

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define the /repos endpoint
app.get('/repos', async (req, res) => {
  try {
    // Fetch data from GitHub API
    const response = await axios.get('https://api.github.com/users/freeCodeCamp/repos');
    
    // Extract and filter the necessary data from the response
    const repos = response.data
      .filter(repo => !repo.fork && repo.forks > 5)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        forks: repo.forks,
        created_at: repo.created_at
      }));

    // Set the Content-Type header and send the aggregated data as JSON
    res.setHeader('Content-Type', 'application/json');
    res.json(repos);
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
