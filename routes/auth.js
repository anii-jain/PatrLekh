const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require ('../middleware/fetchuser');

const JWT_SECRET = "Heyyy@guys@i@am@animesh@jain";

//ROUTE1:  Create a user using: POST "/api/auth/: createuser".
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name of 3 character length").isLength({
      min: 3,
    }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password for 5 character length").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors, return bad request and the erros.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check whether the user with this email exist already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });

      //   .then(user => res.json(user))
      //   .catch (err=>{console.log(err),
      //   res.json({error: 'Please enter a unique value for email', message: err.message})})
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user);
      success = true;
      res.json({success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are errors, return bad request and the erros.
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Get login user details using: POST "/api/auth/getuser". Login Required
router.post(
  "/getuser", fetchuser, async (req, res) => {
    try {
      userID = req.user.id;
      const user = await User.findById(userID).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  });

module.exports = router;
