const express = require("express");
const router = express.Router();
const userRepository = require("../models/user-repository");
const { passwordsAreEqual } = require("../security/crypto");
const { generateAuthToken } = require("../security/auth");
const { body, validationResult } = require("express-validator");
const { isEmpty } = require("lodash/lang");
const moment = require("moment")
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
    const user = await userRepository.getUserByMailAndPassword(email, password);
    if(user.status == 200) {
          const token = generateAuthToken(user.message.id, user.message.email, user.message.firstName, user.message.lastName, user.message.CA);
          return res.json({token});
    }
    else return res.status(user.status).send(user.message);
  }
);

router.post(
  "/create",
  body("lastName").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
  body("firstName").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
  body("birthDate").notEmpty().withMessage('Champs requis !').custom((value) => {
      if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
          throw new Error('Format invalide !');
      }
      return true;
  }),
  body("CA").notEmpty().withMessage('Champs requis !').isNumeric().withMessage('Format invalide'),
  body("postalAdress").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
  body("phone").notEmpty().withMessage('Champs requis !').isNumeric().withMessage('Format invalide')
      .isLength({max: 10, min: 10}).withMessage('Format invalide'),
  body("taxes").notEmpty().withMessage('Champs requis !').isNumeric().withMessage('Format invalide'),
  body("email").notEmpty().withMessage('Champs requis !').isEmail().withMessage('Format invalide !'),
  body("password").notEmpty().withMessage('Champs requis !')
      .isLength({min: 8}).withMessage('Longueur min de 8 caractères')
      /*.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$/).withMessage("Format invalide")*/,
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
