const path = require("path");
const express = require("express");
const app = express();
const publicPath = path.join(__dirname, "..", "build");
const port = process.env.PORT || 3000;
const options = {
  setHeaders: (res) => {
    res.set('Cross-Origin-Embedder-Policy', 'require-corp'),
    res.set('Cross-Origin-Opener-Policy', 'same-origin')
  }
};
app.use(express.static(publicPath, options));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
app.listen(port, () => {
  console.log("Server is up!");
});
