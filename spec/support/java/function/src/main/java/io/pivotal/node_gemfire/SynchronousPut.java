package io.pivotal.node_gemfire;

import org.apache.geode.cache.Region;
import org.apache.geode.cache.execute.FunctionAdapter;
import org.apache.geode.cache.execute.FunctionContext;
import org.apache.geode.cache.execute.RegionFunctionContext;
import org.apache.geode.cache.execute.FunctionException;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class SynchronousPut extends FunctionAdapter {

    public void execute(FunctionContext fc) {
          RegionFunctionContext regionFunctionContext = (RegionFunctionContext) fc;
          Region<Object, Object> region = regionFunctionContext.getDataSet();

          List arguments = (List) regionFunctionContext.getArguments();
          region.getCache().getLogger().fine("Jasmine : SynchronousPut( " + arguments.toString());
          if (arguments.size() != 4) {
            throw new IllegalArgumentException("Jasmine : SynchronousPut(" + arguments.toString() + ") is not enough. (k, v, r1, r2)");
          }
          try {
            Thread.sleep(2000);
          } catch (InterruptedException e) {
          }
          region.put(arguments.get(0), arguments.get(1));

          Object[] result = new Object[2];
          result[0] = arguments.get(2);
          result[1] = arguments.get(3);
        try {
          fc.getResultSender().lastResult(result);
        } catch(org.apache.geode.cache.execute.FunctionException e) {
        }
    }

    public String getId() {
        return getClass().getName();
    }
}

