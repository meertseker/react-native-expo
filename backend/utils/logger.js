const logError = (error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${error}`);
  };
  
  module.exports = { logError };
  