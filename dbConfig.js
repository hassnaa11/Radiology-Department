require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";

const { Pool } = require("pg");

const connectionString = `postgresql://hospitaldb_owner:lQLSC73Hwzhu@ep-falling-butterfly-a5jd6u66-pooler.us-east-2.aws.neon.tech/hospitaldb?sslmode=require`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

module.exports = { pool };