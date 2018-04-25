var Config = require('./config');
var util = require('./util');

function EventflitConfig(options) {
	Config.call(this, options);

  if (options.host) {
    this.host = options.host
  }
  else if (options.cluster) {
    this.host = "api-"+options.cluster+".eventflit.com";
  }
  else {
    this.host = "service.eventflit.com";
  }
}

util.mergeObjects(EventflitConfig.prototype, Config.prototype);

EventflitConfig.prototype.prefixPath = function(subPath) {
  return "/apps/" + this.appId + subPath;
};

module.exports = EventflitConfig;
