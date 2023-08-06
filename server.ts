require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const appRouting = require('./controller/controller')
app.use(cors())
app.use('/', appRouting)
const PORT = 3000

app.set('json spaces', 2)
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
