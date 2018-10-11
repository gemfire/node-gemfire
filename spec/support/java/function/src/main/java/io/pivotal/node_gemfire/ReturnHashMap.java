package io.pivotal.node_gemfire;

import org.apache.geode.cache.execute.FunctionAdapter;
import org.apache.geode.cache.execute.FunctionContext;

import java.util.HashMap;
import java.util.HashSet;

public class ReturnHashMap extends FunctionAdapter {

    public void execute(FunctionContext fc) {
        HashMap<String, String> hashMap = new HashMap<String, String>();
        hashMap.put("foo", "bar");
        fc.getResultSender().lastResult(hashMap);
    }

    public String getId() {
        return getClass().getName();
    }
}
