import paho.mqtt.client as mqtt
import time

def message_received(client, userdata, message):
  print("message received " ,str(message.payload.decode("utf-8")))
  print("message topic=",message.topic)
  print("message qos=",message.qos)
  print("message retain flag=",message.retain)

client = mqtt.Client("c1")
client.connect("127.0.0.1")
client.subscribe('#')
client.on_message=message_received
client.loop_forever()
