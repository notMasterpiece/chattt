import path from "path";

let config = {};

config.logFileDir = path.join(__dirname, '../../log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'grawdanin';
config.dbPort = process.env.dbPort || 'grawdanin1@ds211865.mlab.com:11865';
config.dbName = process.env.dbName || 'chating_me';
config.serverPort = process.env.serverPort || 3001;

export default config;