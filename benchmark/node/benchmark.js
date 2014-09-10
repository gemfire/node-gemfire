const randomString = require('random-string');
const _ = require('lodash');
const microtime = require("microtime");
const async = require('async');

const gemfire = require('../..');
const cache = new gemfire.Cache('benchmark/xml/BenchmarkClient.xml');
const region = cache.getRegion("exampleRegion");

console.log("node-gemfire version " + gemfire.version);
console.log("GemFire version " + gemfire.gemfireVersion);

function smokeTest(callback) {
  region.put('smoke', { test: 'value' }, function(error){
    if(error) {
      throw error;
    }

    region.get('smoke', function(error, value) {
      if(error) {
        throw error;
      }

      if(JSON.stringify(value) !== JSON.stringify({ test: 'value' })) {
        throw "Smoke test failed.";
      }

      callback();
    });
  });
}

var keyOptions = {
  length: 8,
  numeric: true,
  letter: true,
  special: false
};

var valueOptions = {
  length: 15 * 1024,
  numeric: true,
  letter: true,
  special: true
};

var randomObject = require('../data/randomObject.json');
var stringValue = randomString(valueOptions);
var gemfireKey = randomString(keyOptions);

var suffix = 0;
function benchmark(numberOfPuts, title, functionToTest, callback) {
  region.clear();

  var start = microtime.now();

  async.series([
    function(next) { functionToTest(numberOfPuts, next); },
    function(next) {
      var microseconds = microtime.now() - start;
      var seconds = (microseconds / 1000000);

      var putsPerSecond = Math.round(numberOfPuts / seconds);
      var usecPerPut = Math.round(microseconds / numberOfPuts);

      console.log(
        "(" + title + ") " + numberOfPuts + " puts: ", + usecPerPut + " usec/put " + putsPerSecond + " puts/sec"
      );

      next();
    }
  ], callback);
}

function putNValues(value) {
  var successes = 0;

  return function(iterationCount, callback) {
    function putCallback(error) {
      if(error) {
        throw error;
      } else {
        successes++;

        if(successes == iterationCount) {
          callback();
        }
      }
    }

    for(var i = 0; i < iterationCount; i++) {
      suffix++;
      region.put(gemfireKey + suffix, value, putCallback);
    }
  };
}

function benchmarkStrings(numberOfPuts, callback){
  return benchmark(numberOfPuts, "string", putNValues(stringValue), callback);
}

function benchmarkSimpleObjects(numberOfPuts, callback){
  return benchmark(numberOfPuts, "simple object", putNValues({ foo: stringValue }), callback);
}

function benchmarkComplexObjects(numberOfPuts, callback){
  return benchmark(numberOfPuts, "complex object", putNValues(randomObject), callback);
}

async.series([
  function(next){ return smokeTest(next); },
  function(next){ return benchmarkStrings(10000, next); },
  function(next){ return benchmarkSimpleObjects(1000, next); },
  function(next){ return benchmarkComplexObjects(100, next); }
]);
