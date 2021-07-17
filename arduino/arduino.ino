#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

#define BYTES_LENGTH 60

StaticJsonDocument<BYTES_LENGTH> doc;
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  Serial.begin(9600);

  // initial status
  lcd.print("Status: OK");
  Serial.println("ready");
}

void loop() {
  if (Serial.available() > 0) {
    lcd.clear();
    delay(100);

    char bytes[BYTES_LENGTH + 1];
    int i = 0;

    while (Serial.available() > 0) {
      if (i < BYTES_LENGTH) {
        bytes[i++] = Serial.read();
        bytes[i] = '\0';
      }
    }

    deserializeJson(doc, bytes);

    String username = doc["username"];
    lcd.setCursor(0, 0);
    lcd.print(username);

    String message = doc["message"];
    lcd.setCursor(0, 1);
    lcd.print(message);
  }
}
