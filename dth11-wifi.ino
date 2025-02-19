#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHTesp.h"
// Update these with values suitable for your network.
const char* ssid = "iptime2G(느림)";
const char* password = "000011110000";
const char* mqtt_server = "test.mosquitto.org";
const char* clientName="940424-client";

DHTesp dht;
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("*");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  dht.setup(D4, DHTesp::DHT11);
}

void callback(char* topic, byte* payload, unsigned int uLen) {
  char pBuffer[uLen+1];
  int i;
  for(i=0;i<uLen;i++){
    pBuffer[i]=payload[i];
  }
  pBuffer[i]='\0';
  Serial.println(pBuffer); // 1, 2
  if(pBuffer[0]=='1'){
    digitalWrite(14, HIGH);
  }else if(pBuffer[0]=='2'){
    digitalWrite(14, LOW);
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(clientName)) {
      Serial.println("connected");
      // ... and resubscribe
      client.subscribe("led");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  // pinMode(14, OUTPUT); // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  float hum = dht.getHumidity();
  float tmp = dht.getTemperature();
  char message[64]="", pTmpBuf[50], pHumBuf[50];
  dtostrf(tmp, 5,2, pTmpBuf);
  dtostrf(hum, 5,2, pHumBuf);
  sprintf(message, "{\"tmp\":%s,\"hum\":%s}", pTmpBuf, pHumBuf);
  Serial.print("Publish message: ");
  Serial.println(message);
  client.publish("TemperatureHumidity", message);

  delay(3000); // 3초
}