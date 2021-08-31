const express = require("express");
const passport = require("passport");

const { register } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", passport.authenticate("local"));

module.exports = router;
