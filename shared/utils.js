const fs = require("fs");

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

/**
 *
 *
 * @param {Error} error
 * @param {number} [status=500]
 * @return {*} 
 */
function asApiError(error, status = 500) {
    return {
        code: error.code,
        status
    }
}


module.exports = {
    readJson,
    asApiError
};