/** Contains information about an HTTP request error.
 *
 * @constructor
 * @extends Error
 * @param {String} message error message
 * @param {String} url request URL
 * @param [error] optional error cause
 * @param {Integer} [statusCode] response status code, if received
 * @param {String} [statusCode] response body, if received
 */
function RequestError(message, url, error, statusCode, body) {
    this.name = 'EventflitRequestError';
    this.stack = (new Error()).stack;

    /** @member {String} error message */
    this.message = message;
    /** @member {String} request URL */
    this.url = url;
    /** @member optional error cause */
    this.error = error;
    /** @member {Integer} response status code, if received */
    this.statusCode = statusCode;
    /** @member {String} response body, if received */
    this.body = body;
}
RequestError.prototype = new Error();

/** Contains information about a WebHook error.
 *
 * @constructor
 * @extends Error
 * @param {String} message error message
 * @param {String} contentType WebHook content type
 * @param {String} body WebHook body
 * @param {String} signature WebHook signature
 */
function WebHookError(message, contentType, body, signature) {
    this.name = 'EventflitWebHookError';
    this.stack = (new Error()).stack;

    /** @member {String} error message */
    this.message = message;
    /** @member {String} WebHook content type */
    this.contentType = contentType;
    /** @member {String} WebHook body */
    this.body = body;
    /** @member {String} WebHook signature */
    this.signature = signature;
}
WebHookError.prototype = new Error();

exports.RequestError = RequestError;
exports.WebHookError = WebHookError;
