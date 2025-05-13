const express = require('express'); // Bu önce gelecek
const router = express.Router();

const geminiController = require('../controller/geminiController');

router.post("/recipe", geminiController.getRecipe);

module.exports = router;
