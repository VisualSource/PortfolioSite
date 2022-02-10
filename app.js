const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require("helmet");
const cors = require('cors')
require("./models");

const indexRouter = require('./routes/index');
const apiRouter = require("./routes/api");

const app = express();

app.use(cors())
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/api",apiRouter);

app.get("*",(req,res)=>{
    res.sendFile(__dirname + "/public/index.html")
});

module.exports = app;