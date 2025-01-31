const jwt = require("jsonwebtoken");
const HackerInfoModel = require("../models/HackerInfoModel");
const ProfileModel = require("../models/ProfileModel");

async function verifyName(req, res, next) {
  const jwtToken = jwt.decode(req.headers["authorization"]);
  const { name } = req.body;
  const method = req.method;
  const endpoint = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const payload = JSON.stringify(req.body);

  if (name) {
    const result = await ProfileModel.checkUsername(name);
    const id = result.rows[0].id;

    if (jwtToken.name !== name && id !== jwtToken.id) {
      try {
        await HackerInfoModel.SaveHackerInfo(
          method,
          endpoint,
          ip,
          userAgent,
          payload
        );
      } catch (error) {
        console.error("Error logging hackerinfo", error);
      }
      return res.status(403).json({ message: "Hacker identified" });
    }
    next();
  }
}

module.exports = verifyName;
