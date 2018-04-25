var expect = require("expect.js");

var Eventflit = require("../../../lib/eventflit");
var WebHook = require("../../../lib/webhook");

describe("Eventflit", function() {
  var eventflit;

  beforeEach(function() {
    eventflit = new Eventflit({ appId: 10000, key: "aaaa", secret: "beef" });
  });

  describe("#webhook", function() {
    it("should return a WebHook instance", function() {
      expect(eventflit.webhook({ headers: {}, body: "" })).to.be.a(WebHook);
    });

    it("should pass the token to the WebHook", function() {
      expect(
        eventflit.webhook({ headers: {}, body: "" }).token
      ).to.be(eventflit.config.token);
    });
  });
});
