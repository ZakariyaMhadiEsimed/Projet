const express = require('express') 
const { body, validationResult} = require('express-validator')
const router = express.Router() 
const billsRepository = require('../models/bills-repository')
const { extractUserId } = require('../security/auth') 
const { validateBody } = require('./validation/route.validator')
const moment = require("moment");
const guard = require('express-jwt-permissions')({
  permissionsProperty: 'roles',
}) 

const adminRole = 'ADMIN' 
const adminOrMemberRoles = [[adminRole], ['MEMBER']]

router.post('/all', (req, res) => {
  const token = req.headers.authorization.split(' ')
    billsRepository.getAllBills(extractUserId(token[1], process.env.JWT_SECRET).userId, req.query.page, req.query.size, req.body.searchValue).then(r => {
    res.status(r.status).send(r.message)
  })
})

router.post('/create',
    body("projectId").notEmpty().withMessage('Champs requis !'),
    body("footer").notEmpty().withMessage('Champs requis !'),
    body("paymentTypeId").notEmpty().withMessage('Champs requis !'),
    body("paymentLimits").notEmpty().withMessage('Champs requis !').custom((value) => {
        if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
            throw new Error('Format invalide !');
        }
        return true;
    }),
    (req, res) => {
      validateBody(req)
      const token = req.headers.authorization.split(' ')
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(JSON.stringify(errors.array()));
      }
      billsRepository.createBill(extractUserId(token[1], process.env.JWT_SECRET).userId, req.body).then(r => {
        res.status(r.status).send(r.message);
      });
    }
)

router.get('/send/:id', (req, res) => {
    const token = req.headers.authorization.split(' ')
    billsRepository.getBillSend(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id).then(foundCustomer => {
        res.status(foundCustomer.status).send(foundCustomer.message)
    })
})

router.get('/payed/:id', (req, res) => {
    const token = req.headers.authorization.split(' ')
    billsRepository.getBillPayed(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id).then(foundCustomer => {
        res.status(foundCustomer.status).send(foundCustomer.message)
    })
})

router.get('/edit/:id', (req, res) => {
    const token = req.headers.authorization.split(' ')
    billsRepository.getBillEdit(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id).then(foundCustomer => {
        res.status(foundCustomer.status).send(foundCustomer.message)
    })
})

router.get('/:id', (req, res) => {
  const token = req.headers.authorization.split(' ')
  billsRepository.getBillById(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id).then(foundCustomer => {
    res.status(foundCustomer.status).send(foundCustomer.message)
  })
})

router.put('/update/:id',
    body("projectId").notEmpty().withMessage('Champs requis !'),
    body("footer").notEmpty().withMessage('Champs requis !'),
    body("paymentTypeId").notEmpty().withMessage('Champs requis !'),
    body("paymentLimits").notEmpty().withMessage('Champs requis !').custom((value) => {
        if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
            throw new Error('Format invalide !');
        }
        return true;
    }),
    (req, res) => {
      validateBody(req)
      const token = req.headers.authorization.split(' ')
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(JSON.stringify(errors.array()));
      }
      billsRepository.updateBill(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id, req.body).then(r => {
        res.status(r.status).send(r.message);
      });
    }
)

router.delete('/:id/:projectId', (req, res) => {
  const token = req.headers.authorization.split(' ')
  billsRepository.deleteBill(extractUserId(token[1], process.env.JWT_SECRET).userId,req.params.id, req.params.projectId).then(r => {
    res.status(r.status).send(r.message)
  })
})

exports.initializeRoutes = () => router 
