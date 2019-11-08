////const fs = require('fs')
// encode Buffer.from("Hello World").toString('base64')
// decode Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('utf8')

//let token = "JDJiJDEwJGhyU0w3bk96LzFybnIyMEV3ZmFydnVHc1p4Z1Y0d044WmtHWXBESnViNWlPb1FQMy5kT2lhOiQyYiQxMCRka28wWFlRWVVxQVdTUzhkL3FkSm5PTHo3STVGM3BiQm9qSC9uZy5tUWZUQnVQRFEzbFVlZQ==";
//const buffer = Buffer.from(token, 'base64').toString('utf8');
//fs.writeFile("decode.text",buffer,err=>{
//   if(err) throw err;
 //  console.log("DONE");
//});
const jwt = require('jsonwebtoken');

jwt.verify(token, '48133e08666f4a2a9ecdd1692f429fe3', function(err, decoded) {
   console.log(decoded) // bar
 });