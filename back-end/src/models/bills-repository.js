const { generateHashedPassword } = require('../security/crypto')
const {isEmpty} = require("lodash/lang");
const DAOBills = require("./dao/DAOBills");
const DAOProjects = require("./dao/DAOProjects");

/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
exports.getAllBills = async function (id, page, size, searchValue) {
  const DAOBills = require('./dao/DAOBills')
  const customers = await DAOBills.getAllBills(id, page, size, searchValue)
  const result = await DAOBills.getCountAllBills(id, searchValue)
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

exports.createBill= async function (id, data) {
    const DAOBills = require('./dao/DAOBills')
    const DAOProjects = require('./dao/DAOProjects')
    const project = await DAOBills.createBill(id, data)
    await DAOProjects.lockOrUnlockDeleteProject(data.customerId, '0')
    if (project){
        return {status: 200, message:'Done !'}
    } else {
        return {status: 404, message:'Bills not added'}
    }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getBillById = async function (id, projectId) {
    const DAOBills = require('./dao/DAOBills')
    const project = await DAOBills.getBillById(id, projectId)
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
exports.updateBill = async function (id, projectId, data) {
    const DAOBills = require('./dao/DAOBills')
    const DAOProjects = require('./dao/DAOProjects')

    const oldBill = await DAOBills.getBillById(id, projectId)

    const result = await DAOBills.updateBill(id, projectId, data)
    const billsOfProject = await DAOBills.getBillsOfProject(data.customerId)

    const billsOfProjectOld = await DAOBills.getBillsOfProject(oldBill.customerId)

    if(isEmpty(billsOfProjectOld)) DAOProjects.lockOrUnlockDeleteProject(oldBill.customerId, '1')
    if(isEmpty(billsOfProject)) {
        DAOProjects.lockOrUnlockDeleteProject(data.customerId, '1')
    }
    else DAOProjects.lockOrUnlockDeleteProject(data.customerId, '0')

    if(result !== null) {
        return {status: 200, message:'Facture modifié !'}
    }
    else {
        return {status: 400, message:'Facture non-modifié !'}
    }
}

exports.deleteBill = async function (id, projectId, customerId) {
    const DAOBills = require('./dao/DAOBills')
    const DAOProjects = require('./dao/DAOProjects')
    const result = await DAOBills.deleteBill(id, projectId)
    const billsOfProject = await DAOBills.getBillsOfProject(customerId)
    if(isEmpty(billsOfProject)) DAOProjects.lockOrUnlockDeleteProject(customerId, '1')
    if(!result) {
        return {status: 200, message:'Facture supprimé !'}
    }
    else {
        return {status: 400, message:'Facture non-supprimé !'}
    }
}
