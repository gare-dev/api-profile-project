const RequestLog = require("../models/RequestLogModel");
const printer = require("../escposConfig")[1]; // Acessando a instância da impressora
const device = require("../escposConfig")[0];

const RequestLogController = {
  requestLog: async (req, res, next) => {
    const method = req.method;
    const endpoint = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const payload = JSON.stringify(req.body);

    const request = [method, endpoint, ip, userAgent, payload];

    try {
      await RequestLog.SaveRequest(method, endpoint, ip, userAgent, payload);
      // device.open(() => {
      //   printer.size(0.1, 0.1);
      //   printer.text(JSON.stringify(request[0]));
      //   printer.text(JSON.stringify(request[1]));
      //   printer.text(JSON.stringify(request[2]));
      //   printer.text(JSON.stringify(request[3]));
      //   printer.text(JSON.stringify(request[4]));

      //   printer.cut().close();
      // });
    } catch (error) {
      console.error("Error logging the request: ", error);
    }

    next();
  },
};

module.exports = RequestLogController;
