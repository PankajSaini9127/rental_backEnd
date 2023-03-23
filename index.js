const express = require("express");
const path = require('path')

const db = require('./data/db')
const seed = require('./data/seeds/user')
const app = express();

const Port = process.env.PORT || 8080

const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use(express.static("frontend/build"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

seed.seed()

app.use('/api/auth',require('./Routes/Auth'))
app.use('/api/admin',require('./Routes/AdminPanel'))
app.use('/api',require('./Routes/ManagerPanel'))
app.use('/api',require('./Routes/SeniorManager'))
app.use('/api',require('./Routes/newAuthController'))
app.use('/api/operations',require('./Routes/Operations'))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend","build", "index.html"));
  });

app.listen(Port,()=>{
  console.log(`server is host on Port No ${Port}`)
});

