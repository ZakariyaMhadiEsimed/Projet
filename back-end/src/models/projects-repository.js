const { generateHashedPassword } = require('../security/crypto')
const {isEmpty} = require("lodash/lang");

/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
exports.getAllProjects = async function (id, page, size, searchValue) {
  const DAOProjects = require('./dao/DAOProjects')
  const customers = await DAOProjects.getAllProjects(id, page, size, searchValue)
  const result = await DAOProjects.getCountAllProjects(id, searchValue)
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
