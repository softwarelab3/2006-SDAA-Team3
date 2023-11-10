const ReportManager = require("./classes/ReportManager");
const config = require("./classes/UserDatabaseConfiguration"); // Correct path to the configuration file

const reportMan = new ReportManager(config);
console.log(reportMan.findReport());