const express = require('express');
const { Game2048 } = require("../../models");
const { checkJwt } = require("../../middleware/jwt_auth");
const { apiLimiter } = require("../../middleware/rate_limiter");
const { asApiError } = require("../../shared/utils");

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
        next(asApiError(error));
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
        next(asApiError(error));
    }
});
app_2048.get("/user/:id",async(req,res,next)=>{
    try {
        let data = await Game2048.findAll({  
            where: {
                user: req.params.id
            }
        });

        if (data.length > 0) {
            res.json(data[0]);
        }

        res.status(400).json({
            status: 400,
            msg: "Invaild user sub"
        })
    } catch (error) {
        next(asApiError(error));
    }
});
app_2048.post("/update",apiLimiter,checkJwt, async (req,res,next)=>{
    try {
        if(req.auth.payload.sub !== req.body.user) {
            return res.status(401).json({
                status: 401,
                msg: "Unauthorized"
            });
        }

        await Game2048.upsert({
            ...req.body,
            date: new Date()
        },{
            where: {
                user: req.body.user
            }
        });

        res.sendStatus(202);
    } catch (error) {
        next(asApiError(error));
    }
});

/* 2048 API END */

games.use("/2048",app_2048);

module.exports = games;