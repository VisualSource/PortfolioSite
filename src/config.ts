import * as knex from 'knex';
export const server_version = "3.0.2";
export const succes_code = {
        ok: 200,
        accepted: 202,
        no_content: 204
}
export const client_error_code ={
        bad_request: 400,
        unauthorized: 401,
        forbidden: 403,
        not_found: 404,
        method_not_allowed: 405,
        not_acceptable: 406,
        conflict: 409,
        gone: 410,
        client_closed_request: 499
}
export const server_error_code = {
        internal_server_error: 500,
        not_implemented: 501,
        service_unavalable: 503,
        timeout_occurred: 524,
        unknown_error: 520,
        connection_timed_out: 522
}


const DATABASE_URL: string = process.env.DATABASE_URL;
const production: boolean = process.env.production === "true" ? true : false;
export let database: knex;
if(production){
    database = knex({
        client: "pg",
        connection: {
            connectionString: DATABASE_URL,
            ssl: true
        }
    })
}else{
    database = knex({
        client:"pg",
        connection: {
          host: "127.0.0.1",
          user:"postgres",
          password:"root",
          database:"visualsource",
          port: 5433
        },
        debug: false,
        asyncStackTraces: false
      })
}

