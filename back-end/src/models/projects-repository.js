const {isEmpty} = require("lodash/lang");

/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
exports.getAllProjects = async function (id, page, size, searchValue) {
  const DAOProjects = require('./dao/DAOProjects')
  const customers = await DAOProjects.getAllProjects(id, page, size, searchValue)
  const result = await DAOProjects.getCountAllProjects(id, searchValue)
    console.log('debug count : ', result.count)
  const payload = {
    headerContent :
        {
          contentPaginated : {
            content : customers,
            totalElements: result.count,
            totalPages: Math.ceil(result.count/size)
        }
     }
  }
  if (customers){
        return {status: 200, message:payload}
    } else {
        return {status: 404, message:'User not exist'}
    }
}


exports.createProject= async function (id, data) {
    const DAOProjects = require('./dao/DAOProjects')
    const DAOCustomers = require('./dao/DAOCustomers')
    const project = await DAOProjects.createProject(id, data)
    await DAOCustomers.lockOrUnlockDeleteCustomer(data.customerId, '0')
    if (project){
        return {status: 200, message:'Done !'}
    } else {
        return {status: 404, message:'Projects not added'}
    }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getProjectById = async function (id, projectId) {
    const DAOProjects = require('./dao/DAOProjects')
    const project = await DAOProjects.getProjectById(id, projectId)
    if (project){
        return {status: 200, message: project}
    } else {
        return {status: 404, message:'User not exist'}
    }
}

/**
 * update User in database
 * @params {int} id - id of User
 * @params {string} pseudo - name of user
 * @params {string} lastName - lastName of user
 * @params {string} password - password of user
 */
exports.updateProject = async function (id, projectId, data) {
    const DAOProjects = require('./dao/DAOProjects')
    const DAOCustomers = require('./dao/DAOCustomers')

    const oldProject = await DAOProjects.getProjectById(id, projectId)

    const result = await DAOProjects.updateProject(id, projectId, data)
    const projectsOfCustomer = await DAOProjects.getProjectsOfCustomer(data.customerId)

    const projectsOfCustomerOld = await DAOProjects.getProjectsOfCustomer(oldProject.customerId)

    if(isEmpty(projectsOfCustomerOld)) DAOCustomers.lockOrUnlockDeleteCustomer(oldProject.customerId, '1')
    if(isEmpty(projectsOfCustomer)) {
        DAOCustomers.lockOrUnlockDeleteCustomer(data.customerId, '1')
    }
    else DAOCustomers.lockOrUnlockDeleteCustomer(data.customerId, '0')

    if(result !== null) {
        return {status: 200, message:'Projet modifié !'}
    }
    else {
        return {status: 400, message:'Projet non-modifié !'}
    }
}

exports.deleteProject = async function (id, projectId, customerId) {
    const DAOProjects = require('./dao/DAOProjects')
    const DAOCustomers = require('./dao/DAOCustomers')
    const result = await DAOProjects.deleteProject(id, projectId)
    const projectsOfCustomer = await DAOProjects.getProjectsOfCustomer(customerId)
    console.log('debug customer id : ', customerId, ' have : ', projectsOfCustomer)
    if(isEmpty(projectsOfCustomer)) DAOCustomers.lockOrUnlockDeleteCustomer(customerId, '1')
    if(!result) {
        return {status: 200, message:'Projet supprimé !'}
    }
    else {
        return {status: 400, message:'Projet non-supprimé !'}
    }
}

