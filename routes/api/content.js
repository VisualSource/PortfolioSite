const express = require('express');
const createHttpError = require("http-errors");
const { readJson } = require("../../shared/utils");
const path = require("path");
const content = express.Router();

const db = path.join(__dirname, "../../private/db.json");

content.get("/", async (req,res,next)=>{
    try {
        let data = await readJson(db);
        res.json(data);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

content.get("/games", async (req,res,next)=>{
    try {
        let data = await readJson(db);
        res.json(data["games"]);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

content.get("/projects", async (req,res,next)=>{
    try {
        let data = await readJson(db).catch(next);
        res.json(data["projects"]);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

content.get("/version", async (req,res,next)=>{
    try {
        let data = await readJson(db).catch(next);
        res.json(data["version"]);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

module.exports = content;