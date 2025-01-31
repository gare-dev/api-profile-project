const db = require("../config/db");
const cryptr = require("../cryptr/cryptr");

const Profile = {
  createProfile: async (name, password) => {
    try {
      const query =
        "INSERT INTO Profile (name, password) VALUES ($1, $2) RETURNING *";
      const values = [name, cryptr.encrypt(password)];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  checkUsername: async (name) => {
    try {
      const query = "SELECT * FROM Profile where name = $1";
      const values = [name];
      const result = await db.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  },
  loginProfile: async (name, password) => {
    try {
      const query = "SELECT * FROM Profile where name = $1 AND password = $2";
      const values = [name, password];
      const result = await db.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllProfiles: async () => {
    try {
      const query = "SELECT * FROM Profile";
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  getProfile: async (id) => {
    try {
      const query = "SELECT * FROM Profile where id = $1";
      const values = [id];
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  deleteProfile: async (id) => {
    try {
      const query = "DELETE FROM Profile where id = $1";
      const values = [id];
      const result = await db.query(query, values);
      return result.rowCount;
    } catch (error) {
      throw error;
    }
  },
  editProfile: async (name, newName, newLastName) => {
    try {
      const query =
        "UPDATE Profile SET name = $1, lastName = $2 WHERE name = $3";
      const values = [newName, newLastName, name];
      return await db.query(query, values);
    } catch (error) {
      throw error;
    }
  },
  changePassword: async (name, newPassword, password) => {
    const values = [name, password];
    try {
      const query = "SELECT * FROM Profile where name = $1 AND password = $2";
      const result = await db.query(query, values);
      if (result.rowCount === 1) {
        try {
          const query = "UPDATE Profile SET password = $1 WHERE name = $2";
          const values = [cryptr.encrypt(newPassword), name];
          return await db.query(query, values);
        } catch (error) {
          throw error;
        }
      }

      return false;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Profile;
