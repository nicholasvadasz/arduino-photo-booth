import serial
import requests

# Serial port configuration
serial_port = "/dev/cu.usbmodem101"  # Adjust the port based on your system
baud_rate = 9600

# Server configuration
constserver = "192.168.4.1"
port = 80
url = "/capture.jpg"

# Open serial port
ser = serial.Serial(serial_port, baud_rate)

def save_to_txt(data):
    with open("build/variables.txt", "w") as file:
        file.write(data + "\n")

def download_image():
    full_url = f"http://{constserver}:{port}{url}"
    response = requests.get(full_url)
    
    if response.status_code == 200:
        with open("build/image.jpg", "wb") as image_file:
            image_file.write(response.content)
        print("Image downloaded and saved.")
    else:
        print(f"Failed to download image. Status code: {response.status_code}")

try:
    while True:
        # Read serial data
        serial_data = ser.readline().decode("utf-8").strip()

        # Save serial data to txt file
        save_to_txt(serial_data)
        numbers = serial_data.split()

        # Download and save the image only when serial data is received
        if numbers[-2] == "1":
            download_image()
            ser.write(b"ack\n") 

        
except KeyboardInterrupt:
    # Close the serial port on keyboard interrupt
    ser.close()
    print("Serial port closed.")
