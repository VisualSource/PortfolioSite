const fs = require("fs");
const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");

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
    validate
};