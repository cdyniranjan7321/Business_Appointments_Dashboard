const express = require('express')
const app = express()
const port = process.env.PORT || 6001;
const cors =require('cors');
require('dotenv').config()
//console.log(process.env) // remove this after you've confirmed it is working


//middleware
app.use(cors());
app.use(express());


app.get('/', (req, res) => {
  res.send('Hello Developer!----my name is NIRANJAN CHAUDHARY.')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})