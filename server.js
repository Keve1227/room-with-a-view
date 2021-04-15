require("dotenv").config();

const path = require("path");

global.__static = path.resolve(__dirname, "./static");
global.__views = path.resolve(__dirname, "./views");

const app = require("./app");

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}.`);
});
