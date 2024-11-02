const { User } = require("../models/Model");


const buyToken = async (req, res, next) => {
    try {
        // Find user by their ID
        const user = await User.findById(req.user._id);

        // Check if user exists
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Increase the token count by 10
        user.tokenCount = (user.tokenCount || 0) + 10;

        // Save the updated user document
        await user.save();

        // Move to the next middleware/route handler
        next();
    } catch (error) {
        console.error("Error in buyToken middleware:", error);
        res.status(500).send("Internal Server Error");
    }
};

const spendToken = async (user_id) => {
    try {
        // Kullanıcıyı ID'si ile veritabanından buluyoruz
        const user = await User.findById(user_id);
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Token sayısını azaltıyoruz
        user.tokenCount = (user.tokenCount || 0) - 1;

        if(user.tokenCount < 0) {
            user.tokenCount = 0;
        }


        // Güncellemeyi veritabanına kaydediyoruz
        await user.save();

    } catch (error) {
        // Hata durumunda hata mesajını geri döndür
        return res.status(500).send("Error updating token count");
    }
};

module.exports = { buyToken, spendToken };

