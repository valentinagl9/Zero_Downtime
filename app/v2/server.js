const express = require('express');

const app = express();
const port = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('Hello from v2 (Green/Canary)!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`v2 running on ${port}`);
});
