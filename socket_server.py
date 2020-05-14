from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
num_entries_path = "./num_entries.json"

@socketio.on("new_entry")
def handle_new_entry():
    print("new entry just found!")
    with open(num_entries_path, "r") as f:
        number_entries = json.load(f)
    with open(num_entries_path, "w+") as g:
        number_entries.update({
            "num": number_entries["num"] + 1
        })
        json.dump(number_entries, g, indent=4)
    socketio.emit('increased_entry', number_entries)
if __name__ == '__main__':
    socketio.run(app)