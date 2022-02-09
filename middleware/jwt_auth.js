const { auth, claimCheck } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
    issuer: process.env.AUTH0_ISS,
    audience: [
        "https://visualsource.auth0.com/api/v2/",
        "https://visualsource.auth0.com/userinfo"
    ],
    jwksUri: "https://visualsource.auth0.com/.well-known/jwks.json",
    tokenSigningAlg: "RS256"
});

module.exports = {
    checkJwt,
    claimCheck
}