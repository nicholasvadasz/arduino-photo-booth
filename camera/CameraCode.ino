#include "WifiCam.hpp"
#include <WiFi.h>
#include <esp32cam.h>
#include <WebServer.h>

static const char* AP_SSID = "camera";
static const char* AP_PASS = "password";

WebServer server(80);

// sends the captured image to the client
void handleCapture() {
  auto img = esp32cam::capture();
  if (img == nullptr) {
    server.send(500, "", "");
    return;
  }
  server.setContentLength(img->size());
  server.send(200, "image/jpeg");
  WiFiClient client = server.client();
  img->writeTo(client);
}

void setup() {
  auto res = esp32cam::Resolution::find(1024, 768);
  esp32cam::Config cfg;
  cfg.setPins(esp32cam::pins::AiThinker);
  cfg.setResolution(res);
  cfg.setJpeg(80);
  esp32cam::Camera.begin(cfg);
  WiFi.softAP(AP_SSID, AP_PASS);
  server.on("/capture.jpg", handleCapture);
  server.begin();
}

void loop(){
  server.handleClient();
}
