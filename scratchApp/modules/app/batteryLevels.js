import { charger, battery } from "power";

export default class batteryLevels { 
  get() {
    console.log('app - batteryLevels - get()')
    let percent = Math.floor(battery.chargeLevel)
    let level = .3 * percent;
    let color = '#50BA7B'; // This is the color that Roo chose. Thanks Roo!
    if(percent <= 30 && percent >= 15) {
      color = 'orange';
    } else if( percent <= 15) {
      color = 'red';
    }
    return {
      percent: percent,
      level: level,
      color: color,
    }
  }
};