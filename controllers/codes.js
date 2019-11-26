
/**
 * 2xx Succes
 *  200 Ok
 *  202 Accepted
 *  204 No Content
 * 4xx Client Errors
 *  400 Bad Request
 *  401 unauthorized
 *  403 Forbidden
 *  404 Not Found
 *  405 Method not allowed
 *  406 Not Acceptable
 *  409 Conflict
 *  410 Gone
 *  499 Client Closed Request
 * 5xx Server Error
 *  500 internal server error
 *  501 not implemented
 *  503 service unavalable
 *  524 A Timeout occurred
 *  520 unknown Error
 *  522 connection Timed out
 */
const http = {
    succes: {
        ok: 200,
        accepted: 202,
        no_content: 204
    },
    client_error:{
        bad_request: 400,
        unauthorized: 401,
        forbidden: 403,
        not_found: 404,
        method_not_allowed: 405,
        not_acceptable: 406,
        conflict: 409,
        gone: 410,
        client_closed_request: 499
    },
    server_error:{
        internal_server_error: 500,
        not_implemented: 501,
        service_unavalable: 503,
        timeout_occurred: 524,
        unknown_error: 520,
        connection_timed_out: 522
    }
}
 /*
 * Websocket status codes
 *  1000 Normal Closure
 *  1001 Going Away
 *  1002 Protocol Error
 *  1003 Unsupported Data
 *  1005 No status Received
 *  1006 Abnormal Closure
 *  1007 Invalid frame payload data
 *  1008 Policy Violation
 *  1009 Message too big
 *  1010 Missing Extension
 *  1011 Internal Error
 *  1012 Service Restart
 *  1013 Try Again Later
 */
 const websocket = {
     noraml_closure: 1000,
     going_away: 1001,
     protocol_error: 1002,
     unsupported_data:1003,
     no_status_received: 1005,
     abnormal_closure: 1006,
     invaild_frame_playload: 1007,
     policy_violation:1008,
     message_too_big: 1009,
     missing_extension: 1010,
     internal_error: 1011,
     service_restart: 1012,
     try_again_later: 1013
 }

 module.exports = {websocket, http};