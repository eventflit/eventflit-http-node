var expect = require("expect.js");

var Eventflit = require("../../../lib/eventflit");

describe("Eventflit (integration)", function() {
  describe("with keep-alive", function() {
    var eventflit;

    beforeEach(function() {
      eventflit = new Eventflit.forURL(process.env.EVENTFLIT_URL, {
        keepAlive: true
      });
    });

    it("should send 2 sequential requests successfully", function(done) {
      eventflit.get({ path: "/channels" }, function(error, request, response) {
        expect(error).to.be(null);
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body).channels).to.be.an(Object);
        eventflit.get({ path: "/channels" }, function(error, request, response) {
          expect(error).to.be(null);
          expect(response.statusCode).to.equal(200);
          expect(JSON.parse(response.body).channels).to.be.an(Object);
          done();
        });
      });
    });
  });
});
