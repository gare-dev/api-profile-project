const jwt = require("jsonwebtoken");
const HackerInfoModel = require("../models/HackerInfoModel");

async function verifyName(req, res, next) {
  const jwtToken = jwt.decode(req.headers["authorization"]);
  const { name } = req.body;
  const method = req.method;
  const endpoint = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const payload = JSON.stringify(req.body);

  if (name) {
    if (jwtToken.name !== name) {
      try {
        await HackerInfoModel.SaveHackerInfo(
          method,
          endpoint,
          ip,
          userAgent,
          payload
        );
      } catch (error) {
        console.error("Error loggin hackerinfo", error);
      }
      return res.status(403).json({ message: "Hacker identified" });
    }
    next();
  }
}

module.exports = verifyName;
