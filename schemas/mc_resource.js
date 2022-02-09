/**
 * @type {import("express-validator").Schema}
 */
 module.exports = {
    name: {
        in: "body",
        isString: true,
    }, 
    description: {
        in: "body",
        isString: true
    }, 
    type: {
        in: "body",
        custom: {
            options: value => ["datapack","resourcepack","mod","plugin"].includes(value)
        },
    }, 
    state: {
        in: "body",
        custom: {
            options: value => ["active","admited","rejected","removed"].includes(value)
        },
    }, 
    required: {
        in: "body",
        isArray: true
    }, 
    images: {
        in: "body",
        isArray: true
    }, 
    links: {
        in: "body",
        isArray: true
    }, 
    icon: {
        in: "body",
        isURL: true,
        optional: { options: { nullable: true } }
    }
 }