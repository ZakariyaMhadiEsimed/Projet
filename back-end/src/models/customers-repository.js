/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
const DAOCustomers = require("./dao/DAOCustomers");
exports.getAllCustomers = async function (id, page, size, searchValue) {
  const DAOCustomers = require('./dao/DAOCustomers')
  const customers = await DAOCustomers.getAllCustomers(id, page, size, searchValue)
  const result = await DAOCustomers.getCountAllCustomers(id, searchValue)
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

exports.createCustomer= async function (id, data) {
  const DAOCustomers = require('./dao/DAOCustomers')
  const customer = await DAOCustomers.createCustomer(id, data)
  if (customer){
    return {status: 200, message:'Done !'}
  } else {
    return {status: 404, message:'Customer not added'}
  }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getCustomerById = async function (id, customerId) {
  const DAOCustomers = require('./dao/DAOCustomers')
  const customer = await DAOCustomers.getCustomerById(id, customerId)
  if (customer){
      return {status: 200, message: customer}
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
exports.updateCustomer = async function (id, customerId, data) {
  const DAOCustomers = require('./dao/DAOCustomers')
  const result = await DAOCustomers.updateCustomer(id, data)
  if(result !== null) {
    return {status: 200, message:'Client modifié !'}
  }
  else {
    return {status: 400, message:'Client non-modifié !'}
  }
}

exports.deleteCustomer = async function (id, customerId) {
  const DAOCustomers = require('./dao/DAOCustomers')
  const result = await DAOCustomers.deleteCustomer(id, customerId)
  if(result == {}) {
    return {status: 200, message:'Client supprimé !'}
  }
  else {
    return {status: 400, message:'Client non-supprimé !'}
  }
}
