var expect = require("expect.js");

var Eventflit = require("../../../lib/eventflit");

describe("Eventflit", function() {
  describe(".forUrl", function() {
    it("should set the `appId` attribute", function() {
      var eventflit = Eventflit.forURL("https://123abc:def456@example.org/apps/4321");
      expect(eventflit.config.appId).to.equal(4321);
    });

    it("should set the `token` attribute", function() {
      var eventflit = Eventflit.forURL("https://123abc:def456@example.org/apps/4321");
      expect(eventflit.config.token.key).to.equal("123abc");
      expect(eventflit.config.token.secret).to.equal("def456");
    });

    it("should set the `scheme` attribute", function() {
      var eventflit = Eventflit.forURL("https://123abc:def456@example.org/apps/4321");
      expect(eventflit.config.scheme).to.equal("https");
    });

    it("should set the `host` attribute", function() {
      var eventflit = Eventflit.forURL("https://123abc:def456@example.org/apps/4321");
      expect(eventflit.config.host).to.equal("example.org");
    });

    it("should set the `port` attribute if specified", function() {
      var eventflit = Eventflit.forURL("https://123abc:def456@example.org:999/apps/4321");
      expect(eventflit.config.port).to.equal(999);
    });

    it("should default the `port` attribute to undefined", function() {
      var eventflit = Eventflit.forURL("http://123abc:def456@example.org/apps/4321");
      expect(eventflit.config.port).to.be(undefined);
    });
  });
});
