const { MongoClient } = require('mongodb'); 
/**
 *
 *
 * @return {import("mongodb").Db} 
 */
async function connect() {
    const client = new MongoClient(process.env.MONGO_DATABASE);

    await client.connect();

    return client.db("visualsource");
}


module.exports = {
    connect
};