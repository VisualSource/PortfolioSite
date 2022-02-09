/**
 * @type {import("express-validator").Schema}
*/
module.exports = { 
    id: {
        in: "params",
        isString: true,
        errorMessage: "Unauthorized",
        custom: {
            options: (value, { req }) => value === req.auth.payload.sub
        }
    },
    picture: {
        in: "body",
        optional: {  options: { nullable: false } },
        isURL: true,
    },
    phone_number: {
        in: "body",
        optional: { options: { nullable: false } },
        isMobilePhone: true,
    },
    given_name: {
        in: "body",
        optional: { options: { nullable: false } },
        isString: true
    },
    family_name: {
        in: "body",
        optional: { options: { nullable: false } },
        isString: true
    },
    name: {
        in: "body",
        optional: { options: { nullable: false } },
        isString: true
    },
    nickname: {
        in: "body",
        optional: { options: { nullable: false } },
        isString: true
    },
    nickname: {
        in: "body",
        optional: { options: { nullable: false } },
        isString: true
    },
    metadata: {
        in: "body",
        optional: { options: { nullable: false } },
        isObject: true
    },
    connection: {
        in: "body",
        optional: { options: { nullable: false } },
        isString: true
    }
}