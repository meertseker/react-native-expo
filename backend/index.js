const express = require('express');
const cors = require('cors');
require('dotenv').config();
const geminiRoutes = require('./routes/geminiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', geminiRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
