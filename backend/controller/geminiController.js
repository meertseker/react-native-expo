exports.getRecipe = async (req, res) => {
  const { userInput } = req.body;
  console.log("Gelen input:", userInput);  // Bu satır ile gelen input'u kontrol edebilirsiniz.
  
  try {
    const geminiService = require('../services/geminiService');
    const response = await geminiService.handleGeminiMessage("recipe", userInput);
    
    console.log("Gemini Yanıtı:", response);  // Bu satırda gelen cevabı logluyoruz.
    
    if (response) {
      res.json({ recipe: response });
    } else {
      throw new Error("Boş yanıt alındı.");
    }
  } catch (err) {
    console.error("Hata:", err);  // Detaylı hata logu.
    res.status(500).json({ error: "Bir hata oluştu." });
  }
};
