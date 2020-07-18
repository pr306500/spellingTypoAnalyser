const express = require('express'),
      app     = express(),
      device  = require('express-device'),
      compression  = require('compression'),
      bodyParser   = require('body-parser'),
      helmet       = require('helmet'),
       os      = require('os'),
      morgan  = require('morgan'),
      moment       = require('moment'),
      winston = require('winston'),
      addRequestId = require('express-request-id')(),
      fs = require('fs');
      global.spellCheckr = require('simple-spellchecker');
      global.appConfig = require('./config/apiConfig');
      global.initializeIBMWatson = require('./api/index');
    
try{

const httpProtocol = require("http");
 
let logFolder = `logs/${os.hostname()}`;      

  if (!fs.existsSync(logFolder)) {
      try {
         fs.mkdirSync(logFolder, { recursive: true })
      } catch(e) {
          throw new Error(`Error creating log folder ${logFolder} - ${JSON.stringify(e)}`);
      } 
  }

/**
* Specify a single subnet(part of url) for trusted proxy.
**/
app.set('trust proxy', 'loopback');

/**
* Protects the application from some well known web vulnerabilities by setting HTTP headers appropriately.
**/
app.use(helmet());

/**
* Decrease the size of the response body to increase the speed of a web application.
**/
app.use(compression());

/**
* Capture the device information of the user.
**/
app.use(device.capture({parseUserAgent:true}));

/**
* Allow headers for cross domain.
**/
app.use((req, res, next) => {
    const allowOrigin = req.headers.origin || "*";
    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, X-Mail-Id");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    next();
});

const accessLogStream = fs.createWriteStream(`${logFolder}/access.log`, {flags : 'a'});

global.logger = winston.createLogger({
    transports : [
        new (winston.transports.Stream)({
            timestamp : () => {
                return moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
            },
            formatter : (options) => {
                return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            },
            colorize: true,
            name : 'access-file',
            stream : accessLogStream,
            handleExceptions : true,
            humanReadableUnhandledException : true,
            json : false
        })
    ],
    exitOnError : false
});

/**
* Create server log stream.
**/
const serverLogStream = fs.createWriteStream(`${logFolder}/server.log`, {flags : 'a'});

/**
* Define server log date format.
**/
morgan.token('date', (req, res) => {
    return moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
});

/**
* Define server log request headers to be written.
**/
morgan.token('type', (req, res) => {
    return JSON.stringify(req.headers);
});

/**
* Define server log user device information to be written.
**/
morgan.token('device', (req, res) => {
    return `DEVICE=${JSON.stringify(req.device)}`;
});

/**
* Define server log UUID to be written.
**/
morgan.token('uuid', (req, res) => {
    return `UUID=${res._headers['x-request-id']}`;
});

/**
* Initialize response UUID.
**/
app.use(addRequestId);

/**
* Initialize server log writer.
**/
app.use(morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :type :device :uuid - :response-time ms', {stream: serverLogStream}));

/**
* Initialize post data parsing.
**/
app.use(bodyParser.json());

app.use(require('./controllers'));

/**
* To start express server with secure connection.
**/
let httpServer = httpProtocol.createServer(app);

/**
* Server start port.
**/
httpServer.listen(global.appConfig.app_port, () => {
   global.logger.info(`Server started at port ${global.appConfig.app_port}`);
});

}
catch(e){
  global.logger.error(`Error occured at ${__dirname} - ${e}`);
}