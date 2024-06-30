// server.js
const express = require('express');
const routes = require('./routes/index');

const { PORT = 5000 } = process.env;

const app = express();

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
