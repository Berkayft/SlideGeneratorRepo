const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const model = require("./service/google");
const passport = require('passport');
const session = require('express-session');
require("./service/authService");
const flash = require('connect-flash'); // Flash kütüphanesini ekleyin
const slideRoutes = require("./routes/slide");
require("dotenv").config();

const indexRoutes = require("./routes/index");
const chatRoutes = require("./routes/chat");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/authRoute");

app = express();

app.set('view engine', 'ejs');
app.set("views", "templates");

app.use(express.static('static'))

app.use(express.json()); // JSON verilerini parse eder
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MysecretKey',  // Bu anahtarı güvenli bir şekilde saklayın
    resave: false,            // Her request'te oturumu yeniden kaydetme
    saveUninitialized: false  // Oturum verisi yoksa yeni bir oturum oluşturma
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());  // Flash middleware'ını burada kullanın

app.use("/" , indexRoutes);
app.use("/chat", chatRoutes);
app.use("/profile" , profileRoutes);
app.use("/slide", slideRoutes);
app.use("/" , authRoutes);

app.get("/about", (req , res) => {
    res.render("about");
});

app.get("/slidehub" , (req , res) => {
    if(req.isAuthenticated()){
        res.render("slidehub" , {navbar:"navbarauthed"});
    }else{
        res.render("slidehub" , {navbar:"navbar"})
    }
    
})
app.get("/faq" , (req , res) => {
    if(req.isAuthenticated()){
        res.render("faq" , {navbar:"navbarauthed"});
    }else{
        res.render("faq" , {navbar:"navbar"})
    }
    
})



app.get("/slideMenu", (req , res) => {
    res.render("slideMenu");
});

app.get("/profile", (req , res) => {
    res.render("profile");
});

app.get("/profileholder", (req , res) => {
    res.render("profileholder");
});

app.get("/uploadPdf", (req , res) => {
    res.render("uploadPdf");
});


app.listen(process.env.PORT , (req,res) => {
    console.log("hello");
});
