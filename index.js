const express = require("express");


const db = require('./data/db')

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post('/admin',)


app.use('/api/admin',require('./Routes/AdminPanel'))

// // login API
app.post("/", (req, res) => {
  db.from(`admin-login`).select('*').where(req.body)
  .then(result=>res.send(result))
  .catch(err=>res.send(err))
});

//admin registration on DB
app.post("/adminReg", (req, res) => {
  db(`admin-login`).insert(req.body)
  .then(result=>res.send(result))
  .catch(err=>res.send(err))
});



app.delete("/adminReg:id", (req, res) => {
  db(`admin-login`).where("id", req.params.id).del()
  .then(result=> res.Status(301).send(result))
  .catch(err=>res.send(err))
});


 //dashboard api
app.get("/dashboard", (req, res) => {
  db.from('dashboard').select('*')
    .then(result=>res.send(result))
    .catch(err=>res.send(err))
  });


  // agreement form data post into db
app.post('/api/agreement', async(req,res)=>{
  try {
    const result = await db('agreements').insert(req.body.data)
    res.status(201).send({message:"Submited"})
  } catch (error) {
    res.status(404).send(error)
  }
   
})



app.listen(8080,()=>{
  console.log('server is host on Port No 8080')
});
