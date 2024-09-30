const express = require("express");
const fs = require("fs");
const path = require("path");
const {
  addEntry,
  deleteEntry,
  getEntries,
} = require("./utils/databaseManager");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));

// Serve the HTML file
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "src/index.html");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send(data.toString());
    }
  });
});

// GET route to fetch all entries
app.get("/get-entries", (req, res) => {
  getEntries((entries, err) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(entries);
    }
  });
});

// POST route to add an entry
app.post("/add-entry", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).send("Name and password are required");
  }
  addEntry(name, password);
  res.status(201).send("Entry added successfully");
});

// POST route to delete an entry
app.post("/delete-entry", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Name is required");
  }
  deleteEntry(name, (success, err) => {
    if (success) {
      res.status(200).send("Entry deleted successfully");
    } else {
      res.status(404).send(err || "Entry not found");
    }
  });
});

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
