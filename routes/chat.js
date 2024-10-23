const express = require("express");
const router = express.Router();
const model = require("../service/google");

router.get('/', (req, res) => {
    res.render('chat', { prompt: null, response: null });
  });
  
  // Kullanıcıdan gelen prompt'u al ve modele gönder
router.post('/', async (req, res) => {
    const userPrompt = req.body.prompt;
    
    try {
      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      
      res.render('chat', { 
        prompt: userPrompt, 
        response: response.text() 
      });
    } catch (error) {
      console.error('Modelden yanıt alınırken hata oluştu:', error);
      res.render('chat', { 
        prompt: userPrompt, 
        response: 'Bir hata oluştu, lütfen tekrar deneyin.' 
      });
    }
});


module.exports = router;