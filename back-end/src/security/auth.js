const { sign, verify } = require('jsonwebtoken') 

exports.generateAuthToken = (userId, mail, firstName, lastName) => {
  return sign(
    { userId, mail, firstName, lastName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  ) 
} 

exports.extractUserId = (token, secret) => {
  return verify(token, secret) 
}
