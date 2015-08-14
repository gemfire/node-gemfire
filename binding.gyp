# vim: set ft=javascript
{
  "target_defaults": {
    "include_dirs" : [
      "$(GFCPP)/include",
      "<!(node -e \"require('nan')\")"
    ],
    'cflags_cc!': [
      '-fno-rtti', 
      '-fno-exceptions'
    ],
    "defines": [
      "_REENTRANT"
    ],
    "conditions": [
     ["OS=='win'", {
       "libraries": [ 
       "-l$(GFCPP)/lib/gfcppcache"
       ],
      },
     ],
     ["OS!='win'", {
       "libraries": [ 
       "-lgfcppcache", 
       "-L$(GFCPP)/lib/"
      ],
     },
    ],
    ["configuration=='Debug'", {
      "targets": [
        {
          "target_name": "test",
          "libraries": [
            "-lgtest"
          ],
          "sources": [
            "spec/cpp/test.cpp",
          ]
        }
      ]
    }],
   ],
    "sources": [
      "src/dependencies.cpp",
      "src/exceptions.cpp",
      "src/conversions.cpp",
      "src/cache.cpp",
      "src/region.cpp",
      "src/select_results.cpp",
      "src/gemfire_worker.cpp",
      "src/streaming_result_collector.cpp",
      "src/result_stream.cpp",
      "src/events.cpp",
      "src/functions.cpp",
      "src/region_event_listener.cpp",
      "src/region_event_registry.cpp",
      "src/event_stream.cpp",
      "src/region_shortcuts.cpp",
    ]
  },
  "targets": [
    {
      "target_name": "<(module_name)",
      "sources": [
        "src/binding.cpp"
      ]
    },
    {
      "target_name": "action_after_build",
      "type": "none",
      "dependencies": [ "<(module_name)" ],
      "copies": [
        {
          "files": [ "<(PRODUCT_DIR)/<(module_name).node" ],
          "destination": "<(module_path)"
        }
      ]
    },
  ]
}
