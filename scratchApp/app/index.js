/*
The purpose of this code is for the UCI wearable sensing project - BrilliAnt
*/

// ---------- Import the necessary packages ----------
import document from "document";
import { inbox } from "file-transfer";
import fs from "fs"; 
import { vibration } from "haptics"; // done
import DateTime from "../modules/app/dateTime.js"; // done
import BatteryLevels from "../modules/app/batteryLevels.js"; // done
import { display } from "display";
// Sensor packages
import { Accelerometer } from "accelerometer";
import { BodyPresenceSensor } from "body-presence";
import { HeartRateSensor } from "heart-rate";
import { OrientationSensor } from "orientation";

// ---------- Create variables ----------
// Sensors
const sensors = [];
// Accelerometer
const accelLabel = document.getElementById("accel-label");
const accelData = document.getElementById("accel-data");
// Body presense sensor
const bpsLabel = document.getElementById("bps-label");
const bpsData = document.getElementById("bps-data");
// Heart rate sensor
const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
// Orientation sensor
const orientationLabel = document.getElementById("orientation-label");
const orientationData = document.getElementById("orientation-data");
// Datetime
const dateTime = new DateTime();
// Battery
const batteryLevels = new BatteryLevels();

// Automatically stop all sensors when the screen is off to conserve battery
display.addEventListener("change", () => {
    display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});

// Accelerometer
if (Accelerometer) {
    const accel = new Accelerometer({ frequency: 1 });
    accel.addEventListener("reading", () => {
      accelData.text = JSON.stringify({
        x: accel.x ? accel.x.toFixed(1) : 0,
        y: accel.y ? accel.y.toFixed(1) : 0,
        z: accel.z ? accel.z.toFixed(1) : 0
      });
    });
    sensors.push(accel);
    accel.start();
} else {
    accelLabel.style.display = "none";
    accelData.style.display = "none";
}

// Body Presense
if (BodyPresenceSensor) {
    const bps = new BodyPresenceSensor();
    bps.addEventListener("reading", () => {
      bpsData.text = JSON.stringify({
        presence: bps.present
      })
    });
    sensors.push(bps);
    bps.start();
} else {
    bpsLabel.style.display = "none";
    bpsData.style.display = "none";
}

// Heart Rate
if (HeartRateSensor) {
    const hrm = new HeartRateSensor({ frequency: 1 });
    hrm.addEventListener("reading", () => {
      hrmData.text = JSON.stringify({
        heartRate: hrm.heartRate ? hrm.heartRate : 0
      });
    });
    sensors.push(hrm);
    hrm.start();
} else {
    hrmLabel.style.display = "none";
    hrmData.style.display = "none";
}

// Orientation
if (OrientationSensor) {
    const orientation = new OrientationSensor({ frequency: 60 });
    orientation.addEventListener("reading", () => {
      orientationData.text = JSON.stringify({
        quaternion: orientation.quaternion ? orientation.quaternion.map(n => n.toFixed(1)) : null
      });
    });
    sensors.push(orientation);
    orientation.start();
} else {
    orientationLabel.style.display = "none";
    orientationData.style.display = "none";
}