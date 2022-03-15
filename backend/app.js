// Imports
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require('helmet');

const config = require("./config");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

mongoose
    .connect(
        `mongodb+srv://${config.dbUser}:${config.dbPassword}@cluster0.bo3hk.mongodb.net/${config.dbName}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// En tête
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use(express.json());

// Route des images
app.use("/images", express.static(path.join(__dirname, "images")));

// Route d'autorisation
app.use("/api/auth", userRoutes);

// Route des sauces
app.use("/api/sauces", sauceRoutes);

module.exports = app;
