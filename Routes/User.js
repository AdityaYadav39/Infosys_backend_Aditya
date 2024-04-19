const express = require("express");
const router = express.Router();

const {Login,signup} = require("../Controllers/Usercontrol");

router.post("/Login",Login);
router.post("/Signup",signup);

module.exports = router;
