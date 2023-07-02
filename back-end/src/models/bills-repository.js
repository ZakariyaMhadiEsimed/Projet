const { generateHashedPassword } = require('../security/crypto')
const {isEmpty} = require("lodash/lang");
const DAOBills = require("./dao/DAOBills");
const DAOProjects = require("./dao/DAOProjects");
const {generateAbbreviation} = require("../helpers/generate");
const moment = require("moment/moment");

/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
exports.getAllBills = async function (id, page, size, searchValue) {
  const DAOBills = require('./dao/DAOBills')
  const projects = await DAOBills.getAllBills(id, page, size, searchValue)
  const result = await DAOBills.getCountAllBills(id, searchValue)
  const payload = {
    headerContent :
        {
          contentPaginated : {
            content : projects,
            totalElements: result.count,
            totalPages: Math.ceil(result.count/size)
        }
     }
  }
  if (projects){
        return {status: 200, message:payload}
    } else {
        return {status: 404, message:'User not exist'}
    }
}

exports.createBill= async function (id, data) {
    const DAOBills = require('./dao/DAOBills')
    const DAOProjects = require('./dao/DAOProjects')

    const project = await DAOProjects.getProjectById(id, data.projectId)
    let number = project.abbreviation + moment(new Date()).format('YYYYMMDD')
    const extraNumber = await DAOBills.getBillSameDay(id, number)
    if(extraNumber.count > 0) number += '-' + extraNumber.count

    data.number = number
    const bill = await DAOBills.createBill(id, data)
    await DAOProjects.lockOrUnlockDeleteProject(data.projectId, '0')
    if (bill){
        return {status: 200, message:'Done !'}
    } else {
        return {status: 404, message:'Bills not added'}
    }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getBillById = async function (id, billId) {
    const DAOBills = require('./dao/DAOBills')
    const bill = await DAOBills.getBillById(id, billId)
    if (bill){
        return {status: 200, message: bill}
    } else {
        return {status: 404, message:'User not exist'}
    }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getBillSend = async function (id, billId) {
    const DAOBills = require('./dao/DAOBills')
    const bill = await DAOBills.getBillSend(id, billId)
    if (bill){
        return {status: 200, message: bill}
    } else {
        return {status: 404, message:'User not exist'}
    }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getBillPayed = async function (id, billId) {
    const DAOBills = require('./dao/DAOBills')
    const bill = await DAOBills.getBillPayed(id, billId)
    if (bill){
        return {status: 200, message: bill}
    } else {
        return {status: 404, message:'User not exist'}
    }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getBillEdit = async function (id, billId) {
    const DAOBills = require('./dao/DAOBills')
    const bill = await DAOBills.getBillEdit(id, billId)
    if (bill){
        return {status: 200, message: bill}
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
exports.updateBill = async function (id, billId, data) {
    const DAOBills = require('./dao/DAOBills')
    const DAOProjects = require('./dao/DAOProjects')
    const oldBill = await DAOBills.getBillById(id, billId)
    const result = await DAOBills.updateBill(id, billId, data)
    const billsOfProject = await DAOBills.getBillsOfProject(data.projectId)
    const billsOfProjectOld = await DAOBills.getBillsOfProject(oldBill.projectId)
    if(isEmpty(billsOfProjectOld)) DAOProjects.lockOrUnlockDeleteProject(oldBill.projectId, '1')
    if(isEmpty(billsOfProject)) {
        DAOProjects.lockOrUnlockDeleteProject(data.projectId, '1')
    }
    else DAOProjects.lockOrUnlockDeleteProject(data.projectId, '0')
    if(result !== null) {
        return {status: 200, message:'Facture modifié !'}
    }
    else {
        return {status: 400, message:'Facture non-modifié !'}
    }
}

exports.deleteBill = async function (id, billId, projectId) {
    const DAOBills = require('./dao/DAOBills')
    const DAOProjects = require('./dao/DAOProjects')
    const result = await DAOBills.deleteBill(id, billId)
    const billsOfProject = await DAOBills.getBillsOfProject(projectId)
    if(isEmpty(billsOfProject)) DAOProjects.lockOrUnlockDeleteProject(projectId, '1')
    if(!result) {
        return {status: 200, message:'Facture supprimé !'}
    }
    else {
        return {status: 400, message:'Facture non-supprimé !'}
    }
}
