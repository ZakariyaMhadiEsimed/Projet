const { generateHashedPassword } = require('../security/crypto')

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
  const { mail, password, pseudo } = data

  if (!mail) return {status: 422, message:'Mail required.'}
  if (!password) return  {status: 422, message:'Password required.'}
  if (!pseudo) return {status: 422, message:'Pseudo required.'}

  const user = await DAOUsers.findUserByMail(mail)
  if (user.length === 0){
      await DAOUsers.addUser(mail, password, pseudo)
      return {status: 200, message:'User Added !'}
  } else {
      return {status: 409, message:'User already exist'} //conflict
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
  foundUser[0].pseudo = data.pseudo || foundUser.pseudo 
  foundUser[0].mail = data.mail || foundUser.mail 
  foundUser[0].password = data.password ? generateHashedPassword(data.password) : foundUser[0].password 

  await DAOUsers.updateUser(foundUser[0].id, foundUser[0].mail, foundUser[0].password, foundUser[0].pseudo)
  return true 
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
