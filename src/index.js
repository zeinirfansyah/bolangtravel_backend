// import express
const express = require("express");
const {cors} = require("./middleware/app");
const routes = require("./routes/routes");
const authRouter = require("./routes/auth.routes");
const bodyParser = require("body-parser");

// init express app
const app = express();

// init server
app.listen(3000, () => console.log("Listening on port 3000"));

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    process.exit(1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);
app.use(express.static('public'));

app.use("/api/auth", authRouter)
app.use("/api/", routes)