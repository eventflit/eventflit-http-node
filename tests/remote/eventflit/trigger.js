var expect = require("expect.js");

var Eventflit = require("../../../lib/eventflit");

describe("Eventflit (integration)", function() {
  var eventflit;

  beforeEach(function() {
    eventflit = new Eventflit.forURL(process.env.EVENTFLIT_URL);
  });

  describe("#trigger", function() {
    it("should return code 200", function(done) {
      eventflit.trigger("integration", "event", "test", null, function(error, request, response) {
        expect(error).to.be(null);
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body)).to.eql({});
        done();
      });
    });
  });

  describe("#triggerBatch", function() {
    it("should return code 200", function(){
      eventflit.triggerBatch([{
        channel: "integration",
        name: "event",
        data: "test"
      },
      {
        channel: "integration2",
        name: "event2",
        data: "test2"
      }], function(error, request, response){
        expect(error).to.be(null);
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.body)).to.eql({});
        done();
      });
    });
  });
});
