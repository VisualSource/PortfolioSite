const { checkSchema } = require('express-validator');
const report_schema = require("./report_schema");
const auth0_user_schema = require("./auth0_user_schema");
const mc_resource = require("./mc_resource");
const mcr_edit = require("./mcr_edit");
const game_2048_update = require("./game_2048_update");

module.exports = {
    reportSchema: checkSchema(report_schema),
    auth0UserSchema: checkSchema(auth0_user_schema),
    mcResourceSchema: checkSchema(mc_resource),
    mcEditSchema: checkSchema(mcr_edit),
    game2048Schema: checkSchema(game_2048_update)
}