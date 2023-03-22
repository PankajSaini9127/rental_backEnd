const db = require("../data/db");

async function LoginCred(req, res) {
  try {
    const result = await db.from("users").select("*").where(req.body);

    if (result.length < 1) {
      return res
        .status(200)
        .send({
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
    return res
      .status(500)
      .send({
        success: false,
        message: "Something Went wrong Please Try Again Later.",
      });
  }
}

module.exports = { LoginCred };
