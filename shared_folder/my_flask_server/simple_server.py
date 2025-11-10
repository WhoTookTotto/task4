from flask import Flask, jsonify
import time

app = Flask(__name__)
last_ping_time = time.time()

@app.route('/', methods=['GET'])
def ping():
    global last_ping_time
    current_time = time.time()
    elapsed = current_time - last_ping_time
    last_ping_time = current_time
    return jsonify({
        "imageUrl": "https://picsum.photos/200",
        "message": f"time since api was called: {elapsed:.2f} seconds"
    })

app.run(debug=True, port=8080)
