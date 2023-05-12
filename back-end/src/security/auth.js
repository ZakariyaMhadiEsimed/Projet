const { sign, verify } = require('jsonwebtoken') 

exports.generateAuthToken = (userId, mail) => {
  return sign(
    { userId, mail },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  ) 
} 

exports.extractUserId = (token, secret) => {
  return verify(token, secret) 
}
