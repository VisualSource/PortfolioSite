const express = require('express');
const minecraftRouter = require("./api/minecraft");
const usersRouter = require("./api/users");
const contentRouter = require("./api/content");
const gamesRouter = require("./api/games");
const api = express.Router();
const { checkJwt } = require("../middleware/jwt_auth");

api.use("/minecraft",minecraftRouter);
api.use("/users",usersRouter);
api.use("/content",contentRouter);
api.use("/games",gamesRouter);

api.post("/report", checkJwt, async ( req, res, next ) => { 
    return res.status(202);
});

api.use((err,req,res,next)=>{
    res.status(err.status).json({
        status: err.status,
        msg: err.code
    }); 
});

module.exports = api;