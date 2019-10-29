const APP_NAMESPACE_ID = "c42d2542-c807-4eff-86fe-4474666c8078";
const APP_NAMESPACE_NAME = "POLYTOPIAGAMEUUID";


const config = {
    service: "autho",
    urlAuthorize: "https://visualsource.auth0.com/authorize",
    urlToken: "https://visualsource.auth0.com/oauth/token",
    urlJWKS:"https://visualsource.auth0.com/.well-known/jwks.json",
    client_id:"lMZtNGOs7ZZijZT2Xk0HChwHvyqRSHJX",
    client_secret: "Cx1Cega4KC2qt7cb_-xMGykMQ3IBFkTH_ilqjFqzY6c//visualsource.auth0.com/.well-know/jwks.jsonDt7_QUZX0s--3Fw3BCn-I",
    redirect_url:"https://visualsource.000webhostapp.com",
     pathExempt: [
    '/',
  ],
}




module.exports = {APP_NAMESPACE_ID,APP_NAMESPACE_NAME, config};