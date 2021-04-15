const compression = require("compression");
const express = require("express");
const langemang = require("@tusent.io/langemang");
const minifyHTML = require("express-minify-html-2");
const minifyStatic = require("express-minify");
const path = require("path");

const routes = require("./routes");

const app = express();
app.set("view engine", "ejs");

app.use(compression());
app.use(minifyHTML({ override: false }));
app.use(
    langemang({
        filePath: path.resolve(__dirname, "lang"),
        defaultLanguage: "en",
    })
);

app.get("/", (_req, res) => res.redirect("/browse"));

// Use routes
routes.forEach((route) => app.use(route));

app.use(minifyStatic({ cache: "cache" }));
app.use("/static", express.static("browser/dist"));
app.use("/static", express.static("static"));

module.exports = app;
