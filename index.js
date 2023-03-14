const express = require("express");


const db = require('./data/db')

const app = express();

const Port = process.env.PORT || 8080

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post('/admin',)


app.use('/api/admin',require('./Routes/AdminPanel'))





app.listen(8080,()=>{
  console.log('server is host on Port No 8080')
});
