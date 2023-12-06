const express = require("express")
const router = express.Router()
const User = require("../Schemas/users")
const authenticateToken = require("./Authentication")

  router.get("/", authenticateToken, async (req, res) => {
    const data = await User.find({ username: req.user.username })
    res.json({ message: 'Protected route accessed', data });
  });

  module.exports = router