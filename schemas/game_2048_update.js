/**
 * @type {import("express-validator").Schema}
*/
module.exports = { 
    user: {
        in: "body",
        isString: true,
        errorMessage: "Unauthorized",
        custom: {
            options: (value, { req }) => value === req.auth.payload.sub
        }
    },
    username: { 
        in: "body",
        isString: true
    },
    score: {
        in: "body",
        isInt: true
    }
    
}