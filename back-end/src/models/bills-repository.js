const { generateHashedPassword } = require('../security/crypto')
const {isEmpty} = require("lodash/lang");

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
