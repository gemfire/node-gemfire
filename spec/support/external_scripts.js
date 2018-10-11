const childProcess = require('child_process');

const errorMatchers = require("./error_matchers");

function runExternalTest(name, callback) {
  if(!callback) { throw("You must pass a callback");  }

  var filename = "spec/support/scripts/" + name + ".js";

  childProcess.execFile("node", [filename], callback);
}

exports.expectExternalSuccess = function expectExternalSuccess(name, callback){
  jasmine.addMatchers(errorMatchers);

  runExternalTest(name, function(error, stdout, stderr) {
    expect(error).not.toBeError();
    expect(stderr).toEqual('');
    callback(error, stdout, stderr);
  });
};

exports.expectExternalFailure = function expectExternalFailure(name, callback, message){
  jasmine.addMatchers(errorMatchers);
  runExternalTest(name, function(error, stdout, stderr) {
    expect(error).not.toBeNull();
    expect(stderr.indexOf(message) >= 0).toBe(true);
    // Since this test expects an error we have to clear the error so the test harness doesn't fail the test due to the error.
    error = null;
    callback(error, stdout, stderr);
  });
};
