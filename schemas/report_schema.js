/**
 * @type {import("express-validator").Schema}
 */
module.exports = {
    product: {
        in: "body",
        isAscii: true,
        isString: true,
    },
    product_version: {
        in: "body",
        isSemVer: true
    },
    browser: {
        in: "body",
        isString: true,
    },
    os: {
        in: "body",
        isString: true
    },
    sub: {
        in: "body",
        isString: true,
    },
    title: {
        in: "body",
        isString: true,
    },
    description: {
        in: "body",
        isString: true,
        optional: { options: { checkFalsy: false} },
    },
    notes: {
        in: "body",
        optional: { options: { checkFalsy: false } },
        isString: true
    }
};