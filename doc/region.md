# Region

A GemFire region is a collection of key-value pair entries. The most common way to get a region is to call `cache.getRegion('regionName')` on a Cache.

## region.attributes

Returns an object describing the attributes of the GemFire region. This can be useful for debugging your region configuration.

Several of these values are described in the [GemFire documentation for region attributes](http://gemfire-native.docs.pivotal.io/latest/geode/client-cache/region-attributes.html).

Example output of `region.attributes`:

```javascript
{
  cachingEnabled: true,
  clientNotificationEnabled: true,
  concurrencyChecksEnabled: true,
  concurrencyLevel: 16,
  diskPolicy: 'none',
  entryIdleTimeout: 0,
  entryTimeToLive: 0,
  initialCapacity: 10000,
  loadFactor: 0.75,
  lruEntriesLimit: 0,
  lruEvicationAction: 'LOCAL_DESTROY',
  poolName: 'default_gemfireClientPool',
  regionIdleTimeout: 0,
  regionTimeToLive: 0,
  scope: 'DISTRIBUTED_NO_ACK'
}
```

## region.clear([callback])

Removes all entries from the region. The callback will be called with an `error` argument. If the callback is not supplied, and an error occurs, the region will emit an `error` event.

Example:

```javascript
region.clear(function(error){
  if(error) { throw error; }
  // region is empty
});
```

## region.destroyRegion([callback])

Destroys the region, deleting all entries. The callback will be called with an `error` argument. If the callback is not supplied, and an error occurs, the region will emit an `error` event.

> **Warning:** Destroying a `PROXY` or `CACHING_PROXY` region via `destroyRegion` also destroys the corresponding region on the GemFire cluster. If you don't want this behavior, call `region.localDestroyRegion()` instead.

Example:

```javascript
region.destroyRegion(function(error){
  if(error) { throw error; }
  // region is destroyed
  region.put("foo", "bar", callbackFn); // throws apache::geode::client::RegionDestroyedException
});
```

See also `region.localDestroyRegion`.

## region.executeFunction(functionName, options)

Executes a Java function on any servers in the cluster containing the region. `functionName` is the full Java class name of the function that will be called. Options may be either an array of arguments, or an options object.

 * `options.arguments`: the arguments to be passed to the Java function
 * `options.filter`: an array of keys to be sent to the Java function as the filter

region.executeFunction returns an EventEmitter which emits the following events:

 * `data`: Emitted once for each result sent by the Java function.
 * `error`: Emitted if the function throws or returns an Exception.
 * `end`: Called after the Java function has finally returned.

Example:

```javascript
region.executeFunction("com.example.FunctionName",
    { arguments: [1, 2, 3], filters: ["key1", "key2"] }
  )
  .on("error", function(error) { throw error; })
  .on("data", function(result) {
    // ...
  })
  .on("end", function() {
    // ...
  });
```

For more information, please see the [GemFire documentation for Function Execution](http://gemfire-native.docs.pivotal.io/latest/geode/function-execution/function-execution.html).

## region.executeFunction(functionName, arguments)

Shorthand for `executeFunction` with an array of arguments. Equivalent to:

```javascript
region.executeFunction(functionName, { arguments: arguments })
```

## region.existsValue(predicate, callback)

Indicates whether or not a value matching the OQL predicate `predicate` is present in the region. The callback will be called with an `error` and the boolean `response`.

In the predicate, you can use `this` to refer to the entire value. If you use any other expression, it will be treated as a field name on object values.

Example:

```javascript
region.existsValue("this = 'value1'", function(error, response) {
  if(error) { throw error; }
  // response will be set to true if any value is the string 'value1'
});

region.existsValue("foo > 2", function(error, response) {
  if(error) { throw error; }
  // response will be set to true if any value is an object such
  // as { foo: 3 } where the value of foo is greater than 2.
});
```

See also `region.query` and `region.selectValue`.

## region.get(key, callback)

Retrieves the value of an entry in the Region. The callback will be called with an `error` and the `value`. If the key is not present in the Region, an error will be passed to the callback.

Example:

```javascript
region.get("key", function(error, value){
  if(error) { throw error; }
  // an entry was found and its value is now accessible
});
```

## region.getSync(key)

Retrieves the value of an entry in the Region synchronously.

Example:

```javascript
  var value = region.getSync("key");
});
```

## region.getAll(keys, callback)

Retrieves the values of multiple keys in the Region. The keys should be passed in as an `Array`. The callback will be called with an `error` and a `values` object. If one or more keys are not present in the region, their values will be returned as null.

Example:

```javascript
region.getAll(["key1", "key2", "unknownKey"], function(error, values){
  if(error) { throw error; }
  // if key1 and key2 are present in the region, but unknownKey is not,
  // then values may look like this:
  // { key1: 'value1', key2: { foo: 'bar' }, unknownKey: null }
});
```

## region.keys(callback)

Retrieves all keys in the local cache of the Region. The callback will be called with an `error` argument, and an Array of keys.

Example:

```javascript
region.keys(function(error, keys) {
  if(error) { throw error; }
  // keys is now an array of all keys in the region, for example:
  //   [ 'key1', 'key2', 'key3' ]
});
```

## region.keys(callback)

Retrieves all keys on the Gemfire server for the Region. The callback will be called with an `error` argument, and an Array of keys.

Example:

```javascript
region.serverKeys(function(error, keys) {
  if(error) { throw error; }
  // keys is now an array of all keys in the region, for example:
  //   [ 'key1', 'key2', 'key3' ]
});
```

## values(callback)

Retrieves all values on the local cache of the Region. The callback will be called with an `error` argument, and an Array of values.

Example:

```javascript
region.values(function(error, keys) {
  if(error) { throw error; }
  // values is now an array of all values in the region, for example:
  //   [ 'value1', 'value2', 'value3' ]
});
```

## entries(callback)

Retrieves all key-value pairs on the local cache of the Region. The callback will be called with an `error` argument, and an Array of values.

Example:

```javascript
region.entries(function(error, keys) {
  if(error) { throw error; }
  // values is now an array of all values in the region, for example:
  //   [ { 'key': 'key1', 'value' : 'value1', { 'key' : 'key2', 'value' : 'value2' } ]
});
```

## region.localDestroyRegion([callback])

Destroys the local region, deleting all entries. The callback will be called with an `error` argument. If the callback is not supplied, and an error occurs, the region will emit an `error` event.

> **Note:** Destroying a `PROXY` or `CACHING_PROXY` region via `localDestoryRegion` does not destroy the corresponding region on the GemFire cluster. If you want this behavior, call `region.destroyRegion()` instead.

Example:

```javascript
region.localDestroyRegion(function(error){
  if(error) { throw error; }
  // local region is destroyed
  region.put("foo", "bar", callbackFn); // throws apache::geode::client::RegionDestroyedException
});
```

See also `region.destroyRegion`.

## region.name

Returns the name of the region.

## region.put(key, value, callback)

Stores an entry in the region. The callback will be called with an `error` argument.

GemFire supports most JavaScript types for the value. Some types, such as `Function` and `null` cannot be stored.

GemFire supports several JavaScript types for the key, but the safest choice is to always use a `String`.

Example:

```javascript
region.put('key', { foo: 'bar' }, function(error) {
  if(error) { throw error; }
  // the entry at key "key" now has value { foo: 'bar' }
});
```

## region.putSync(key, value)

Stores an entry in the region. Works the same way as `put` but does not take a callback or emit events.

Example:

```javascript
region.putSync('key', { foo: 'bar' });
// the entry at key "key" now has value { foo: 'bar' }
});
```

## region.putAll(entries, [callback])

Stores multiple entries in the region. The callback will be called with an `error` argument. If the callback is not supplied, and an error occurs, the Region will emit an `error` event.

**NOTE**: Keys on a JavaScript object are always strings. Thus, all entries will have string keys.

Example:

```javascript
region.putAll(
  {
    key1: 'value1',
    key2: { foo: 'bar' }
    3: "three"
  },
  function(error) {
    if(error) { throw error; }
    // the entry at key "key1" now has value "value1"
    // the entry at key "key2" now has value { foo: 'bar' }
    // the entry at key 3 (Number) is unaffected
    // the entry at key "3" (String) now has value "three"
  }
);
```

## region.putAllSync(entries)

Stores multiple entries in the region. Executes synchronously.

Example:

```javascript
region.putAllSync(
  {
    key1: 'value1',
    key2: { foo: 'bar' }
    3: "three"
  }
);
```

## region.query(predicate, callback)

Retrieves all values from the Region matching the OQL `predicate`. The callback will be called with an `error` argument, and a `response` object. For more information on `response` objects, please see `cache.executeQuery`.

Example:

```javascript
region.query("this like '% Smith'", function(error, response) {
  if(error) { throw error; }

  var results = response.toArray();
  // results will now be an array of all values in the region ending in " Smith"

  response.each(function(result) {
    // this callback will be passed each value in the region ending in " Smith", one at a time
  });
});
```

See also `region.selectValue` and `region.existsValue`.

## region.registerAllKeys()

Tells the GemFire server to trigger events for entry operations that were triggered by other clients in the system. By default, region entry operations (`region.put`, `region.remove`, etc.) that happen within a single Node process trigger events *only* within that same process. After calling `region.registerAllKeys`, all entry operations on the region will trigger events. In other words, the GemFire server will push notifications back to the Node process.

Example:

```javascript
region.on("create", function(event) {
  // handle event
});

// another client creates an entry in the region, and the callback is not triggered

region.registerAllKeys();

// another client creates an entry in the region, and the callback is triggered
```

See also Events and `region.unregisterAllKeys`.

## region.remove(key, [callback])

Removes the entry specified by the indicated key from the Region, or, if no such entry is present, passes an `error` to the callback. If the argument is not supplied, and an error occurs, the Region will emit an `error` event.

Example:

```javascript
region.remove('key1', function(error) {
  if(error) { throw error; }
  // the entry with key 'key1' has been removed from the region
});
```

## region.selectValue(predicate, callback)

Retrieves exactly one entry from the Region matching the OQL `predicate`. The callback will be called with an `error` argument, and a `result`.

If more than one result matches the predicate, an error will be passed to the callback. If you want to select multiple results for a predicate, see `region.query`.

Example:

```javascript
region.selectValue("this = 'value1'", function(error, result) {
  if(error) { throw error; }
  // if there is exactly one entry with value 'value1' in the region,
  // result will now be set to 'value1'
});
```

See also `region.query` and `region.existsValue`.

## region.unregisterAllKeys()

Tells the GemFire server *not* to trigger events for entry operations that were triggered by other clients in the system.

Example:

```javascript
region.registerAllKeys();

region.on("create", function(event) {
  // handle event
}

// another client creates an entry in the region, and the callback is triggered

region.unregisterAllKeys();

// another client creates an entry in the region, and the callback is not triggered
```

See also Events and `region.registerAllKeys`.

### Event: 'error'

* error: `Error` object.

Emitted when an error occurs and no callback was passed to the method that caused the error.

Example:

```javascript
region.on("error", function(error) {
  // handle errors
});

// emits an error because null is not a supported value for put()
region.put("foo", null);

// does not emit an error, because a callback was passed
region.put("foo", null, function(error) {});
```

## Event: 'create'

* event: GemFire event payload object.
  * event.key: The key that was inserted.
  * event.oldValue: Always `null` because there is no old value.
  * event.newValue: The value that was inserted.

Emitted when an entry is added to the region. Not emitted when an existing entry's value is updated.

Example:

```javascript
region.on("create", function(event) {
  // process event
});

// emits an event because "foo" is a new entry in the region
region.put("foo", "bar");

// does not emit an event because "foo" is already an entry in the region
region.put("foo", "baz");
```

See also `region.registerAllKeys`.

## Event: 'destroy'

* event: GemFire event payload object.
  * event.key: The key that was destroyed.
  * event.oldValue: The previous value before the destruction.
  * event.newValue: Always `null` because there is no new value.

Emitted when an existing entry is destroyed.

Example:

```javascript
region.on("destroy", function(event) {
  // process event
});

region.remove("foo");
```

See also `region.registerAllKeys`.

## Event: 'update'

* event: GemFire event payload object.
  * event.key: The key that was updated.
  * event.oldValue: The previous value before the update.
  * event.newValue: The new value after the update.

Emitted when an existing entry's value is updated. Not emitted when an entry is added to the region.

Example:

```javascript
region.on("update", function(event) {
  // process event
});

// does not emit an event because "foo" is a new entry in the region
region.put("foo", "bar");

// emits an event because "foo" is already an entry in the region
region.put("foo", "baz");
```

See also `region.registerAllKeys`.
