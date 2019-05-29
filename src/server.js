const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = process.env.PORT;
app.use(bodyparser.json());
app.use(express.static("public"));

app.use("*", (req, res)=> {
  res.end(); 
});
app.listen(port, () => {
  console.log(`Starting server on ${port}`);
});
