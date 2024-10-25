const { User } = require("../models/Model");


const buyToken = async (req, res, next) => {
    try {
        // Kullanıcıyı ID'si ile veritabanından buluyoruz
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        const count = req.body.count;
        // Token sayısını arttırıyoruz
        user.tokenCount += count;

        // Güncellemeyi veritabanına kaydediyoruz
        await user.save();

        next();
    } catch (error) {
        // Hata durumunda hata mesajını geri döndür
        return res.status(500).send("Error updating token count");
    }
};

const spendToken = async (req, res, next) => {
    try {
        // Kullanıcıyı ID'si ile veritabanından buluyoruz
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        const count = req.body.count;
        // Token sayısını azaltıyoruz
        user.tokenCount -= count;

        // Güncellemeyi veritabanına kaydediyoruz
        await user.save();

        next();
    } catch (error) {
        // Hata durumunda hata mesajını geri döndür
        return res.status(500).send("Error updating token count");
    }
};

module.exports = { buyToken, spendToken };

