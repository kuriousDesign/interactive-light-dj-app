import asyncio
import socketio
import random

# Function to generate random fixture data (simulating the server's fixture data)
def generate_fixture_data():
    fixture_count = 11
    fixtures = []
    for _ in range(fixture_count):
        fixtures.append({
            'r': random.randint(0, 255),
            'g': random.randint(0, 255),
            'b': random.randint(0, 255),
            'w': random.randint(0, 255),
        })
    return fixtures

# Send data every 150ms
async def send_data():
    while True:
        fixture_data = generate_fixture_data()
        sio.emit('newData', {'message':fixture_data})  # Send data to the server
        print("Sent new data:", str(fixture_data))
        await asyncio.sleep(0.500)



sio = socketio.AsyncClient()


@sio.event
async def connect():
    print('connected to server')


@sio.event
async def disconnect(reason):
    print('disconnected from server, reason:', reason)


@sio.event
def hello(a, b, c):
    print(a, b, c)


async def start_server():
    connected = False
    while not connected:
        try:
            await sio.connect('http://localhost:5000', retry=False)
            connected = True
            sio.emit('newData', 'hello') 
        except socketio.exceptions.ConnectionError as e:
            print("Connection failed, retrying in 1 second...")
            await asyncio.sleep(1)
    #await sio.connect('http://localhost:5000', retry=True)
    await send_data()
    await sio.wait()


if __name__ == '__main__':
    asyncio.run(start_server())