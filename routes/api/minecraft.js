const express = require('express');
const mcping = require('mcping-js')
const { mcs_resources, Sequelize } = require("../../models");
const { checkJwt } = require("../../middleware/jwt_auth");
const { apiLimiter } = require("../../middleware/rate_limiter");
const { readJson, asApiError } = require("../../shared/utils");
const path = require("path");
const minecraft = express.Router();

const db = path.join(__dirname,"../../private/minecraft.json");

async function query(req, res, next, params = {}, sreach = true) {
    try {
        if(sreach && !["active","admited","removed","rejected"].includes(req.params.sort)) {
            return res.status(400).json({
                status: 400,
                msg: "Invaild param"
            });
        }
        const data = await mcs_resources.findAll(params);
        res.json(data);
    } catch (error) {
        next(asApiError(error));
    }
}

minecraft.get("/updated", async (req,res)=>{
    try {
        const data = await readJson(db);
        res.json(data["updated"]);
    } catch (error) {
        next(asApiError(error));
    }
});

minecraft.get("/maps", async (req,res,next)=>{
    try {
        const data = await readJson(db);
        res.json(data["maps"]);
    } catch (error) {
        next(asApiError(error));
    }
});

minecraft.get("/query", async (req,res,next)=>{
    try {
        let query = await new Promise((ok,error)=>{
            const server = new mcping.MinecraftServer(process.env.MC_SERVER_HOST, 25565);
            //https://wiki.vg/Protocol_version_numbers
            server.ping(5000,Number(process.env.MC_SERVER_PROTOCAL), (err,data)=>{
                if(err) {
                    error(err);
                    return;
                }
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
    },false);
});

minecraft.get("/datapacks/:sort", async (req,res,next)=>{
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

minecraft.get("/all/:sort", async (req,res,next)=>{
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
    },false);
});

minecraft.get("/mods/:sort",async (req,res,next)=>{
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
    },false);
});

minecraft.get("/resourcepacks/:sort",async (req,res,next)=>{
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
    },false);
});

minecraft.get("/plugins/:sort", async (req,res,next)=>{
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

minecraft.post("/resource", checkJwt, apiLimiter, async (req,res,next)=>{
    try {
        const items = await mcs_resources.count();
        const {name,description,type,state,required,images,links,icon} = req.body;
        await mcs_resources.create({
            name,
            description,
            type,
            state,
            required: JSON.stringify(required ?? []),
            images: JSON.stringify(images ?? []),
            links: JSON.stringify(links ?? []),
            icon: icon ?? null,
            added: new Date(),
            id: items + 1
        });
        res.sendStatus(201);
    } catch (error) {
        next(asApiError(error));
    }
});

minecraft.patch("/resource/update/:id", apiLimiter, checkJwt, async (req,res,next)=>{
    try {
        const id = Number(req.params.id);
        if(id === NaN) {
            throw {
                status: 400,
                msg: "Invaild param"
            }
        } 

        await mcs_resources.update(req.body,{
            where: {
                id
            }
        });

        res.sendStatus(200);
    } catch (error) {
        next(asApiError(error));
    }
});

minecraft.delete("/resource/:id", apiLimiter, checkJwt, async (req,res,next)=>{
    try {
        const id = Number(req.params.id);
        if(id === NaN) {
            throw {
                status: 400,
                msg: "Invaild param"
            }
        } 

        await mcs_resources.destroy({
            where: {
                id
            }
        });

        res.sendStatus(200);
    } catch (error) {
        next(asApiError(error));
    }
});

module.exports = minecraft;