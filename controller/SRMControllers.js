const db = require("../data/db");

const getAllAgreement = async (req, res) => {
    try {
        const supervisor = await db('users').select('*').where('supervisor','=',req.params.id)
       console.log(supervisor)
      const data = await db("agreements")
        .select(
          "landlords.name",
          "landlords.agreement_id",
          "landlords.id",
          "agreements.*"
        )
        .join("landlords", "agreements.id", "=", "landlords.agreement_id")
        .where('manager_id',supervisor[0].id).whereNot('status','=',"Hold")

      let ids = [];
      let agreement = {};
      data.map((row) => {
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              manager:supervisor[0].name
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name] ,manager:supervisor[0].name} };
        }
      });

    
  
    
     return res.send({ success: true, agreement, ids });
    } catch (error) {
      console.log(error);
    return  res.send({
        success: false,
        message: "something Went Wrong please try again later",
      });
    }
  };


//search use by field name
async function user_search_srmanager (req,res){
  try {
    

    const supervisor = await db('users').select('*').where('supervisor',req.params.id)


       
      const data = await db('agreements').select("*")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where('manager_id',supervisor[0].id).whereNot('status','=',"Hold")
      .whereILike('name',`%${req.body.name}%`)
      console.log(data)
      
   
      let ids = [];
      let agreement = {};
      data.map((row) => {
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              manager:supervisor[0].name
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name] ,manager:supervisor[0].name} };
        }
      });
  
      // console.log(data)
  
      res.send({ success: true, agreement, ids });

  } catch (error) {
      console.log(error)
    return  res.status(500).send()
      
  }
}





module.exports = {getAllAgreement,user_search_srmanager}