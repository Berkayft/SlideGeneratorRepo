const express = require("express");
const router = express.Router();



router.get("/" , (req , res) => {
    if(req.isAuthenticated()){
        res.render("index" , {navbar:"navbarauthed"});
    }else{
        res.render("index" , {navbar:"navbar"})
    }
    
})


module.exports = router;