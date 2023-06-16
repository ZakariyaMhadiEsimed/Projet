const express = require('express') 
const { body, validationResult} = require('express-validator')
const router = express.Router() 
const customerRepository = require('../models/customers-repository')
const { extractUserId } = require('../security/auth') 
const { validateBody } = require('./validation/route.validator')
const moment = require("moment/moment");
const userRepository = require("../models/user-repository");
const guard = require('express-jwt-permissions')({
  permissionsProperty: 'roles',
}) 

const adminRole = 'ADMIN' 
const adminOrMemberRoles = [[adminRole], ['MEMBER']]

router.post('/all', (req, res) => {
  const token = req.headers.authorization.split(' ')
  customerRepository.getAllCustomers(extractUserId(token[1], process.env.JWT_SECRET).userId, req.query.page, req.query.size, req.body.searchValue).then(r => {
    res.status(r.status).send(r.message)
  })
}) 

/* router.post(
  '/',
  guard.check(adminRole),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('password').notEmpty().isLength({ min: 5 }),
  (req, res) => {
    validateBody(req) 

    const existingUser = userRepository.getUserByFirstName(req.body.firstName) 
    if (existingUser) {
      throw new Error('Unable to create the user') 
    }

    userRepository.add(req).then(r => {
      res.status(r.status).send(r.message)
    })
  }
)  */

router.post('/create',
    body("lastName").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
    body("firstName").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
    body("postalAdress").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
    body("phone").notEmpty().withMessage('Champs requis !').isNumeric().withMessage('Format invalide')
        .isLength({max: 10, min: 10}).withMessage('Format invalide'),
    body("email").notEmpty().withMessage('Champs requis !').isEmail().withMessage('Format invalide !'),
    body("typeId").notEmpty().withMessage('Champs requis !'),
    (req, res) => {
        validateBody(req)
        const token = req.headers.authorization.split(' ')
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(JSON.stringify(errors.array()));
        }
        customerRepository.createCustomer(extractUserId(token[1], process.env.JWT_SECRET).userId, req.body).then(r => {
            res.status(r.status).send(r.message);
        });
    }
)

router.get('/:id', (req, res) => {
    const token = req.headers.authorization.split(' ')
    customerRepository.getCustomerById(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id).then(foundCustomer => {
        res.status(foundCustomer.status).send(foundCustomer.message)
    })


})

router.put('/update',
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
        .isLength({min: 8}).withMessage('Longueur min de 8 caractères'),
  (req, res) => {
    validateBody(req)
    const token = req.headers.authorization.split(' ')
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(JSON.stringify(errors.array()));
    }
    userRepository.updateUser(extractUserId(token[1], process.env.JWT_SECRET).userId, req.body).then(r => {
        res.status(r.status).send(r.message);
    });
  }
)

/*router.delete('/guest/:id', (req, res) => {
  userRepository.deleteGuest(req.params.id).then(r => {
    res.status(r.status).send(r.message)
  })
}) */

exports.initializeRoutes = () => router 
