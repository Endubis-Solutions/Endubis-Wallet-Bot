const log = require("node-file-logger");
const options = {
  timeZone: "Africa/Addis_Ababa",
  folderPath: "./logs/",
  dateBasedFileNaming: true,
  fileNamePrefix: "Logs_",
  fileNameSuffix: "",
  fileNameExtension: ".log",

  dateFormat: "YYYY-MM-DD",
  timeFormat: "HH:mm:ss.SSS",
  logLevel: "debug",
  onlyFileLogging: true,
};

log.SetUserOptions(options);

module.exports = log;
