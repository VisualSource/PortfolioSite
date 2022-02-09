const express = require('express');
const { checkSchema } = require('express-validator');
const axios = require('axios').default;
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const createHttpError = require("http-errors");

const { checkJwt } = require("../../middleware/jwt_auth");
const { apiLimiter } = require("../../middleware/rate_limiter");
const { auth0UserSchema } = require("../../schemas");

const { readJson, apiResponse, validate } = require("../../shared/utils");

const users = express.Router();

const cacheFile = path.join(__dirname,"../../private/cache.json");

async function fetchToken(){
    const res = await axios.post("https://visualsource.auth0.com/oauth/token",{
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: "https://visualsource.auth0.com/api/v2/",
        grant_type: "client_credentials"
    },{
        responseType: 'json',
        transformResponse: [function (data) {
           if(typeof data === "string") {
               return JSON.parse(data);
           }
            return data;
        }]
    });

    if(res.status !== 200) throw new Error("Failed to get authorization token");

    await new Promise((ok,error)=>{
        fs.writeFile(cacheFile,JSON.stringify({
            token: res.data["access_token"],
            fetched: moment().format("YYYY-MM-DD hh:mm:ss")
        }),(err)=>{
            if(err) return error(err);
            ok(0);
        });
    });

    return res.data["access_token"];
}

async function getManagmentToken(){
    const fileExists = await new Promise((ok,error)=>{
        fs.stat(cacheFile,(err,stats)=>{
            if(err) return ok(false);
            ok(stats.isFile());
        });
    });

    if(!fileExists) return await fetchToken();
    
    const cache = await readJson(cacheFile);

    const lastFetched = cache["fetched"];

    let from = moment(lastFetched,"YYYY-MM-DD hh:mm:ss");
    
    if(moment.duration(moment().diff(from)).get("seconds") < 36000) return cache["token"];

    return await fetchToken();
}

users.get("/get/:id", apiLimiter, checkSchema({ id: { in: "params", isString: true } }), async (req,res,next)=>{
    try {
        const error = validate(req);
        if(error !== null) return next(error);

        let token = await getManagmentToken();

        const response = await axios.get(`https://visualsource.auth0.com/api/v2/users/${req.params.id}?fields=name%2Cuser_id%2Cpicture%2Cuser_metadata&include_fies=true`,{
            headers: {
                authorization: `Bearer ${token}`
            },
            responseType: 'json',
            transformResponse: [function (data) {
                if(typeof data === "string") return JSON.parse(data);
                return data;
            }]
        });

        if(response.status === 200) return res.json(response.data);

        apiResponse(res,response.statusText,response.status);
    } catch(error) {
        next(createHttpError.InternalServerError(error));
    }
});

users.patch("/update/:id", apiLimiter, checkJwt, auth0UserSchema, async( req, res, next )=>{
    try {
        const error = validate(req);
        if(error !== null) return next(error);

        let token = await getManagmentToken();

        let response = await axios.patch(`https://visualsource.auth0.com/api/v2/users/${req.auth.payload.sub}`,req.body,{
            headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
            }
        });

        apiResponse(res,response.statusText,response.status);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

module.exports = users;