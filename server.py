###########################
# 1944494
# scp ./server.py athena.dialup.mit.edu:/MIT/MIT_SUMMER_2020/crazy_typing/
############################
import os
import json

####
import sys

sys.path.append('__HOME__/crazy_typing')
num_entries_path = "__HOME__/crazy_typing/num_entries.json"
#####
# entries_db = "__HOME__/crazy_typing/entries.db"
def request_handler(request):
    if request['method'] == 'GET': #returns the number of entries so far
        with open(num_entries_path, "r") as f:
            number_entries = json.load(f)
        return number_entries["num"]
    elif request['method'] == 'POST': #updates the num of entries by 1
        with open(num_entries_path, "r") as f:
            number_entries = json.load(f)
        with open(num_entries_path, "w+") as g:
            number_entries.update({
                "num": number_entries["num"] + 1
            })
            json.dump(number_entries, g, indent=4)
        return number_entries["num"]
    else:
        return "wrong method bruh"