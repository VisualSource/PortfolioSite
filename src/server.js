const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = process.env.PORT | 8080;
app.use(bodyparser.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send();
});
app.listen(port, () => {
  console.log("server starting on " + port);
});
