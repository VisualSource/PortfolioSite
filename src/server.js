const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = process.env.PORT;
const users = {
  user : [{ name: Collin, cId: "435k435", icon: "fav.png"}]
}
app.use(bodyparser.json());
app.use(express.static("public"));
app.get('/profile/:id',(req,res)=>{
    res.json();
});
app.get("*", (req, res)=> {
  res.end(); 
});
app.listen(port, () => {
  console.log(`Starting server on ${port}`);
});
