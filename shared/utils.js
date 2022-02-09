const fs = require("fs");
const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const { QueryTypes } = require('sequelize');

const { sequelize } = require("../models");


async function vaildCount(){
    const query = "SELECT count_rows(table_schema,table_name) from information_schema.tables where table_schema not in ('pg_catalog', 'information_schema') and table_type='BASE TABLE'";
    const count = await sequelize.query(query,{ type: QueryTypes.SELECT });

    let overall = 0;
    for(const a of count){
        overall += a.count_rows;
    }

    return overall < 9998;
}

/**
 * @param {string} file
 * @return {*} 
 */
async function readJson(file) {
    return new Promise((ok,error)=>{
        fs.readFile(file, { encoding: "utf8" }, (err, data)=>{
            if (err) {
                error(err);
                return;
            }
            ok(JSON.parse(data));
        });
    });
}


function validate(req) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return createHttpError.BadRequest(errors);
    return null;
}

/**
 * 
 * @param {*} res 
 * @param {string} msg 
 * @param {number} [status=200] 
 */
function apiResponse(res,message, status = 200) {
    return res.status(status).json({
        status,
        message
    });
}


module.exports = {
    readJson,
    apiResponse,
    validate,
    vaildCount
};