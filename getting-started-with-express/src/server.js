const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/yo', (req, res) => {
  res.send('YO');
});

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
