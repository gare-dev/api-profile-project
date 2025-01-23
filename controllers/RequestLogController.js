const RequestLog = require("../models/RequestLogModel");

const RequestLogController = {
  requestLog: async (req, res, next) => {
    const method = req.method;
    const endpoint = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const payload = JSON.stringify(req.body);

    try {
      await RequestLog.SaveRequest(method, endpoint, ip, userAgent, payload);
    } catch (error) {
      console.error("Error logging the request: ", error);
    }

    next();
  },
};

module.exports = RequestLogController;
