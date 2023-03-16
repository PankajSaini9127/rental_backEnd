const express = require("express");


const db = require('./data/db')

const app = express();

const Port = process.env.PORT || 8080

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("hello api is live")
})


app.use('/api/admin',require('./Routes/AdminPanel'))
app.use('/api',require('./Routes/ManagerPanel'))





app.listen(Port,()=>{
  console.log(`server is host on Port No ${Port}`)
});
