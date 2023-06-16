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

exports.initializeRoutes = () => router 
