const express = require('express');
const app = express();
const cors = require("cors");


app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.end();
});

app.get('*',(req,res)=>{
    res.end();
});


app.post('/user/:id',(req,res)=>{
    res.json({user: req.params});
});

module.exports = app;