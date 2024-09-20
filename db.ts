//require("dotenv").config();
import knex from "knex";

const knexConfig = {
    client: "pg",
    connection: {
        host: "localhost",
        port: 9999,
        user: "postgres",
        password: "",
    },
    pool: {
        max: 10,
        min: 0,
    },
};

export default knex(knexConfig);
