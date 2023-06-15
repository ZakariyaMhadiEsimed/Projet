const connection = require("../db/index.js");

const columns = ['name', 'statusId']
/**
 * return one User from the database
 * @params {string} mail - mail of User to find
 */
const getAllProjects = async function (id, page, size, searchValue) {
  const offset = page * size; // Index de départ
  const limit = size; // Nombre d'éléments à récupérer
  let sql = "SELECT * FROM projets WHERE projets.userId='" + id + "'";

  if (searchValue && searchValue.trim() !== "") {
    sql += " AND (";
    sql += columns.map((column) => {
      return `projets.${column} LIKE '%${searchValue}%'`;
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


const getCountAllProjects = async function (id, searchValue) {
  let sql = `SELECT COUNT(*) AS count FROM projets WHERE projets.userId='${id}'`;

  if (searchValue && searchValue.trim() !== "") {
    sql += " AND (";
    sql += columns.map((column) => {
      return `projets.${column} LIKE '%${searchValue}%'`;
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
  getAllProjects,
  getCountAllProjects
};
