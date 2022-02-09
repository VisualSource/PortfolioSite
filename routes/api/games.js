const express = require('express');
const createHttpError = require("http-errors");
const { checkSchema } = require("express-validator");

const { game2048Schema } = require("../../schemas");
const { checkJwt } = require("../../middleware/jwt_auth");
const { apiLimiter } = require("../../middleware/rate_limiter");


const { Game2048 } = require("../../models");
const { apiResponse, validate } = require("../../shared/utils");

const games = express.Router();

/* 2048 API */

const app_2048 = express.Router();

app_2048.get("/top3", async (req,res,next)=>{
    try {
        let data = await Game2048.findAll({  
            limit: 3,
            order: [
                ["score",'DESC']
            ]
        });
        res.json(data);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});
app_2048.get("/top10",async(req,res,next)=>{
    try {
        let data = await Game2048.findAll({  
            limit: 10,
            order: [
                ["score",'DESC']
            ]
        });
        res.json(data);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});
app_2048.get("/user/:id",  checkSchema({ id: { in: "params", isString: true } }),  async(req,res,next)=>{
    try {
        let data = await Game2048.findByPk(req.params.id);

        if (data !== null) return res.json(data);

       next(createHttpError.NotFound("Failed to find user"));
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});
app_2048.post("/update", apiLimiter, checkJwt, game2048Schema, async (req,res,next)=>{
    try {
        const error = validate(req);
        if(error !== null) return next(error);

        await Game2048.upsert({
            ...req.body,
            date: new Date()
        },{
            where: {
                user: req.auth.payload.sub
            }
        });

        apiResponse(res,"Accepted",202);
    } catch (error) {
       next(createHttpError.InternalServerError(error));
    }
});

/* 2048 API END */

games.use("/2048",app_2048);

module.exports = games;