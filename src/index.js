// import express
const express = require("express");
const {cors} = require("./middleware/app");
const routes = require("./routes/routes");


// init express app
const app = express();

// init server
app.listen(3000, () => console.log("Listening on port 3000"));

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    process.exit(1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

app.use("/api/", routes)