jest.mock('../../../services/geminiService', () => ({
  handleGeminiMessage: jest.fn(),
}));

const geminiService = require('../../../services/geminiService');
const request = require('supertest');
const express = require('express');

let app;

beforeEach(() => {
  app = express();
  app.use(express.json());

  // Route’ları mock’tan sonra ekliyoruz, en önemli yer burası
  const geminiRoutes = require('../../../routes/geminiRoutes');
  app.use('/', geminiRoutes);
});

describe('Gemini Controller - /recipe', () => {
  it('200 dönmeli ve tarif içermeli', async () => {
    geminiService.handleGeminiMessage.mockResolvedValue('Mock tarif: karnıyarık');

    const response = await request(app)
      .post('/recipe')
      .send({ userInput: 'karnıyarık' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('recipe');
    expect(response.body.recipe).toContain('Mock tarif: karnıyarık');
  });

  it('Geçersiz input için 500 dönmeli', async () => {
    geminiService.handleGeminiMessage.mockImplementation(() => {
      throw new Error('Hata');
    });

    const response = await request(app)
      .post('/recipe')
      .send({ userInput: 'error case' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
