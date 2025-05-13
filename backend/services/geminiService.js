// services/geminiService.js
const axios = require('axios');
require('dotenv').config();
const { logError } = require('../utils/logger');

const messageBuilders = {
  recipe: require('./MessageBuilders/recipeBuilder'),
  // Add other message builders here as needed
};

/**
 * Send a message to the Gemini API and get a response
 * @param {string} prompt - The formatted prompt to send to Gemini
 * @returns {Promise<string>} - The response from Gemini
 */
const sendToGemini = async (prompt) => {
  try {
    // Gemini API endpoint - adjust as necessary for the actual API
    const endpoint = process.env.GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const response = await axios.post(
      `${endpoint}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }
    );

    // Extract the response text from the Gemini API response
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    logError(`Error sending message to Gemini: ${error.message}`);
    if (error.response) {
      logError(`API Error: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

/**
 * Handle message sending to Gemini based on service type
 * @param {string} serviceType - The type of service (e.g., 'recipe')
 * @param {string} userInput - The user's input message
 * @returns {Promise<string>} - The response from Gemini
 */
const handleGeminiMessage = async (serviceType, userInput) => {
  const builder = messageBuilders[serviceType];
  if (!builder) throw new Error("Geçersiz servis tipi");
  
  const prompt = builder.buildPrompt(userInput);
  const reply = await sendToGemini(prompt);
  return reply;
};

module.exports = {
  handleGeminiMessage,
  sendToGemini, // Exported for testing purposes
};