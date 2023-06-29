const connection = require("../db/index.js");
const bcrypt = require("bcryptjs");
const {passwordsAreEqual} = require("../../security/crypto");

/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
const findUserByMail = async function (mail) {
  const sql =
    "SELECT * FROM utilisateurs WHERE utilisateurs.email='" + mail + "';";
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          let queryResult;
          Object.keys(result).forEach(function (key) {
            queryResult = result[key];
          });
          resolve(queryResult);
        }
      });
    });
    return { ...result };
  } catch (err) {
    console.error("error : ", err);
    throw err;
  }
};

const findUserByMailAndPassword = async function (mail, password) {
  const sql =
      "SELECT * FROM utilisateurs WHERE utilisateurs.email='" + mail + "';";
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          let queryResult;
          Object.keys(result).forEach(function (key) {
            queryResult = result[key];
          });
          resolve(queryResult);
        }
      });
    });
    if (result && passwordsAreEqual(password, result.password)) {
      return { ...result };
    } else {
      return null; // Mot de passe incorrect ou utilisateur non trouvé
    }
  } catch (err) {
    console.error("error : ", err);
    throw err;
  }
};

/**
 * return one User from the database
 * @params {int} id - id of User
 */
const findUserById = async function (id) {
  const sql =
      "SELECT * FROM utilisateurs WHERE utilisateurs.id='" + id + "';";
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          let queryResult;
          Object.keys(result).forEach(function (key) {
            queryResult = result[key];
          });
          resolve(queryResult);
        }
      });
    });
    result.password = ''
    return { ...result };
  } catch (err) {
    console.error("error : ", err);
    throw err;
  }
};

/**
 * add new User in database
 * @params {string} mail - mail of user
 * @params {string} pseudo - pseudo of user
 * @params {string} password - password of user
 */
const addUser = async function (data) {
  const { lastName, firstName, birthDate, CA, postalAdress, phone, taxes, email, password } = data;
  const sql = "INSERT INTO utilisateurs (lastName, firstName, birthDate, CA, postalAdress, phone, taxes, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [lastName, firstName, birthDate, CA, postalAdress, phone, taxes, email, password];

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, values, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    if (result.affectedRows > 0) {
      // L'insertion a réussi, vous pouvez retourner les données insérées si nécessaire
      return { success: true };
    } else {
      return null; // Échec de l'insertion
    }
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
};

/**
 * update User in database
 * @params {int} id - id of User
 * @params {string} pseudo - name of user
 * @params {string} lastName - lastName of user
 * @params {string} password - password of user
 */
const updateUser = async function (data) {
  const { lastName, firstName, birthDate, CA, postalAdress, phone, taxes, email, password } = data;
  const sql = "UPDATE utilisateurs SET lastName = ?, firstName = ?, birthDate = ?, CA = ?, postalAdress = ?, phone = ?, taxes = ?, email = ?, password = ? WHERE id = ?";
  const values = [lastName, firstName, birthDate, CA, postalAdress, phone, taxes, email, password, data.id];

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, values, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    if (result.affectedRows > 0) {
      // La mise à jour a réussi, vous pouvez retourner les données mises à jour si nécessaire
      return { success: true };
    } else {
      return null; // Échec de la mise à jour
    }
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
};

module.exports = {
  findUserByMail,
  findUserByMailAndPassword,
  findUserById,
  addUser,
  updateUser,
};
