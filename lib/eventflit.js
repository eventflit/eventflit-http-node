var url = require('url');

var auth = require('./auth');
var errors = require('./errors');
var events = require('./events');
var requests = require('./requests');
var util = require('./util');

var EventflitConfig = require('./eventflit_config');
var Token = require('./token');
var WebHook = require('./webhook');
var NotificationClient = require('./notification_client');

var validateChannel = function(channel) {
  if (typeof channel !== "string" || channel === "" || channel.match(/[^A-Za-z0-9_\-=@,.;]/)) {
    throw new Error("Invalid channel name: '" + channel + "'");
  }
  if (channel.length > 200) {
    throw new Error("Channel name too long: '" + channel + "'");
  }
};

var validateSocketId = function(socketId) {
  if (typeof socketId !== "string" || socketId === "" || !socketId.match(/^\d+\.\d+$/)) {
    throw new Error("Invalid socket id: '" + socketId + "'");
  }
};

/** Callback passed to all REST API methods.
 *
 * @callback requestCallback
 * @param {RequestError} error
 * @param request
 * @param response
 */

/** Provides access to Eventflit's REST API, WebHooks and authentication.
 *
 * @constructor
 * @param {Object} options
 * @param {String} [options.host="service.eventflit.com"] API hostname
 * @param {String} [options.notification_host="service.eventflit.com"] Notification API hostname
 * @param {Boolean} [options.encrypted=false] whether to use SSL
 * @param {Boolean} [options.notification_encrypted=false] whether to use SSL for notifications
 * @param {Integer} [options.port] port, default depends on the scheme
 * @param {Integer} options.appId application ID
 * @param {String} options.key application key
 * @param {String} options.secret application secret
 * @param {String} [options.proxy] HTTP proxy to channel requests through
 * @param {Integer} [options.timeout] request timeout in milliseconds
 * @param {Boolean} [options.keepAlive] whether requests should use keep-alive
 */
function Eventflit(options) {
  this.config = new EventflitConfig(options);
  var notificationOptions = util.mergeObjects({}, options, {
    host: options.notificationHost,
    encrypted: options.notificationEncrypted
  });
  this.notificationClient = new NotificationClient(notificationOptions);
}

/** Create a Eventflit instance using a URL.
 *
 * URL should be in SCHEME://APP_KEY:SECRET_KEY@HOST:PORT/apps/APP_ID form.
 *
 * @param {String} eventflitUrl URL containing endpoint and app details
 * @param {Object} [options] options, see the {@link Eventflit} for details
 * @returns {Eventflit} instance configured for the URL and options
 */
Eventflit.forURL = function(eventflitUrl, options) {
  var apiUrl = url.parse(eventflitUrl);
  var apiPath = apiUrl.pathname.split("/");
  var apiAuth = apiUrl.auth.split(":");

  return new Eventflit(util.mergeObjects({}, options || {}, {
    scheme: apiUrl.protocol.replace(/:$/, ""),
    host: apiUrl.hostname,
    port: parseInt(apiUrl.port, 10) || undefined,
    appId: parseInt(apiPath[apiPath.length-1], 10),
    key: apiAuth[0],
    secret: apiAuth[1]
  }));
};

/** Create a Eventflit instance using a cluster name.
 *
 * @param {String} cluster cluster name
 * @param {Object} [options] options, see the {@link Eventflit} for details
 * @returns {Eventflit} instance configured for the cluster and options
 */
Eventflit.forCluster = function(cluster, options) {
  return new Eventflit(util.mergeObjects({}, options || {}, {
    host: "api-" + cluster + ".eventflit.com"
  }));
};

/** Returns a signature for given socket id, channel and socket data.
 *
 * @param {String} socketId socket id
 * @param {String} channel channel name
 * @param {Object} [data] additional socket data
 * @returns {String} authentication signature
 */
Eventflit.prototype.authenticate = function(socketId, channel, data) {
  validateSocketId(socketId);
  validateChannel(channel);

  return auth.getSocketSignature(this.config.token, channel, socketId, data);
};

/** Triggers an event.
 *
 * Channel names can contain only characters which are alphanumeric, '_' or '-'
 * and have to be at most 200 characters long.
 *
 * Event name can be at most 200 characters long.
 *
 * Calls back with three arguments - error, request and response. When request
 * completes with code < 400, error will be null. Otherwise, error will be
 * populated with response details.
 *
 * @param {String|String[]} channel list of at most 10 channels
 * @param {String} event event name
 * @param data event data, objects are JSON-encoded
 * @param {String} [socketId] id of a socket that should not receive the event
 * @param {requestCallback} [callback]
 * @see RequestError
 */
Eventflit.prototype.trigger = function(channels, event, data, socketId, callback) {
  if (typeof socketId === "function") {
    callback = socketId;
    socketId = undefined;
  }

  if (socketId) {
    validateSocketId(socketId);
  }
  if (!(channels instanceof Array)) {
    // add single channel to array for multi trigger compatibility
    channels = [channels];
  }
  if (event.length > 200) {
    throw new Error("Too long event name: '" + event + "'");
  }
  if (channels.length > 10) {
    throw new Error("Can't trigger a message to more than 10 channels");
  }
  for (var i = 0; i < channels.length; i++) {
    validateChannel(channels[i]);
  }
  events.trigger(this, channels, event, data, socketId, callback);
};

/* Triggers a batch of events
*
* @param {Event[]} An array of events, where Event is
* {
*   name: string,
*   channel: string,
*   data: any JSON-encodable data
* }
*/
Eventflit.prototype.triggerBatch = function(batch, callback) {
  events.triggerBatch(this, batch, callback);
}

Eventflit.prototype.notify = function() {
  this.notificationClient.notify.apply(this.notificationClient, arguments);
}

/** Makes a POST request to Eventflit, handles the authentication.
 *
 * Calls back with three arguments - error, request and response. When request
 * completes with code < 400, error will be null. Otherwise, error will be
 * populated with response details.
 *
 * @param {Object} options
 * @param {String} options.path request path
 * @param {Object} options.params query params
 * @param {String} options.body request body
 * @param {requestCallback} [callback]
 * @see RequestError
 */
Eventflit.prototype.post = function(options, callback) {
  requests.send(
    this.config, util.mergeObjects({}, options, { method: "POST" }), callback
  );
};

/** Makes a GET request to Eventflit, handles the authentication.
 *
 * Calls back with three arguments - error, request and response. When request
 * completes with code < 400, error will be null. Otherwise, error will be
 * populated with response details.
 *
 * @param {Object} options
 * @param {String} options.path request path
 * @param {Object} options.params query params
 * @param {requestCallback} [callback]
 * @see RequestError
 */
Eventflit.prototype.get = function(options, callback) {
  requests.send(
    this.config, util.mergeObjects({}, options, { method: "GET" }), callback
  );
};

/** Creates a WebHook object for a given request.
 *
 * @param {Object} request
 * @param {Object} request.headers WebHook HTTP headers with lower-case keys
 * @param {String} request.rawBody raw WebHook body
 * @returns {WebHook}
 */
Eventflit.prototype.webhook = function(request) {
  return new WebHook(this.config.token, request);
};

/** Builds a signed query string that can be used in a request to Eventflit.
 *
 * @param {Object} options
 * @param {String} options.method request method
 * @param {String} options.path request path
 * @param {Object} options.params query params
 * @param {String} options.body request body
 * @returns {String} signed query string
 */
Eventflit.prototype.createSignedQueryString = function(options) {
  return requests.createSignedQueryString(this.config.token, options);
};

/** Exported {@link Token} constructor. */
Eventflit.Token = Token;
/** Exported {@link RequestError} constructor. */
Eventflit.RequestError = errors.RequestError;
/** Exported {@link WebHookError} constructor. */
Eventflit.WebHookError = errors.WebHookError;

module.exports = Eventflit;
