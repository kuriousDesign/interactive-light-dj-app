import socket
import time
import random

# UDP Settings
UDP_IP = "127.0.0.1"  # Change to match your Node.js server
UDP_PORT = 9999        # Must match the UDP listener port in Node.js

# Create a UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Function to generate 44 bytes of random fixture data
def generate_fixture_data():
    return bytes([random.randint(0, 255) for _ in range(44)])

current_fixture = 0
color_phase = 0

def generate_cycling_fixture_data():
    global current_fixture, color_phase
    NUM_FIXTURES = 11  # 44 bytes = 11 fixtures * 4 channels
    #current_fixture = int(time.time() * 2) % NUM_FIXTURES  # Changes fixture every 0.5 seconds
    #color_phase = int(time.time() / 2) % 4  # Changes color every 2 seconds
    
    data = []
    for fixture in range(NUM_FIXTURES):
        if fixture == current_fixture:
            if color_phase == 0:    # Red
                data.extend([255, 0, 0, 255])
            elif color_phase == 1:  # Green
                data.extend([0, 255, 0, 255])
            elif color_phase == 2:  # Blue
                data.extend([0, 0, 255, 255])
            else:                   # White
                data.extend([255, 255, 255, 255])
        else:
            data.extend([0, 0, 0, 255])  # Black
    color_phase += 1
    if color_phase > 3:
        color_phase = 0
        current_fixture += 1
    if current_fixture >= NUM_FIXTURES:
        current_fixture = 0

    return bytes(data)

    # Replace the generate_fixture_data function
    generate_fixture_data = generate_cycling_fixture_data

print(f"Sending UDP fixture data to {UDP_IP}:{UDP_PORT} every 150ms...")

# Send fixture data in a loop
try:
    while True:
        fixture_data = generate_cycling_fixture_data()
        sock.sendto(fixture_data, (UDP_IP, UDP_PORT))
        #print(f"Sent: {fixture_data}")
        time.sleep(.150)  # 150ms delay
except KeyboardInterrupt:
    print("\nUDP sender stopped.")
    sock.close()
