var expect = require("expect.js");

var errors = require("../../../lib/errors");
var Eventflit = require("../../../lib/eventflit");
var Token = require("../../../lib/token");

describe("Eventflit", function() {
  it("should export `Token`", function() {
    expect(Eventflit.Token).to.be(Token);
  });

  it("should export `RequestError`", function() {
    expect(Eventflit.RequestError).to.be(errors.RequestError);
  });

  it("should export `WebHookError`", function() {
    expect(Eventflit.WebHookError).to.be(errors.WebHookError);
  });
});
