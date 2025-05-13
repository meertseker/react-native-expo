const recipeBuilder = require('../../../../services/MessageBuilders/recipeBuilder');

describe('Recipe Builder', () => {
  test('buildPrompt should format user input correctly', () => {
    const userInput = 'Köfte tarifi';
    const expectedPrompt = `Sen bir yemek tarifleri asistanısın. Kullanıcının istediği yemek tarifi: Köfte tarifi`;
    
    const result = recipeBuilder.buildPrompt(userInput);
    
    expect(result).toBe(expectedPrompt);
  });
});