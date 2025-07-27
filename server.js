const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle all routes by serving index.html (SPA routing)
app.get("*", (req, res) => {
  // Check if the requested path is a static file
  const filePath = path.join(__dirname, "dist", req.path);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    // If it's a static file, serve it
    res.sendFile(filePath);
  } else {
    // If it's not a static file, serve index.html for SPA routing
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, "dist")}`);
});
