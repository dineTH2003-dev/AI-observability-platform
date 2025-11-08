#!/usr/bin/env python
import sys, json, time
input_data = {}
if len(sys.argv) > 1:
    input_data['args'] = sys.argv[1:]
time.sleep(1)
print(json.dumps({"ok": True, "result": {"echo": input_data}}))
