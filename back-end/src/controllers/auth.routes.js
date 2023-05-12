const express = require("express");
const router = express.Router();
const userRepository = require("../models/user-repository");
const { passwordsAreEqual } = require("../security/crypto");
const { generateAuthToken } = require("../security/auth");
const { body, validationResult } = require("express-validator");
const { isEmpty } = require("lodash/lang");

router.post(
  "/login",
  body("email").isEmail(),
  body("password").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(JSON.stringify(errors.array()));
    }
    const { email, password } = req.body;
    const user = await userRepository.getUserByMail(email);
    if (
      !user ||
      (!user && !passwordsAreEqual(password, user.message.password))
    ) {
      return res.status(401).send("Unauthorized");
    } else if (isEmpty(user.message)) {
      return res.status(404).send("Not found");
    }
    const token = generateAuthToken(user.message.id, user.message.email);
    res.json({ token });
  }
);

router.post(
  "/create",
  body("lastName").notEmpty(),
  body("firstName").notEmpty(),
  body("birthDate").notEmpty(),
  body("CA").notEmpty(),
  body("postalAdress").notEmpty(),
  body("phone").notEmpty(),
  body("taxes").isEmail(),
  body("email").notEmpty(),
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
