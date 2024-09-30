const fs = require("fs");
const { encrypt, decrypt } = require("./encryption");
const path = require("path");

const dbFilePath = path.join(__dirname, "db.json");

// Function to add an entry to the database
function addEntry(name, password) {
  const encryptedPassword = encrypt(password);
  const entry = { name, password: encryptedPassword };

  fs.readFile(dbFilePath, "utf8", (readErr, data) => {
    let db = [];
    if (!readErr) {
      try {
        db = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing the database file:", parseErr);
      }
    }

    db.push(entry);

    fs.writeFile(
      dbFilePath,
      JSON.stringify(db, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to the database file:", writeErr);
        } else {
          console.log("Entry added successfully!");
        }
      }
    );
  });
}

// Function to get all entries from the database
function getEntries(callback) {
  fs.readFile(dbFilePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        callback([]);
      } else {
        console.error("Error reading the database file:", err);
        callback(null, err);
      }
      return;
    }

    let db;
    try {
      db = JSON.parse(data);
      db = db.map((entry) => ({
        ...entry,
        password: decrypt(entry.password),
      }));
      callback(db);
    } catch (parseErr) {
      console.error("Error parsing the database file:", parseErr);
      callback(null, parseErr);
    }
  });
}

// Function to delete an entry by name
function deleteEntry(name, callback) {
  fs.readFile(dbFilePath, "utf8", (readErr, data) => {
    if (readErr) {
      console.error("Error reading the database file:", readErr);
      callback(false, readErr);
      return;
    }

    let db;
    try {
      db = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing the database file:", parseErr);
      callback(false, parseErr);
      return;
    }

    const index = db.findIndex((entry) => entry.name === name);
    if (index === -1) {
      callback(false, "Entry not found");
      return;
    }

    db.splice(index, 1);

    fs.writeFile(
      dbFilePath,
      JSON.stringify(db, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to the database file:", writeErr);
          callback(false, writeErr);
        } else {
          console.log("Entry deleted successfully!");
          callback(true);
        }
      }
    );
  });
}

module.exports = {
  addEntry,
  getEntries,
  deleteEntry,
};
