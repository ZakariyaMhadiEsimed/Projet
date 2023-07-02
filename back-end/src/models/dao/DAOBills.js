const connection = require("../db/index.js");
const moment = require("moment/moment");

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

const createBill = async function (id, data) {
  const { projectId, paymentLimits, paymentTypeId, lines, number, footer, total } = data;
  const sql = "INSERT INTO factures (userId, projectId, paymentLimits, paymentTypeId, number, footer, total) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [id, projectId, paymentLimits, paymentTypeId, number, footer, total];
  let billId
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
      billId = result.insertId
      const otherSql = "INSERT INTO lignes (userId, billId, content) VALUES (?, ?, ?)";
      const otherValues = [id, billId, JSON.stringify(lines)];

      const otherResult = await new Promise((resolve, reject) => {
        connection.query(otherSql, otherValues, function (error, result, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
      if (otherResult.affectedRows > 0) {
        return true
      }
      else return false
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
const getBillById = async function (id, projectId) {
  const sql = "SELECT * FROM factures WHERE factures.userId='" + id + "' AND factures.id='" + projectId + "';";
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

    const otherSql = "SELECT * FROM lignes WHERE lignes.userId='" + id + "' AND lignes.billId='" + projectId + "';";
    const otherResult = await new Promise((resolve, reject) => {
      connection.query(otherSql, function (error, result, fields) {
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
    return { ...result, rows: otherResult.content, rowsId: otherResult.id };
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
const updateBill = async function (id, projectId, data) {
  const { paymentLimits, paymentTypeId, lines, footer, total, rowsId } = data;
  const sql = "UPDATE factures SET paymentLimits = ?, paymentTypeId = ?, footer = ?, total = ? WHERE id = ?";
  const values = [paymentLimits, paymentTypeId, footer, total, data.id ];

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, values, function (error, result, fields) {
        if (error) {
          console.error("Error executing update query:", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const otherSql = "UPDATE lignes SET content = ? WHERE id = ?";
    const otherValues = [JSON.stringify(lines), rowsId];
    const otherResult = await new Promise((resolve, reject) => {
      connection.query(otherSql, otherValues, function (error, result, fields) {
        if (error) {
          console.error("Error executing second update query:", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    return true;
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
const deleteBill = async function (id, billId) {
  const sql =
      "DELETE FROM factures WHERE factures.userId='" + id + "' AND factures.id='" + billId + "';";
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
    return !!result;
  } catch (err) {
    console.error("error : ", err);
    throw err;
  }
};

const getBillSameDay = async function (id, value) {
  const sql = `
    SELECT COUNT(*) AS count FROM factures 
    WHERE factures.userId = '${id}' 
    AND factures.number LIKE '%${value}%';
  `;
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

const getBillPayed = async function (id, billId) {
  const paymentDate = moment().format('DD-MM-YYYY')
  const sql = `
    UPDATE factures 
    SET statusId = '2', paymentDate='${paymentDate}'
    WHERE userId = '${id}' AND id = '${billId}';
  `;

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
    console.error("error: ", err);
    throw err;
  }
};

const getBillSend = async function (id, billId) {
  const sql = `
    UPDATE factures 
    SET statusId = '1'
    WHERE userId = '${id}' AND id = '${billId}';
  `;

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
    console.error("error: ", err);
    throw err;
  }
};

const getBillEdit = async function (id, billId) {
  const sql = `
    UPDATE factures 
    SET statusId = '0'
    WHERE userId = '${id}' AND id = '${billId}';
  `;

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
    console.error("error: ", err);
    throw err;
  }
};

const getBillsOfProject = async function (id) {
  const sql =
      "SELECT * FROM factures WHERE factures.projectId='" + id + "';";
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result); // Renvoie le tableau complet de résultats
        }
      });
    });
    return [...result]; // Renvoie une copie du tableau de résultats
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
};

const getTotalPayed = async function (id) {
  const sql =
      "SELECT SUM(factures.total) AS totalPayed FROM factures WHERE userId = ? AND statusId = 2 AND STR_TO_DATE(paymentLimits, '%d-%m-%Y') > DATE_SUB(NOW(), INTERVAL 1 YEAR)";

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, [id], function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result[0].totalPayed);
        }
      });
    });

    return result;
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
};

const getTotal = async function (id) {
  const sql =
      "SELECT SUM(factures.total) AS total FROM factures WHERE userId = ? AND STR_TO_DATE(paymentLimits, '%d-%m-%Y') > DATE_SUB(NOW(), INTERVAL 1 YEAR)";

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, [id], function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result[0].total);
        }
      });
    });

    return result;
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
};

const getTotalWaiting = async function (id) {
  const sql =
      "SELECT SUM(factures.total) AS totalWaiting FROM factures WHERE userId = ? AND statusId = 1 AND STR_TO_DATE(paymentLimits, '%d-%m-%Y') > DATE_SUB(NOW(), INTERVAL 1 YEAR)";
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, [id], function (error, result, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(result[0].totalWaiting);
        }
      });
    });
    return result;
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
};



module.exports = {
  createBill,
  getAllBills,
  getBillById,
  getCountAllBills,
  getBillSameDay,
  getBillPayed,
  getBillSend,
  getBillEdit,
  updateBill,
  deleteBill,
  getBillsOfProject,
  getTotalPayed,
  getTotal,
  getTotalWaiting
};
