package io.pivotal.node_gemfire;

import org.apache.geode.cache.execute.FunctionAdapter;
import org.apache.geode.cache.execute.FunctionContext;

public class ReturnObjectArray extends FunctionAdapter {

    public void execute(FunctionContext fc) {
        Object[] objectArray = new Object[] { "foo", "bar", 1, 2.2d, new Object[] { 3, 4.4d } };
        fc.getResultSender().lastResult(objectArray);
    }

    public String getId() {
        return getClass().getName();
    }
}
