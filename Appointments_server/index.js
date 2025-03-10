const express = require('express')
const app = express()
const port = process.env.PORT || 6001;
const cors =require('cors');


//middleware
app.use(cors());
app.use(express());


app.get('/', (req, res) => {
  res.send('Hello Developer!----my name is NIRANJAN CHAUDHARY.')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})