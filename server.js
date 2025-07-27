const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Serve the logo.svg file from root
app.get("/logo.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "logo.svg"));
});

// Handle all routes by serving index.html (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, "dist")}`);
});
