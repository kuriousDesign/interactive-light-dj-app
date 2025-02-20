import socketio
import json
import time
import threading

# Create a new Socket.IO server instance
sio = socketio.Server(cors_allowed_origins=["http://localhost:3000"])

# Store connected clients in a set (to avoid duplicates)
connected_clients = set()

# Fixture data (you can customize this as needed)
fixture_data = [
    {"label": "G1-LT", "position": {"x": 200, "y": 50}},
    {"label": "G1-LB", "position": {"x": 200, "y": 150}},
    {"label": "G1-RT", "position": {"x": 500, "y": 50}},
    {"label": "G1-RB", "position": {"x": 500, "y": 150}},
    {"label": "G2-L", "position": {"x": 100, "y": 0}},
    {"label": "G2-R", "position": {"x": 600, "y": 0}},
    {"label": "G3-1", "position": {"x": 50, "y": 500}},
    {"label": "G3-3", "position": {"x": 350, "y": 500}},
    {"label": "G3-5", "position": {"x": 650, "y": 500}},
    {"label": "G4-2", "position": {"x": 200, "y": 500}},
    {"label": "G4-4", "position": {"x": 500, "y": 500}},
]

# Create a basic Flask app to serve the Socket.IO server
from flask import Flask
app = Flask(__name__)

# Attach the Socket.IO server to the Flask app
sio_app = socketio.WSGIApp(sio, app)

# Handle new connection from the client
@sio.event
def connect(sid, environ):
    print(f"Client {sid} connected")
    connected_clients.add(sid)  # Add the client SID to the set of connected clients
    # Send some initial data to the client upon connection
    sio.emit("hello", {"message": "Welcome!"}, room=sid)

# Handle disconnection
@sio.event
def disconnect(sid):
    print(f"Client {sid} disconnected")
    connected_clients.remove(sid)  # Remove the client SID from the set of connected clients

# Function to emit fixture data every 150ms to all connected clients
def emit_fixture_data():
    while True:
        # Emit the fixture data to all connected clients
        if connected_clients:
            for sid in connected_clients:
                sio.emit("data", {"message": "hello"}, to=sid)  # Emit to each client
                #print(sid)
            #print(f"Emitted data to {len(connected_clients)} clients")
        time.sleep(0.150)  # Emit every 150ms

# Start a background thread to emit data
def start_emission_thread():
    thread = threading.Thread(target=emit_fixture_data)
    thread.daemon = True  # Allows the thread to exit when the main program exits
    thread.start()

# Start the data emission thread
start_emission_thread()

# Use eventlet to run the server
import eventlet
eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), sio_app)
