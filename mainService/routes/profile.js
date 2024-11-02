const express = require("express");
const router = express.Router();
const { buyToken } = require("../middleware/moneyMiddleware");
const isAuth = require("../middleware/authMiddleware");

const {User , SlideModel} = require("../models/Model"); 

router.get("/", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    const user = await User.findById(req.user._id).populate('slides').exec();
    const userSlides = user ? user.slides : [];
    res.render("profile", { user: req.user , navbar: "navbarauthed" , slides: userSlides });
});
// Token satın alma işlemi

// Route handler with the buyToken middleware
router.get("/buytoken", isAuth, buyToken, (req, res) => {
    res.redirect("/profile");
});

module.exports = router;

