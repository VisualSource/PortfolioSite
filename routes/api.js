const express = require('express');
const createHttpError = require("http-errors");

const { checkJwt } = require("../middleware/jwt_auth");
const { apiLimiter } = require('../middleware/rate_limiter');
const { reportSchema } = require("../schemas");

const minecraftRouter = require("./api/minecraft");
const usersRouter = require("./api/users");
const contentRouter = require("./api/content");
const gamesRouter = require("./api/games");

const { apiResponse, validate } = require("../shared/utils");
const { connect } = require("../shared/mongo");

const api = express.Router();

api.use("/minecraft",minecraftRouter);
api.use("/users",usersRouter);
api.use("/content",contentRouter);
api.use("/games",gamesRouter);

api.post("/report", apiLimiter, checkJwt, reportSchema, async ( req, res, next ) => { 
    try {
        const errors = validate(req);
        if(errors !== null) return next(errors);
        if(req.auth.payload.sub !== req.body.sub) return next(createHttpError.Unauthorized());

        const db = await connect();

        // check if their is space in database
        const stats = await db.stats();

        // max stroage = 512 MB
        if((stats.storageSize * 0.000001) > 509) return next(createHttpError.InsufficientStorage());

        const reports = db.collection("reports");
    
        await reports.insertOne({
            ...req.body,
            created: new Date().toUTCString()
        });

        apiResponse(res,"Accepted",202);
    } catch (error) {
        next(createHttpError.InternalServerError(error));   
    }
});

api.all("*",(req,res,next)=>{
    next(createHttpError.NotFound(`${req.path} is invailed`));
});

api.use((err,req,res,next)=>{
    res.status(err.status).json({
        status: err.statusCode ?? err.status,
        message: err.displayMsg ?? err.code ?? err.message
    }); 
});

module.exports = api;