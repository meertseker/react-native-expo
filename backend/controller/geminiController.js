

exports.getRecipe = async (req, res) => {
  const { userInput } = req.body; 
  try {
    const response = await geminiService.handleGeminiMessage("recipe", userInput);
    res.json({ recipe: response });
  } catch (err) {
    res.status(500).json({ error: "Bir hata oluştu." });
    console.log("REQ BODY:", req.body);
  }
};
