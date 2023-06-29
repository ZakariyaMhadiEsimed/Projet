const connection = require("../db/index.js");
const bcrypt = require("bcryptjs");
const {passwordsAreEqual} = require("../../security/crypto");

const columns = ['firstName', 'lastName', 'postalAdress', 'phone', 'email']
/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
const getAllCustomers = async function (id, page, size, searchValue) {
  const offset = page * size; // Index de départ
  const limit = size; // Nombre d'éléments à récupérer
  let sql = "SELECT * FROM clients WHERE clients.userId='" + id + "'";

  if (searchValue && searchValue.trim() !== "") {
    sql += " AND (";
    sql += columns.map((column) => {
      return `clients.${column} LIKE '%${searchValue}%'`;
    }).join(" OR ");
    sql += ")";
  }

  sql += ` LIMIT ${offset}, ${limit};`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    return [...result]; // Convertit le résultat en tableau
  } catch (err) {
    console.error("error : ", err);
    throw err;
  }
};


const getCountAllCustomers = async function (id, searchValue) {
  let sql = `SELECT COUNT(*) AS count FROM clients WHERE clients.userId='${id}'`;

  if (searchValue && searchValue.trim() !== "") {
    sql += " AND (";
    sql += columns.map((column) => {
      return `clients.${column} LIKE '%${searchValue}%'`;
    }).join(" OR ");
    sql += ")";
  }

  sql += ";";

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

const createCustomer = async function (id, data) {
  const { lastName, firstName, postalAdress, phone, email, typeId } = data;
  const sql = "INSERT INTO clients (userId, isCompany, lastName, firstName, postalAdress, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [id, typeId, lastName, firstName, postalAdress, phone, email];

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
      return true ;
    } else {
      return false; // Échec de l'insertion
    }
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
};

/**
 * return one User from the database
 * @params {int} id - id of User
 */
const getCustomerById = async function (id, customerId) {
  const sql =
      "SELECT * FROM clients WHERE clients.userId='" + id + "' AND clients.id='" + customerId + "';";
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

/**
 * update User in database
 * @params {int} id - id of User
 * @params {string} pseudo - name of user
 * @params {string} lastName - lastName of user
 * @params {string} password - password of user
 */
const updateCustomer = async function (id, data) {
  const { lastName, firstName, postalAdress, phone, email, isCompany } = data;
  const sql = "UPDATE clients SET lastName = ?, firstName = ?, postalAdress = ?, phone = ?, email = ?, isCompany = ? WHERE id = ? AND userId = ?";
  const values = [lastName, firstName, postalAdress, phone, email, isCompany, data.id, id];

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

/**
 * delete User in database
 * @params {int} id - id of User
 * @params {string} pseudo - name of user
 * @params {string} lastName - lastName of user
 * @params {string} password - password of user
 */
const deleteCustomer = async function (id, customerId) {
  const sql =
      "DELETE FROM clients WHERE clients.userId='" + id + "' AND clients.id='" + customerId + "';";
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

/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
const getAllCustomersByUserId = async function (id) {
  let sql = "SELECT * FROM clients WHERE clients.userId='" + id + "'";
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    return [...result];
  } catch (err) {
    console.error("error : ", err);
    throw err;
  }
};

const lockOrUnlockDeleteCustomer = async function (id, value) {
  const sql = "UPDATE clients SET canDelete = ? WHERE id = ? ";
  const values = [value,id];
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
  getAllCustomers,
  getCountAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getAllCustomersByUserId,
  lockOrUnlockDeleteCustomer
};
