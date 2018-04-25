var expect = require("expect.js");

var Eventflit = require("../../../lib/eventflit");

describe("Eventflit", function() {
  describe("constructor attributes", function() {
    it("should support `appId`", function() {
      var eventflit = new Eventflit({ appId: 12345 });
      expect(eventflit.config.appId).to.equal(12345);
    });

    it("should support `token`", function() {
      var eventflit = new Eventflit({
        key: "1234567890abcdef",
        secret: "fedcba0987654321"
      });
      expect(eventflit.config.token.key).to.equal("1234567890abcdef");
      expect(eventflit.config.token.secret).to.equal("fedcba0987654321");
    });

    it("should default `encrypted` to false", function() {
      var eventflit = new Eventflit({});
      expect(eventflit.config.scheme).to.equal("http");
    });

    it("should support `encrypted`", function() {
      var eventflit = new Eventflit({ encrypted: true });
      expect(eventflit.config.scheme).to.equal("https");
    });

    it("should default `host` to 'service.eventflit.com'", function() {
      var eventflit = new Eventflit({});
      expect(eventflit.config.host).to.equal("service.eventflit.com");
    });

    it("should support `host`", function() {
      var eventflit = new Eventflit({ host: "example.org" });
      expect(eventflit.config.host).to.equal("example.org");
    });

    it("should support `cluster`", function () {
      var eventflit = new Eventflit({cluster: 'eu'});
      expect(eventflit.config.host).to.equal('api-eu.eventflit.com')
    });

    it("should have `host` override `cluster`", function () {
      var eventflit = new Eventflit({host: 'service.eventflit.com', cluster: 'eu'});
      expect(eventflit.config.host).to.equal('service.eventflit.com');
    });

    it("should default `port` to undefined", function() {
      var eventflit = new Eventflit({ encrypted: true });
      expect(eventflit.config.port).to.be(undefined);
    });

    it("should support `port`", function() {
      var eventflit = new Eventflit({ port: 8080 });
      expect(eventflit.config.port).to.equal(8080);

      eventflit = new Eventflit({ encrypted: true, port: 8080 });
      expect(eventflit.config.port).to.equal(8080);
    });

    it("should default `proxy` to `undefined`", function() {
      var eventflit = new Eventflit({});
      expect(eventflit.config.proxy).to.be(undefined);
    });

    it("should support `proxy`", function() {
      var eventflit = new Eventflit({ proxy: "https://test:tset@example.com" });
      expect(eventflit.config.proxy).to.equal("https://test:tset@example.com");
    });

    it("should default `timeout` to `undefined`", function() {
      var eventflit = new Eventflit({});
      expect(eventflit.config.timeout).to.be(undefined);
    });

    it("should support `timeout`", function() {
      var eventflit = new Eventflit({ timeout: 1001 });
      expect(eventflit.config.timeout).to.equal(1001);
    });
  });
});
