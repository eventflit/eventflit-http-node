var expect = require("expect.js");

var Eventflit = require("../../../lib/eventflit");

describe("Eventflit", function() {
  describe(".forCluster", function() {
    it("should generate a hostname for the cluster", function() {
      var eventflit = Eventflit.forCluster("test");
      expect(eventflit.config.host).to.equal("api-test.eventflit.com");
    });

    it("should override the hostname if set in the extra options", function () {
      var eventflit = Eventflit.forCluster('eu', {
        host: 'service.eventflit.com'
      });
      expect(eventflit.config.host).to.equal('api-eu.eventflit.com');
    });

    it("should use the cluster option passed as first param not the option", function () {
      var eventflit = Eventflit.forCluster('eu', {
        cluster: 'mt1'
      });
      expect(eventflit.config.host).to.equal('api-eu.eventflit.com');
    });
  });
});
