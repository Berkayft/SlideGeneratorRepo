const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { User } = require("../models/Model"); // User modelini ekliyoruz

// Register Page
router.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    res.render('register', { error: null });
});

// Register Post
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        console.log('Registration attempt:', { fullName, email });

        // Validation
        if (password !== confirmPassword) {
            return res.render("register", { error: "Şifreler eşleşmiyor." });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("register", { error: "Bu e-posta zaten kayıtlı." });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: "user"
        });

        // Save user
        await newUser.save();
        console.log('User registered successfully:', newUser._id);
        res.redirect("/login");
        
    } catch (err) {
        console.error('Registration error:', err);
        res.render("register", { 
            error: "Kayıt sırasında bir hata oluştu: " + err.message,
            values: { fullName: req.body.fullName, email: req.body.email } // Formda girilen değerleri geri gönderin
        });
    }
});

// Login Page
router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    res.render('login', { error: null });
});

// Login Post
router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true // Hatalı giriş mesajı gösterimi için
}));

// Logout
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect("/login");
    });
});

// Profile Page
router.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.render("profile", { user: req.user });
});

module.exports = router;
