const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = process.env.PORT;
app.use(bodyparser.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("hello");
  res.end();
});
app.listen(port, () => {
  console.log("server starting on " + port);
});
