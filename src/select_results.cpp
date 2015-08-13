#include <gfcpp/SelectResultsIterator.hpp>
#include <sstream>
#include "conversions.hpp"
#include "select_results.hpp"

using namespace v8;
using namespace gemfire;

namespace node_gemfire {

Persistent<Function> SelectResults::constructor;

void SelectResults::Init(Local<Object> exports) {
  NanScope();

  Local<FunctionTemplate> constructorTemplate(NanNew<FunctionTemplate>());

  constructorTemplate->SetClassName(NanNew("SelectResults"));
  constructorTemplate->InstanceTemplate()->SetInternalFieldCount(1);

  NanSetPrototypeTemplate(constructorTemplate, "toArray",
      NanNew<FunctionTemplate>(SelectResults::ToArray)->GetFunction());
  NanSetPrototypeTemplate(constructorTemplate, "each",
      NanNew<FunctionTemplate>(SelectResults::Each)->GetFunction());
  NanSetPrototypeTemplate(constructorTemplate, "inspect",
      NanNew<FunctionTemplate>(SelectResults::Inspect)->GetFunction());

  NanAssignPersistent(SelectResults::constructor, constructorTemplate->GetFunction());
}

Local<Object> SelectResults::NewInstance(const SelectResultsPtr & selectResultsPtr) {
  NanEscapableScope();

  const unsigned int argc = 0;
  Local<Value>* argv = new Local<Value>[argc];
  Local<Object> v8Object(NanNew(SelectResults::constructor)->NewInstance(argc, argv));

  SelectResults * selectResults = new SelectResults(selectResultsPtr);
  selectResults->Wrap(v8Object);

  return NanEscapeScope(v8Object);
}

NAN_METHOD(SelectResults::ToArray) {
  NanScope();

  SelectResults * selectResults = ObjectWrap::Unwrap<SelectResults>(args.This());
  SelectResultsPtr selectResultsPtr(selectResults->selectResultsPtr);

  unsigned int length = selectResultsPtr->size();

  Local<Array> array(NanNew<Array>(length));
  for (unsigned int i = 0; i < length; i++) {
    array->Set(i, v8Value((*selectResultsPtr)[i]));
  }

  NanReturnValue(array);
}

NAN_METHOD(SelectResults::Each) {
  NanScope();

  if (args.Length() == 0 || !args[0]->IsFunction()) {
    NanThrowError("You must pass a callback to each()");
    NanReturnUndefined();
  }

  SelectResults * selectResults = ObjectWrap::Unwrap<SelectResults>(args.This());
  SelectResultsPtr selectResultsPtr(selectResults->selectResultsPtr);

  SelectResultsIterator iterator(selectResultsPtr->getIterator());
  Local<Function> callback(Local<Function>::Cast(args[0]));

  while (iterator.hasNext()) {
    const unsigned int argc = 1;
    Local<Value> argv[argc] = { v8Value(iterator.next()) };
    Local<Value> regionHandle(NanMakeCallback(args.This(), callback, argc, argv));
  }

  NanReturnValue(args.This());
}

NAN_METHOD(SelectResults::Inspect) {
  NanScope();

  SelectResults * selectResults = ObjectWrap::Unwrap<SelectResults>(args.This());
  SelectResultsPtr selectResultsPtr(selectResults->selectResultsPtr);

  std::stringstream inspectStream;
  inspectStream << "[SelectResults size=" << selectResultsPtr->size() << "]";

  NanReturnValue(NanNew(inspectStream.str().c_str()));
}

}  // namespace node_gemfire
