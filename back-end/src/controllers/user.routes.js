const express = require('express') 
const { body } = require('express-validator') 
const router = express.Router() 
const userRepository = require('../models/user-repository') 
const { extractUserId } = require('../security/auth') 
const { validateBody } = require('./validation/route.validator') 
const guard = require('express-jwt-permissions')({
  permissionsProperty: 'roles',
}) 

const adminRole = 'ADMIN' 
const adminOrMemberRoles = [[adminRole], ['MEMBER']] 

router.get('/newGuest', (req, res) => {
  const token = req.headers.authorization.split(' ')

  userRepository.getNewGuest(extractUserId(token[1], process.env.JWT_SECRET).userId).then(r => {
    res.status(r.status).send(r.message)
  })
}) 

router.post(
  '/newGuest',
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('birthDate').isDate(),
  (req, res) => {
    validateBody(req) 

    const token = req.headers.authorization.split(' ')

    userRepository.addGuest(extractUserId(token[1], process.env.JWT_SECRET).userId, req.body).then(r => {
      res.status(r.status).send(r.message)
    })
  }
)

router.get('/oldGuest', (req, res) => {
  const token = req.headers.authorization.split(' ')

  userRepository.getOldGuest(extractUserId(token[1], process.env.JWT_SECRET).userId).then(r => {
    res.status(r.status).send(r.message)
  })
}) 

router.get('/userInfo', (req, res) => {
  const token = req.headers.authorization.split(' ')
  const foundUser = userRepository.getUserById(extractUserId(token[1], process.env.JWT_SECRET).userId) 
  if (!foundUser) {
    throw new Error('User not found') 
  }
  userRepository.getUserById(extractUserId(token[1], process.env.JWT_SECRET).userId).then(r => {
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

router.put('/updateUser', 
  body('pseudo').notEmpty(),
  body('mail').notEmpty(),
  body('password').notEmpty(),
  (req, res) => {
    validateBody(req) 

    const token = req.headers.authorization.split(' ')
    userRepository.updateUser(extractUserId(token[1], process.env.JWT_SECRET).userId, req.body).then(r => {
      if(r) {
        res.status(200).end()
      }
      res.status(400).end()
    })
  }
)

router.put('/updateGuest/:id',
  body('score').notEmpty(),
  body('note').notEmpty(),
  body('hasShare').notEmpty(),
  (req, res) => {
    validateBody(req) 

    userRepository.updateGuest(req.params.id, req.body).then(r => {
      if(r) {
        res.status(200).end()
      }
      res.status(400).end()
    })
  }
) 

router.delete('/guest/:id', (req, res) => {
  userRepository.deleteGuest(req.params.id).then(r => {
    res.status(r.status).send(r.message)
  })
}) 

router.get('/guest/:id', (req, res) => {
  userRepository.getGuestById(req.params.id).then(r => {
    res.status(r.status).send(r.message)
  })
}) 

router.get('/guest/history/:id', (req, res) => {
  userRepository.getGuestByIdentity(req.params.id).then(r => {
    res.status(r.status).send(r.message)
  })
}) 

exports.initializeRoutes = () => router 
