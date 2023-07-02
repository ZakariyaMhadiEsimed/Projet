const { generateHashedPassword } = require('../security/crypto')
const DAOUsers = require("./dao/DAOUsers");
const {isEmpty} = require("lodash/lang");
const DAOBills = require("./dao/DAOUsers");

/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
exports.getUserByMail = async function (mail) {
  const DAOUsers = require('./dao/DAOUsers')
    const user = await DAOUsers.findUserByMail(mail)
    if (user){
        return {status: 200, message:user}
    } else {
        return {status: 404, message:'User not exist'}
    }
}

exports.getUserByMailAndPassword = async function (mail, password) {
  const DAOUsers = require('./dao/DAOUsers')
  const user = await DAOUsers.findUserByMailAndPassword(mail, password)
  if (user){
    return {status: 200, message:user}
  } else {
    return {status: 404, message:'User not exist'}
  }
}

/**
 * return one User from the database
 * @params {int} id - id of User
 */
exports.getUserById = async function (id) {
  const DAOUsers = require('./dao/DAOUsers')

  const user = await DAOUsers.findUserById(id)
  if (user){
      return {status: 200, message:user}
  } else {
      return {status: 404, message:'User not exist'}
  }
}

/**
 * return one Guest from the database
 * @params {int} id - id of guest
 */
exports.getGuestById = async function (id) {
  const DAOUsers = require('./dao/DAOUsers')

  const guest = await DAOUsers.findGuestById(id)
  if (guest){
      return {status: 200, message:guest}
  } else {
      return {status: 404, message:'User not exist'}
  }
}

/**
 * return one Guest from the database
 * @params {int} id - id of guest
 */
exports.getGuestByIdentity = async function(id) {
  const DAOUsers = require('./dao/DAOUsers')
  
  const data = await DAOUsers.findGuestById(id)
  const {sexe, firstName, lastName, birthDate} = data[0]
  const guest = await DAOUsers.findGuestByIdentity(sexe, firstName, lastName, birthDate)
  if (guest){
    return {status: 200, message:guest}
  } else {
    return {status: 404, message:'Guest not exist'}
  }
}

/**
 * add new User in database
 * @params {string} mail - mail of user
 * @params {string} pseudo - pseudo of user
 * @params {string} password - password of user
 */
exports.addUser = async function (data) {
  const DAOUsers = require('./DAO/DAOUsers')
  const user = await DAOUsers.findUserByMail(data.email)
  if (isEmpty(user)){
      data.password = generateHashedPassword(data.password)
      await DAOUsers.addUser(data)
      return {status: 200, message:'Utilisateur ajouté !'}
  } else {
      return {status: 409, message:'E-mail déjà utilisée !'} //conflict
  }
}

/**
 * add new Guest in database
 * @params {int} id - id of user
 * @params {string} firstName - firstName of guest
 * @params {string} lastName - lastName of guest
 * @params {string} birthDate - birthDate of guest
 */
exports.addGuest = async function (id, data) {
  const DAOUsers = require('./dao/DAOUsers')
  
  const {sexe, firstName, lastName, birthDate} = data

  if (!firstName) return {status: 422, message:'First name required.'}
  if (!lastName) return  {status: 422, message:'Last name required.'}
  if (!birthDate) return {status: 422, message:'Birth date required.'}

  await DAOUsers.addGuest(id, sexe, firstName.toLowerCase(), lastName.toLowerCase(), birthDate)

  return {status: 200, message:'Guest Added !'}
}

/**
 * update User in database
 * @params {int} id - id of User
 * @params {string} pseudo - name of user
 * @params {string} lastName - lastName of user
 * @params {string} password - password of user
 */
exports.updateUser = async function (id, data) {
  const DAOUsers = require('./DAO/DAOUsers')
  const foundUser = await DAOUsers.findUserById(id)
  if (!foundUser) {
    throw new Error('User not found') 
  }
  foundUser.firstName = data.firstName || foundUser.firstName
  foundUser.lastName = data.lastName || foundUser.lastName
  foundUser.birthDate = data.birthDate || foundUser.birthDate
  foundUser.CA = data.CA || foundUser.CA
  foundUser.postalAdress = data.postalAdress || foundUser.postalAdress
  foundUser.phone = data.phone || foundUser.phone
  foundUser.taxes = data.taxes || foundUser.taxes
  foundUser.email = data.email || foundUser.email
  foundUser.password = data.password ? generateHashedPassword(data.password) : foundUser[0].password
  const result = await DAOUsers.updateUser(foundUser)
  if(result !== null) {
    return {status: 200, message:'Utilisateur modifié !'}
  }
  else {
    return {status: 400, message:'Utilisateur non-modifié !'}
  }
}

/**
 * update guest in database
 * @params {int} guestId - id of guest
 * @params {string} score - score of guest
 * @params {string} note - note of guest
 * @params {string} hasShare - if the meet was share with other user
 */
exports.updateGuest = async function (guestId, data) {
  const DAOUsers = require('./DAO/DAOUsers')
  const foundGuest = await DAOUsers.findGuestById(guestId)
  if (!foundGuest) {
    throw new Error('Guest not found') 
  }

  foundGuest[0].score = parseInt(data.score, 10) || foundGuest.score 
  foundGuest[0].note = data.note || foundGuest.note 
  foundGuest[0].hasShare = data.hasShare || foundGuest.hasShare

  await DAOUsers.updateGuest(guestId, foundGuest[0].score, foundGuest[0].note, foundGuest[0].hasShare)
  return {status: 200, message:'Guest Updated !'}
}

/**
 * delete Guest with id, checks that the Guest exist
 * @params {int} id - id of Guest to delete
 */
exports.deleteGuest = async function (id) {
  const DAOUsers = require('./DAO/DAOUsers')

  const guest = await DAOUsers.findGuestById(id)
  if (guest.length !== 0) {
      await DAOUsers.deleteGuest(id)
      return {status: 200, message:'Removed !'}
  } else {
      return {status: 404, message:'Guest not exist'}
  }
}

/**
 * return all Guests who are never meet with the user from the database
 * @params {int} id - id of User
 */
 exports.getOldGuest = async function (id) {
  const DAOUsers = require('./dao/DAOUsers')
    const guests = await DAOUsers.getOldGuest(id)
    const arrayGuests = []
    if(guests != undefined) {
      for await (let guest of guests) {
        arrayGuests.push(guest)
      }
      return {status: 200, message: arrayGuests}
    } else {
        return {status: 404, message:'Undefined'}
    }
} 

/**
 * return all Guests who are meet from the database
 * @params {int} id - id of User
 */
exports.getNewGuest = async function (id) {
  const DAOUsers = require('./dao/DAOUsers')

  const guests = await DAOUsers.getNewGuest(id)
  const arrayGuests = []
  if(guests != undefined) {
    for await (let guest of guests) {
      arrayGuests.push(guest)
    }
    return {status: 200, message: arrayGuests}
  } else {
    return {status: 404, message:'Undefined'}
  }
}

exports.getInfos = async function (id) {
  const DAOBills = require('./dao/DAOBills')

  const totalPayed = await DAOBills.getTotalPayed(id)
  const total = await DAOBills.getTotal(id)
  const totalWaiting = await DAOBills.getTotalWaiting(id)

  const payload = {
    totalPayed: totalPayed,
    total: total,
    totalWaiting: totalWaiting
  }
  if(totalPayed != undefined) {
    return {status: 200, message: payload}
  } else {
    return {status: 404, message:'Undefined'}
  }
}
