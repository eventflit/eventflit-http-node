var Config = require('./config');
var util = require('./util');

var DEFAULT_HOST = "push.eventflit.com";
var API_PREFIX = "publisher/app/";

function NotificationConfig(options) {
	Config.call(this, options);
	this.host = options.host || DEFAULT_HOST;
}

util.mergeObjects(NotificationConfig.prototype, Config.prototype);

NotificationConfig.prototype.prefixPath = function(subPath) {
  return "/" + API_PREFIX + this.appId + subPath;
};

module.exports = NotificationConfig;
