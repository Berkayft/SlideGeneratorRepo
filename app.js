const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const model = require("./service/google");
const slideRoutes = require("./routes/slide");
require("dotenv").config();

const indexRoutes = require("./routes/index");
const chatRoutes = require("./routes/chat");
const { User , Slide } = require("./models/Model");



app = express();


app.set('view engine', 'ejs');
app.set("views", "templates");

app.use(bodyParser.urlencoded({ extended: false }));


app.use("/" , indexRoutes);
app.use("/chat", chatRoutes);
app.use("/", slideRoutes);

app.get("/about", (req , res) => {
    res.render("about");
})

app.listen(process.env.PORT , (req,res) => {
    console.log("hello");
})


