// server.js

const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Define the /repos endpoint
app.get("/repos", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.github.com/users/freeCodeCamp/repos"
    );
    const repos = response.data
      .filter((repo) => !repo.fork && repo.forks > 5)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        forks: repo.forks,
      }));
    res.setHeader("Content-Type", "application/json");
    res.json(repos);
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
