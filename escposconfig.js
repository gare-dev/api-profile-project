const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const device = new escpos.USB();
const printer = new escpos.Printer(device);

module.exports = [device, printer];
