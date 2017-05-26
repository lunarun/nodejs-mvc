module.exports.getLogger = getLogger;

var log4js = require('log4js');
log4js.configure(sails.config.log4js.configure);

var InnerLogger = function (name) {
  this.logger = log4js.getLogger(name);
  this.logger.setLevel(sails.config.log4js.level);
};

InnerLogger.prototype.error = function () {
  this.logger.error.apply(this.logger, arguments);
  console.error.apply(console, arguments);
};

InnerLogger.prototype.warn = function () {
  this.logger.warn.apply(this.logger, arguments);
  console.warn.apply(console, arguments);
};

InnerLogger.prototype.info = function () {
  this.logger.info.apply(this.logger, arguments);
  console.info.apply(console, arguments);
};

InnerLogger.prototype.debug = function () {
  this.logger.debug.apply(this.logger, arguments);
  console.log.apply(console, arguments);
};

InnerLogger.prototype.log = InnerLogger.prototype.debug;

function getLogger(name) {
  return new InnerLogger(name);
}
