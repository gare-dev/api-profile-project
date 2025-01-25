const db = require("../config/db");

const HackerInfoModel = {
  SaveHackerInfo: async (method, endpoint, ip, userAgent, payload) => {
    try {
      const query =
        "INSERT INTO HackerInfo (method, endpoint, ip, user_agent, timestamp, payload) VALUES ($1, $2, $3, $4, NOW(), $5)";
      const values = [method, endpoint, ip, userAgent, payload];
      await db.query(query, values);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = HackerInfoModel;
