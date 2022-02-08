const express = require('express');
const { readJson, asApiError } = require("../../shared/utils");
const path = require("path");
const content = express.Router();

const db = path.join(__dirname, "../../private/db.json");

content.get("/", async (req,res,next)=>{
    try {
        let data = await readJson(db);
    res.json(data);
    } catch (error) {
        next(error);
    }
});

content.get("/games", async (req,res,next)=>{
    try {
        let data = await readJson(db);
        res.json(data["games"]);
    } catch (error) {
        next(asApiError(error));
    }
});

content.get("/projects", async (req,res,next)=>{
    try {
        let data = await readJson(db).catch(next);
        res.json(data["projects"]);
    } catch (error) {
        next(error);
    }
});

content.get("/version", async (req,res,next)=>{
    try {
        let data = await readJson(db).catch(next);
        res.json(data["version"]);
    } catch (error) {
        next(error);
    }
});

module.exports = content;