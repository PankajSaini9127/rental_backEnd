const db = require("../data/db");

exports.listing = async (req, res) => {
  try {
    // user
    const { id } = req.query;

    if (id === undefined) return res.status(203).send("User Id Missing !!!");

    // 59 58 57 56 54

    // this API will fetch the landlord's data according the user ID's
    let data = await db("agreements")
      .select(
      "landlords.*",
      
      "agreements.code",
      "agreements.id as agreements_id",
      )
      .join("landlords", "agreements.id","=","landlords.agreement_id")
      .where((cb) => {
        cb.orWhere("agreements.manager_id", "=", id);
        cb.orWhere("agreements.srm_id", "=", id);
        cb.orWhere("agreements.op_id", "=", id);
        cb.orWhere("agreements.finance_id", "=", id);
        // cb.orWhere("agreements.buh_id", "=", id); listing will used in BUH module
      });

      console.log(`List of Landlords >>> ${id}`,data)

    return res.send({data : data});
  } catch (error) {
    console.log("Error>>>", error);
    return res.status(500).send("Something Went Wrong !!!");
  }
};


exports.update_landlord = async (req,res) =>{
  try {
    // user
    console.log(req.body)
    const { id } = req.body;

    if (id === undefined) return res.status(203).send("Landlord Id is missing !!!");

    // for safeguard the ID
    delete req.body.id
    // this API will fetch the landlord's data according the user ID's
    let data = await db("landlords").update(req.body).where('id','=',id)
    console.log(data)
    if(data)
    return res.send({message : 'Landlord updated successfully !!!'});
  } catch (error) {
    console.log("Error>>>", error);
    return res.status(500).send("Something Went Wrong !!!");
  }

}

exports.search_landlord = async (req,res) =>{
  try {
    // user
    const { id, search } = req.query;

    if (id === undefined) return res.status(203).send("User Id Missing !!!");

    // 59 58 57 56 54

    let data = [];
    if(search !== "" && search)
    {

    // this API will fetch the landlord's data according the user ID's
    data = await db("agreements")
      .select(
      "landlords.*",
      "agreements.code",
      "agreements.id as agreements_id",
      )
      .join("landlords", "agreements.id","=","landlords.agreement_id")
      .where((cb) => {
        cb.orWhere("agreements.manager_id", "=", id);
        cb.orWhere("agreements.srm_id", "=", id);
        cb.orWhere("agreements.op_id", "=", id);
        cb.orWhere("agreements.finance_id", "=", id);
        // cb.orWhere("agreements.buh_id", "=", id); listing will used in BUH module
      }).andWhere(cb=>{
        cb.orWhereILike('email', `%${search}%`)
        cb.orWhereILike('name',`%${search}%`)
        cb.orWhereILike('leeseName',`%${search}%`)
        cb.orWhereILike('aadharNo',`%${search}%`)
        cb.orWhereILike('panNo',`%${search}%`)
        cb.orWhereILike('gstNo',`%${search}%`)
        cb.orWhereILike('mobileNo',`%${search}%`)
        cb.orWhereILike('alternateMobile',`%${search}%`)
        cb.orWhereILike('email',`%${search}%`)
        cb.orWhereILike('percentage',`%${search}%`)
        cb.orWhereILike('branchName',`%${search}%`)
        cb.orWhereILike('utr_number',`%${search}%`)
        cb.orWhereILike('code',`%${search}%`)
        cb.orWhereILike('agreements.id',`%${search}%`)
      });
    }
    else{
      data = await db("agreements")
      .select(
      "landlords.*",
      "agreements.code",
      "agreements.id as agreements_id",
      )
      .join("landlords", "agreements.id","=","landlords.agreement_id")
      .where((cb) => {
        cb.orWhere("agreements.manager_id", "=", id);
        cb.orWhere("agreements.srm_id", "=", id);
        cb.orWhere("agreements.op_id", "=", id);
        cb.orWhere("agreements.finance_id", "=", id);
        // cb.orWhere("agreements.buh_id", "=", id); listing will used in BUH module
      })
    }

      console.log(`List of Landlords >>> ${id}`,data.length)

    return res.send({data : data});
  } catch (error) {
    console.log("Error>>>", error);
    return res.status(500).send("Something Went Wrong !!!");
  }

}