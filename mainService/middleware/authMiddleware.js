

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Kullanıcı kimliği doğrulanmış, devam et
        return next();
    }
    // Kullanıcı kimliği doğrulanmamış, hata döndür
    res.render("register");
};

module.exports = isAuthenticated;