import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

import * as fs from "fs"; // Allows developers to read and write files on the Fitbit device
import { me as appbit } from "appbit"; // Check if we have permissions
import { HeartRateSensor } from "heart-rate"; // Heart rate
import {today as todayStats } from "user-activity"; // Steps
import { battery } from "power";// Battery

import { Accelerometer } from "accelerometer";
import { display } from "display";


// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const hourLabel = document.getElementById("hourLabel");
const minuteLabel = document.getElementById("minuteLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const stepsLabel = document.getElementById("stepsLabel");
const ampmLabel = document.getElementById("ampmLabel");
const dayLabel = document.getElementById("dayLabel");
const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");
const batteryLabel = document.getElementById("batteryLabel");
const accelLabel = document.getElementById("accelLabel");
const accelData = document.getElementById("accelData");
const countLabel = document.getElementById("countLabel");

let count = 0;
countLabel.text = "0";

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  showDate(evt);
  if (preferences.clockDisplay === "12h") {
    // 12h format
    if (hours/12 > 0) {
      ampmLabel.text = "PM";
    } else {
      ampmLabel.text = "AM";
    }
    hours = hours % 12 || 12;
  } else {
    // 24h format
    ampmLabel.text = ""; // make sure AM/PM is not displayed if 24 hour format
    hours = util.zeroPad(hours);
  }
  let hours = hours;
  let mins = util.zeroPad(today.getMinutes());
  
  hourLabel.text = `${hours}`;
  minuteLabel.text = `${mins}`;
  
  function showDate(evt){
    let today = evt.date;
    let monthnum = today.getMonth();
    let day = today.getDate();
    let year = today.getYear();
    year += 1900; // For some reason the year after 200 is displayed as 100. EX: 2011=111
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    let monthname = month[monthnum];
    monthLabel.text = `${monthname}`;
    dayLabel.text = `${day}`;
    yearLabel.text = `${year}`;
  }
  
  batteryLabel.text = Math.floor(battery.chargeLevel) + "%"; // Show the battery level as a number
  
  if (HeartRateSensor) { // Heart rate sensor get live readings with each tick
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    console.log(`Current heart rate: ${hrm.heartRate}`);
    heartRateLabel.text = `${hrm.heartRate}`; // This is the actual heart rate number
    if (`${hrm.heartRate}` > 100) {
      count = count + 1;
      countLabel.text = count.toFixed(1);
    }
  });
  hrm.start();
  }
  
  if (appbit.permissions.granted("access_activity")) { // if the user gave permission to see today's activities
    stepsLabel.text = `${todayStats.adjusted.steps}`; // retrieve the steps and make it the text for stepsLabel from the today variable
  }
  
}


const sensors = [];

if (Accelerometer) {
  const accel = new Accelerometer({ frequency: 1 });
  accel.addEventListener("reading", () => {
    accelData.text = JSON.stringify({
      x: accel.x ? accel.x.toFixed(1) : 0,
      y: accel.y ? accel.y.toFixed(1) : 0,
      z: accel.z ? accel.z.toFixed(1) : 0
    });
    if ( accel.x > 2 & accel.y > 2) {
      count = count + 1;
      countLabel.text = count.toFixed(1);
    }
  });
  sensors.push(accel);
  accel.start();
} else {
  accelLabel.style.display = "none";
  accelData.style.display = "none";
}

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});

