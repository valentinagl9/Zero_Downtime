const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello from v1 (Blue)!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`v1 running on ${port}`);
});
