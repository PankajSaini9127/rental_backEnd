const db = require("../data/db");

async function LoginCred(req, res) {
  try {
    const result = await db.from("users").select("*").where(req.body);
    console.log(result.length);

    if (result.length < 1) {
      return res.status(200).send({
        success: false,
        message: "User Not Found Please Register First.",
      });
    } else {
      if (result[0].status === "Active") {
        return res.send({ success: true, result });
      } else {
        return res.send({ success: false, message: "User Inactive!" });
      }
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
    console.log(req.body)
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
