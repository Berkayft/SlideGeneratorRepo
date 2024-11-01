const express = require("express");
const router = express.Router();
const { buyToken } = require("../middleware/moneyMiddleware");
const isAuth = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.render("profile", { user: req.user , navbar: "navbarauthed" });
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
