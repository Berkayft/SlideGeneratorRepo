const express = require("express");
const router = express.Router();
const { buyToken } = require("../middleware/moneyMiddleware");
const isAuth = require("../middleware/authMiddleware");

// Profile sayfası
router.get("/", (req, res) => {
    res.render("profile");
});

// Token satın alma işlemi
router.post("/buytoken", isAuth, buyToken, (req, res) => {
    res.render("profile");
});

// Slide sayfası
router.get("/myslides", isAuth, (req, res) => {
    res.render("myslides");
});

module.exports = router;
