const { MongoClient } = require('mongodb'); 
/**
 *
 *
 * @return {import("mongodb").Db} 
 */
async function connect(dbname) {
    const client = new MongoClient(process.env.MONGO_DATABASE);

    await client.connect();

    return client.db(dbname);
}


module.exports = {
    connect
};