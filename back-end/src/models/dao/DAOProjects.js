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

const createProject = async function (id, data) {
  const { name, customerId, abbreviation } = data;
  const sql = "INSERT INTO projets (userId, name, customerId, statusId, abbreviation) VALUES (?, ?, ?, ?, ?)";
  const values = [id, name, customerId, 0, abbreviation ];

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
const getProjectById = async function (id, projectId) {
  const sql =
      "SELECT * FROM projets WHERE projets.userId='" + id + "' AND projets.id='" + projectId + "';";
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
const updateProject = async function (id, projectId, data) {
  const { name, statusId, customerId } = data;
  const sql = "UPDATE projets SET name = ?, statusId = ?, customerId = ? WHERE id = ? AND userId = ?";
  const values = [name, statusId, customerId, projectId, id];

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
const deleteProject = async function (id, projectId) {
  const sql =
      "DELETE FROM projets WHERE projets.userId='" + id + "' AND projets.id='" + projectId + "';";
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

/**
 * return one User from the database
 * @params {int} id - id of User
 */
const getProjectsOfCustomer = async function (id) {
  const sql =
      "SELECT * FROM projets WHERE projets.customerId='" + id + "';";
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

const lockOrUnlockDeleteProject = async function (id, value) {
  const sql = "UPDATE projets SET canDelete = ? WHERE id = ? ";
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

const getAllProjectsByUserId = async function (id) {
  let sql = "SELECT * FROM projets WHERE userId='" + id + "'";
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

module.exports = {
  getAllProjects,
  getCountAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsOfCustomer,
  lockOrUnlockDeleteProject,
  getAllProjectsByUserId
};
