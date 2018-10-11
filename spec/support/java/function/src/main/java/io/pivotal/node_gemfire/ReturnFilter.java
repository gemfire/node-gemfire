package io.pivotal.node_gemfire;

import org.apache.geode.cache.execute.FunctionAdapter;
import org.apache.geode.cache.execute.FunctionContext;
import org.apache.geode.cache.execute.RegionFunctionContext;

import java.util.Iterator;
import java.util.Set;

public class ReturnFilter extends FunctionAdapter {

    public void execute(FunctionContext fc) {
        RegionFunctionContext context = (RegionFunctionContext) fc;
        Set filter = context.getFilter();

        if(filter.isEmpty()) {
            fc.getResultSender().sendException(new Exception("Expected filter; no filter received"));
            return;
        }

        Iterator iterator = filter.iterator();
        while(iterator.hasNext()){
            Object key = iterator.next();
            if(iterator.hasNext()) {
                fc.getResultSender().sendResult(key);
            } else {
                fc.getResultSender().lastResult(key);
                return;
            }
        }
    }

    public String getId() {
        return getClass().getName();
    }
}
