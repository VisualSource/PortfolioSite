/**
 * @type {import("express-validator").Schema}
 */
 module.exports = {
    id: { 
        in: "params", 
        isInt: true, 
        toInt: true
    },
    name: {
        in: "body",
        isString: true,
        optional: true
    }, 
    description: {
        in: "body",
        isString: true,
        optional: true
    }, 
    type: {
        in: "body",
        custom: {
            options: value => {
                return ["datapack","resourcepack","mod","plugin"].includes(value);
            }
        },
        optional: true
    }, 
    state: {
        in: "body",
        custom: {
            options: value => {
                return ["active","admited","rejected","removed"].includes(value);
            }
        },
        optional: true
    }, 
    required: {
        in: "body",
        isArray: "number",
        customSanitizer: {
            options: (value) => JSON.stringify(value)
        },
        optional: true
    }, 
    images: {
        in: "body",
        isArray: true,
        customSanitizer: {
            options: (value) => JSON.stringify(value)
        },
        optional: true
    }, 
    links: {
        in: "body",
        isArray: true,
        customSanitizer: {
            options: (value) => JSON.stringify(value)
        },
        optional: true
    }, 
    icon: {
        in: "body",
        isURL: true,
        optional: { options: { nullable: true } }
    }
 }