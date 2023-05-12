const express = require("express");
const router = express.Router();
const userRepository = require("../models/user-repository");
const { passwordsAreEqual } = require("../security/crypto");
const { generateAuthToken } = require("../security/auth");
const { body, validationResult } = require("express-validator");

router.post(
  "/login",
  body("mail").isEmail(),
  body("password").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(JSON.stringify(errors.array()));
    }
    const { mail, password } = req.body;
    const user = await userRepository.getUserByMail(mail);
    if (
      !user ||
      (!user && !passwordsAreEqual(password, user.message.password))
    ) {
      return res.status(401).send("Unauthorized");
    }
    const token = generateAuthToken(user.message.id, user.message.mail);
    res.json({ token });
  }
);

router.post(
  "/create",
  body("pseudo").notEmpty(),
  body("mail").isEmail(),
  body("password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(JSON.stringify(errors.array()));
    }
    userRepository.addUser(req.body).then((r) => {
      res.status(r.status).send(r.message);
    });
  }
);

exports.initializeRoutes = () => router;
