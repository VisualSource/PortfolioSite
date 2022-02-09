const express = require('express');
const { checkSchema } = require("express-validator");
const createHttpError = require("http-errors");
const mcping = require('mcping-js')
const path = require("path");

const { checkJwt } = require("../../middleware/jwt_auth");
const { apiLimiter } = require("../../middleware/rate_limiter");
const { mcResourceSchema, mcEditSchema } = require("../../schemas");

const { mcs_resources, Sequelize } = require("../../models");
const { readJson, apiResponse, validate } = require("../../shared/utils");

const minecraft = express.Router();
const db = path.join(__dirname,"../../private/minecraft.json");

const sortBy = checkSchema({ 
    sort: { 
        in: "params",
        isString: true,
        custom: {
            options: value => {
                return ["active","admited","removed","rejected"].includes(value)
            }
        }
    }
});

async function query(req, res, next, params = {}) {
    try {
        const error = validate(req);
        if(error !== null) return next(error);

        const data = await mcs_resources.findAll(params);
        res.json(data);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
}

minecraft.get("/updated", async (req,res)=>{
    try {
        const data = await readJson(db);
        res.json(data["updated"]);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

minecraft.get("/maps", async (req,res,next)=>{
    try {
        const data = await readJson(db);
        res.json(data["maps"]);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

minecraft.get("/query", apiLimiter, async (req,res,next)=>{
    try {
        let query = await new Promise((ok,error)=>{
            const server = new mcping.MinecraftServer(process.env.MC_SERVER_HOST, 25565);
            //https://wiki.vg/Protocol_version_numbers
            server.ping(5000,Number(process.env.MC_SERVER_PROTOCAL), (err,data)=>{
                if(err) return error(err);
                ok(data);
            });
        });

        let users = [];

        query.players?.sample.forEach((value)=>{
            users.push(value.name);
        });

        res.json({
            description: query.description,
            favicon: query?.favicon ?? "",
            players: {
                max: query.players.max,
                online: query.players.online,
                users
            },
            version: query.version,
            modinfo: query?.modinfo ?? {}

        });
    } catch (error) {
        res.json({
            description: "",
            favicon: "",
            players: {
                max: 0,
                online: 0,
                users: []
            },
            version: {}
        });
    }
});

minecraft.get("/datapacks", async (req,res,next)=>{
    await query(req,res,next,{ 
        where: { type: "datapack" } 
    });
});

minecraft.get("/datapacks/:sort", sortBy, async (req,res,next)=>{
    console.log(req.params.sort);
    await query(req,res,next, { 
        where: {
            type: "datapack",
            [Sequelize.Op.and]: [   
                { state: req.params.sort }
            ]
        } 
    });
});

minecraft.get("/all",async (req,res,next)=>{
    await query(req,res,next,{},false);
});

minecraft.get("/all/:sort", sortBy, async (req,res,next)=>{
    await query(req,res,next,{
        where: {
            state: req.params.sort 
        }
    });
});

minecraft.get("/mods",async (req,res,next)=>{
    await query(req,res,next,{
       where: {
            type: "mod"
       }
    });
});

minecraft.get("/mods/:sort", sortBy, async (req,res,next)=>{
    await query(req,res,next,{
        where: {
            type: "mod",
            [Sequelize.Op.and]: [   
                { state: req.params.sort }
            ]
        }
    });
});

minecraft.get("/resourcepacks",async (req,res,next)=>{
    await query(req,res,next,{
        where: {
            type: "resourcepack"
        }
    });
});

minecraft.get("/resourcepacks/:sort", sortBy, async (req,res,next)=>{
    await query(req,res,next,{
        where: {
            type: "resourcepack",
            [Sequelize.Op.and]: [   
                { state: req.params.sort }
            ]
        }
    });
});

minecraft.get("/plugins",async (req,res,next)=>{
    await query(req,res,next,{
        where: {
            type: "plugin"
        }
    });
});

minecraft.get("/plugins/:sort", sortBy, async (req,res,next)=>{
    await query(req,res,next,{
        where: {
            type: "plugin",
            [Sequelize.Op.and]: [   
                { state: req.params.sort }
            ]
        }
    });
});

/* Admin routes */

minecraft.post("/resource", apiLimiter, mcResourceSchema, checkJwt, async (req,res,next)=>{
    try {
        const error = validate(req);
        if(error !== null) return next(error);

        const items = await mcs_resources.count();
        const {name,description,type,state,required,images,links,icon} = req.body;
        await mcs_resources.create({
            name,
            description,
            type,
            state,
            required,
            images,
            links,
            icon: icon ?? null,
            added: new Date(),
            id: items + 1
        });

        apiResponse(res,"Created",201);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

minecraft.patch("/resource/update/:id", apiLimiter, checkJwt, mcEditSchema, async (req,res,next)=>{
    try {
        const error = validate(req);
        if(error !== null) return next(error);

        await mcs_resources.update(req.body,{
            where: {
                id: req.params.id
            }
        });

        apiResponse(res,"Ok");
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

minecraft.delete("/resource/:id", apiLimiter, checkJwt, checkSchema({ id: { in: "params", isInt: true, toInt: true },  }), async (req,res,next)=>{
    try {
        const error = validate(req);
        if(error !== null) return next(error);

        await mcs_resources.destroy({
            where: {
                id: req.params.id
            }
        });

        apiResponse(res,"Ok");
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

module.exports = minecraft;