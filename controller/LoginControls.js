const db = require("../data/db");

async function LoginCred(req, res) {
  try {
    console.log(req.body);
    const emailCheck = await db
      .from("users")
      .select("email")
      .where("email", "=", req.body.email);

    if (emailCheck.length > 0) {
      const result = await db
        .from("users")
        .select("*")
        .where("email", "=", req.body.email)
        .andWhere("password", "=", req.body.password)
        // .andWhereILike('role',`%${req.body.role}%`)
        .andWhere("status","=","Active")
        // console.log(result[0].role)

        const role = JSON.parse(result[0].role)

    

      if (result.length > 0 && role.includes(req.body.role)) {
        res.send({success:true,result})
      } else {
        res.status(203).send({ success: false, message: "Invalid Credentials !" });
      }
      // res.send(result)
    } else {
      res.send({
        success: false,
        message: "User Not Found ! Please Register First.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went wrong Please Try Again Later.",
    });
  }
}

async function SuperAdminCreds(req, res) {
  try {
    console.log(req.body);
    const response = await db("super_admin_creds")
      .select("*")
      .where("email", "=", req.body.email)
      .andWhere("password", "=", req.body.password);

    let auth = {};

    if (response[0]) {
      if (response[0].role === req.body.role) {
        res.send({ success: true, response });
      } else {
        res.send({ success: false, msg: "Invalid Role !" });
      }
    } else {
      res
        .status(203)
        .send({ success: false, msg: "Invalid Email or Password !" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong !" });
  }
}

module.exports = { LoginCred, SuperAdminCreds };
