var expect = require("expect.js");
var nock = require("nock");

var Eventflit = require("../../../lib/eventflit");

describe("Eventflit", function() {
  var eventflit;

  beforeEach(function() {
    eventflit = new Eventflit({ appId: 999, key: "111111", secret: "beef" });
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe("#get", function() {
    it("should set the correct path and include all params", function(done) {
      var mock = nock("http://service.eventflit.com")
        .filteringPath(function(path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/channels?auth_key=111111&auth_timestamp=X&auth_version=1.0&filter_by_prefix=presence-&info=user_count,subscription_count&auth_signature=Y"
        )
        .reply(200, "{}");

      eventflit.get({
        path: "/channels",
        params: {
          filter_by_prefix: "presence-",
          info: "user_count,subscription_count"
        }
      }, done);
    });

    it("should call back with the result", function(done) {
      var mock = nock("http://service.eventflit.com")
        .filteringPath(function(path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y"
        )
        .reply(200, "{\"test key\": \"test value\"}");

      eventflit.get({ path: "/test", params: {} }, function(error, request, response) {
        expect(error).to.be(null);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal("{\"test key\": \"test value\"}");
        done();
      });
    });

    it("should call back with a RequestError if Eventflit responds with 4xx", function(done) {
      var mock = nock("http://service.eventflit.com")
        .filteringPath(function(path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y"
        )
        .reply(400, "Error");

      eventflit.get({ path: "/test", params: {} }, function(error, request, response) {
        expect(error).to.be.a(Eventflit.RequestError);
        expect(error.message).to.equal("Unexpected status code 400");
        expect(error.url).to.match(
          /^http:\/\/service.eventflit.com\/apps\/999\/test\?auth_key=111111&auth_timestamp=[0-9]+&auth_version=1\.0&auth_signature=[a-f0-9]+$/
        );
        expect(error.statusCode).to.equal(400);
        expect(error.body).to.equal("Error");
        done();
      });
    });

    it("should respect the encryption, host and port config", function(done) {
      var eventflit = new Eventflit({
        appId: 999,
        key: "111111",
        secret: "beef",
        encrypted: true,
        host: "example.com",
        port: 1234
      });
      var mock = nock("https://example.com:1234")
        .filteringPath(function(path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y"
        )
        .reply(200, "{\"test key\": \"test value\"}");

      eventflit.get({ path: "/test", params: {} }, done);
    });

    it("should respect the timeout when specified", function(done) {
      var eventflit = new Eventflit({
        appId: 999,
        key: "111111",
        secret: "beef",
        timeout: 100
      });
      var mock = nock("http://service.eventflit.com")
        .filteringPath(function(path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y"
        )
        .delayConnection(200)
        .reply(200);

      eventflit.get({ path: "/test", params: {} }, function(error, request, response) {
        var expectedError = new Error("ETIMEDOUT");
        expectedError.code = "ETIMEDOUT";
        expectedError.connect = undefined;

        expect(error).to.be.a(Eventflit.RequestError);
        expect(error.message).to.equal("Request failed with an error");
        expect(error.error).to.eql(expectedError);
        expect(error.url).to.match(
          /^http:\/\/service.eventflit.com\/apps\/999\/test\?auth_key=111111&auth_timestamp=[0-9]+&auth_version=1\.0&auth_signature=[a-f0-9]+$/
        );
        expect(error.statusCode).to.equal(null);
        expect(error.body).to.equal(null);
        done();
      });
    });
  });
});
