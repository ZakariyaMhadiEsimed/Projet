const express = require('express') 
const { body, validationResult} = require('express-validator')
const router = express.Router() 
const projectsRepository = require('../models/projects-repository')
const { extractUserId } = require('../security/auth') 
const { validateBody } = require('./validation/route.validator')
const moment = require("moment/moment");
const guard = require('express-jwt-permissions')({
  permissionsProperty: 'roles',
}) 

const adminRole = 'ADMIN' 
const adminOrMemberRoles = [[adminRole], ['MEMBER']]

router.post('/all', (req, res) => {
  const token = req.headers.authorization.split(' ')
    projectsRepository.getAllProjects(extractUserId(token[1], process.env.JWT_SECRET).userId, req.query.page, req.query.size, req.body.searchValue).then(r => {
    res.status(r.status).send(r.message)
  })
})

router.post('/create',
    body("name").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
    body("customerId").notEmpty().withMessage('Champs requis !').isNumeric().withMessage('Format invalide'),
    (req, res) => {
      validateBody(req)
      const token = req.headers.authorization.split(' ')
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(JSON.stringify(errors.array()));
      }
      projectsRepository.createProject(extractUserId(token[1], process.env.JWT_SECRET).userId, req.body).then(r => {
        res.status(r.status).send(r.message);
      });
    }
)

router.get('/:id', (req, res) => {
  const token = req.headers.authorization.split(' ')
  projectsRepository.getProjectById(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id).then(foundCustomer => {
    res.status(foundCustomer.status).send(foundCustomer.message)
  })


})

router.put('/update/:id',
    body("name").notEmpty().withMessage('Champs requis !').isLength({max: 150}).withMessage('Longueur max de 150 caractères'),
    body("customerId").notEmpty().withMessage('Champs requis !').isNumeric().withMessage('Format invalide'),
    body("statusId").notEmpty().withMessage('Champs requis !').isNumeric().withMessage('Format invalide'),
    (req, res) => {
      validateBody(req)
      const token = req.headers.authorization.split(' ')
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(JSON.stringify(errors.array()));
      }
      projectsRepository.updateProject(extractUserId(token[1], process.env.JWT_SECRET).userId, req.params.id, req.body).then(r => {
        res.status(r.status).send(r.message);
      });
    }
)

router.delete('/:id/:customerId', (req, res) => {
  const token = req.headers.authorization.split(' ')
  projectsRepository.deleteProject(extractUserId(token[1], process.env.JWT_SECRET).userId,req.params.id, req.params.customerId).then(r => {
    res.status(r.status).send(r.message)
  })
})

exports.initializeRoutes = () => router 
