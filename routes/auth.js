let Express = require("express");
let Router = Express.Router();
let User = require("../models/user");
const { check, validationResult } = require("express-validator");

Router.post("/login", async (req, res) => {
  res.send("Welcome to login");
});

Router.post(
  "/registration",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Enter valid email").isEmail().isLowercase(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
      let responseData = {
        success: false,
        message: "validation Error",
        errors: errors.array(),
      };
      // return response({
      //   statusCode: 200,
      //   status: "failed",
      //   response: responseData,
      //   res,
      // });
    }

    let { name, email, password } = req.body; // de-structure
    // let name = req.body.name;
    // let email=req.body.email

    try {
      // check whether a user is present or not
      let findUser = await User.findOne({ email: email });
      if (findUser) {
        // existing user
        return res.status(400).json({ error: "Email id already exist" });
      }
      // create new user
      let newUser = await User.create({
        name: name,
        email: email,
        password: password,
      });

      if (newUser) {
        return res
          .status(200)
          .json({ success: true, message: "User successfully registered" });
      }
      return res
        .status(400)
        .json({ success: true, error: "Userd register failed" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = Router;
