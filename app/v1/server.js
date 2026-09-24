const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello from v1 (Blue)!');
});

app.listen(port, () => console.log(`v1 running on ${port}`));
