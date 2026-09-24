const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => {
  res.send('Hello from v2 (Green/Canary)!');
});

app.listen(port, () => console.log(`v2 running on ${port}`));
