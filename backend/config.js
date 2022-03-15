require("dotenv").config();

module.exports = {
    appPort: process.env.APP_PORT,

    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,

    userToken: process.env.USER_TOKEN,
};
