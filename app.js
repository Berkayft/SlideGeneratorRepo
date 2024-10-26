const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const model = require("./service/google");
const passport = require('passport');
const session = require('express-session');
require("./service/authService");

const slideRoutes = require("./routes/slide");
require("dotenv").config();

const indexRoutes = require("./routes/index");
const chatRoutes = require("./routes/chat");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/authRoute");



app = express();




app.set('view engine', 'ejs');
app.set("views", "templates");



app.use(express.json()); // JSON verilerini parse eder
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'MysecretKey',  // Bu anahtarı güvenli bir şekilde saklayın
    resave: false,            // Her request'te oturumu yeniden kaydetme
    saveUninitialized: false  // Oturum verisi yoksa yeni bir oturum oluşturma
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/" , indexRoutes);
app.use("/chat", chatRoutes);
app.use("/profile" , profileRoutes);
app.use("/", slideRoutes);
app.use("/" , authRoutes);


app.get("/about", (req , res) => {
    res.render("about");
})

app.listen(process.env.PORT , (req,res) => {
    console.log("hello");
})


