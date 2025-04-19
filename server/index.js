require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../client/dist'));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
