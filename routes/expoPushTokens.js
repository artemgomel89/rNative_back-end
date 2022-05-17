const express = require("express");
const router = express.Router();
const Joi = require("joi");

const usersStore = require("../store/users");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

router.post(
  "/",
  [auth, validateWith({ token: Joi.string().required() })],
  (req, res) => {const userId =req.user.userId;
    const user = usersStore.getUserById(userId);
    if (!user) return res.status(400).send({ error: "Invalid user." });

    usersStore.addUserField(userId,{'expoPushToken':req.body.token})
    console.log("User registered for notifications: ", user);
    res.status(201).send();
  }
);

module.exports = router;
