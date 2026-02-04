const express = require("express");
const path = require("path");

const app = express();

// Serve static files from "public" folder
app.use(express.static("public"));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
