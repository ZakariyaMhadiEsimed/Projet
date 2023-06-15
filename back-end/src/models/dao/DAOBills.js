const connection = require("../db/index.js");

const columns = ['number', 'paymentLimits', "paymentDate", "paymentTypeId", 'statusId']
/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
const getAllBills = async function (id, page, size, searchValue) {
  const offset = page * size; // Index de départ
  const limit = size; // Nombre d'éléments à récupérer
  let sql = "SELECT * FROM factures WHERE factures.userId='" + id + "'";

  if (searchValue && searchValue.trim() !== "") {
    sql += " AND (";
    sql += columns.map((column) => {
      return `factures.${column} LIKE '%${searchValue}%'`;
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


const getCountAllBills = async function (id, searchValue) {
  let sql = `SELECT COUNT(*) AS count FROM factures WHERE factures.userId='${id}'`;

  if (searchValue && searchValue.trim() !== "") {
    sql += " AND (";
    sql += columns.map((column) => {
      return `factures.${column} LIKE '%${searchValue}%'`;
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

module.exports = {
  getAllBills,
  getCountAllBills
};
