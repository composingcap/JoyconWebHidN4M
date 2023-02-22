import {
  connectJoyCon,
  connectedJoyCons,
  JoyConLeft,
  JoyConRight,
  GeneralController,
} from './src/index.js';
import {io} from "./src/socket.io.esm.min.js";
const socket = io();
const connectButton = document.querySelector('#connect-joy-cons');
const connectButtonRingCon = document.querySelector('#connect-ring-con');
const debugLeft = document.querySelector('#debug-left');
const debugRight = document.querySelector('#debug-right');
const showDebug = document.querySelector('#show-debug');
const rootStyle = document.documentElement.style;

connectButton.addEventListener('click', connectJoyCon);

const visualize = (joyCon, packet) => {
  if (!packet || !packet.actualOrientation) {
    return;
  }
  const {
    actualAccelerometer: accelerometer,
    buttonStatus: buttons,
    actualGyroscope: gyroscope,
    actualOrientation: orientation,
    actualOrientationQuaternion: orientationQuaternion,
    ringCon: ringCon,
  } = packet;

  if (joyCon instanceof JoyConLeft) {
    rootStyle.setProperty('--left-alpha', `${orientation.alpha}deg`);
    rootStyle.setProperty('--left-beta', `${orientation.beta}deg`);
    rootStyle.setProperty('--left-gamma', `${orientation.gamma}deg`);
  } else if (joyCon instanceof JoyConRight) {
    rootStyle.setProperty('--right-alpha', `${orientation.alpha}deg`);
    rootStyle.setProperty('--right-beta', `${orientation.beta}deg`);
    rootStyle.setProperty('--right-gamma', `${orientation.gamma}deg`);
  }

  if (joyCon instanceof JoyConLeft || joyCon instanceof GeneralController) {
    const joystick = packet.analogStickLeft;
    const joystickMultiplier = 10;
    document.querySelector('#joystick-left').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier
    }px) translateY(${joystick.vertical * joystickMultiplier}px)`;
    

    document.querySelector('#up').classList.toggle('highlight', buttons.up);
    document.querySelector('#down').classList.toggle('highlight', buttons.down);
    document.querySelector('#left').classList.toggle('highlight', buttons.left);
    document
      .querySelector('#right')
      .classList.toggle('highlight', buttons.right);
    document
      .querySelector('#capture')
      .classList.toggle('highlight', buttons.capture);
    document
      .querySelector('#l')
      .classList.toggle('highlight', buttons.l || buttons.zl);
    document
      .querySelector('#l')
      .classList.toggle('highlight', buttons.l || buttons.zl);
    document
      .querySelector('#minus')
      .classList.toggle('highlight', buttons.minus);
    document
      .querySelector('#joystick-left')
      .classList.toggle('highlight', buttons.leftStick);

      let side = "left";
      socket.emit("ctl", [side, "joystick",parseFloat(joystick.horizontal), parseFloat(joystick.vertical), buttons.leftStick]);
      socket.emit("ctl", [side, "up",(buttons.up)]);
      socket.emit("ctl", [side, "down",(buttons.down)]);
      socket.emit("ctl", [side, "left",(buttons.left)]);
      socket.emit("ctl", [side, "right",(buttons.right)]);
      socket.emit("ctl", [side, "shoulder",(buttons.l)]);
      socket.emit("ctl", [side, "trigger",(buttons.zl)]);
      socket.emit("ctl", [side, "start",(buttons.minus)]);
      socket.emit("ctl", [side, "home",(buttons.capture)]);
      socket.emit("ctl", [side, "accel",parseFloat(accelerometer.x)*100,parseFloat(accelerometer.y)*100,parseFloat(accelerometer.z)*100]);
      socket.emit("ctl", [side, "gyro",parseFloat(gyroscope.rps.x)*100,parseFloat(gyroscope.rps.y)*100,parseFloat(gyroscope.rps.z)*100]);
      socket.emit("ctl", [side, "orientation",parseFloat(orientation.alpha),parseFloat(orientation.beta),parseFloat(orientation.gamma)]);

  }
  if (joyCon instanceof JoyConRight || joyCon instanceof GeneralController) {
    const joystick = packet.analogStickRight;
    const joystickMultiplier = 10;
    document.querySelector('#joystick-right').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier
    }px) translateY(${joystick.vertical * joystickMultiplier}px)`;


    document.querySelector('#a').classList.toggle('highlight', buttons.a);
    document.querySelector('#b').classList.toggle('highlight', buttons.b);
    document.querySelector('#x').classList.toggle('highlight', buttons.x);
    document.querySelector('#y').classList.toggle('highlight', buttons.y);
    document.querySelector('#home').classList.toggle('highlight', buttons.home);
    document
      .querySelector('#r')
      .classList.toggle('highlight', buttons.r || buttons.zr);
    document
      .querySelector('#r')
      .classList.toggle('highlight', buttons.r || buttons.zr);
    document.querySelector('#plus').classList.toggle('highlight', buttons.plus);
    document
      .querySelector('#joystick-right')
      .classList.toggle('highlight', buttons.rightStick);

    document.querySelector('#rc-st').value = ringCon.strain;


    let side = "right";
      socket.emit("ctl", [side, "joystick",parseFloat(joystick.horizontal), parseFloat(joystick.vertical), buttons.rightStick]);
      socket.emit("ctl", [side, "up",(buttons.x)]);
      socket.emit("ctl", [side, "down",(buttons.b)]);
      socket.emit("ctl", [side, "left",(buttons.y)]);
      socket.emit("ctl", [side, "right",(buttons.a)]);
      socket.emit("ctl", [side, "shoulder",(buttons.r)]);
      socket.emit("ctl", [side, "trigger",(buttons.zr)]);
      socket.emit("ctl", [side, "start",(buttons.plus)]);
      socket.emit("ctl", [side, "home",(buttons.home)]);
      socket.emit("ctl", [side, "accel",parseFloat(accelerometer.x)*100,parseFloat(accelerometer.y)*100,parseFloat(accelerometer.z)*100]);
      socket.emit("ctl", [side, "gyro",parseFloat(gyroscope.rps.x)*100,parseFloat(gyroscope.rps.y)*100,parseFloat(gyroscope.rps.z)*100]);
      socket.emit("ctl", [side, "orientation",parseFloat(orientation.alpha),parseFloat(orientation.beta), parseFloat(orientation.gamma)]);


  }

  // test led and rumble
  /*
  if (buttons.a || buttons.up) {
    joyCon.blinkLED(0);
  }
  if (buttons.b || buttons.down) {
    joyCon.setLED(0);
  }
  if (buttons.x || buttons.right) {
    joyCon.resetLED(0);
    joyCon.rumble(600, 600, 0);
  }
  if (buttons.y || buttons.left) {
    joyCon.rumble(600, 600, 0.5);
  }

  */
  if (showDebug.checked) {
    const controller = joyCon instanceof JoyConLeft ? debugLeft : debugRight;
    controller.querySelector('pre').textContent =
      JSON.stringify(orientation, null, 2) +
      '\n' +
      JSON.stringify(orientationQuaternion, null, 2) +
      '\n' +
      JSON.stringify(gyroscope, null, 2) +
      '\n' +
      JSON.stringify(accelerometer, null, 2) +
      '\n';
    const meterMultiplier = 300;
    controller.querySelector('#acc-x').value =
      accelerometer.x * meterMultiplier;
    controller.querySelector('#acc-y').value =
      accelerometer.y * meterMultiplier;
    controller.querySelector('#acc-z').value =
      accelerometer.z * meterMultiplier;

    const gyroscopeMultiplier = 300;
    controller.querySelector('#gyr-x').value =
      gyroscope.rps.x * gyroscopeMultiplier;
    controller.querySelector('#gyr-y').value =
      gyroscope.rps.y * gyroscopeMultiplier;
    controller.querySelector('#gyr-z').value =
      gyroscope.rps.z * gyroscopeMultiplier;
  }
};

// Joy-Cons may sleep until touched, so attach the listener dynamically.
setInterval(async () => {
  for (const joyCon of connectedJoyCons.values()) {
    if (joyCon.eventListenerAttached) {
      continue;
    }
    joyCon.eventListenerAttached = true;
    await joyCon.enableVibration();
    joyCon.addEventListener('hidinput', (event) => {
      visualize(joyCon, event.detail);
    });

    connectButtonRingCon.onclick = async () => await joyCon.enableRingCon();
  }
}, 2000);

showDebug.addEventListener('input', (e) => {
  document.querySelector('#debug').style.display = e.target.checked
    ? 'flex'
    : 'none';
});

function vibrate(side, low, high, amp){
  for (const joyCon of connectedJoyCons.values()) {
    if (joyCon instanceof JoyConLeft && side == "left"){
      joyCon.rumble(low,high,amp)
    }

    if (joyCon instanceof JoyConRight && side == "right"){
      joyCon.rumble(low,high,amp)

    }

  }

}
socket.on("vibrate",(data)=>{
  vibrate(data[0],data[1],data[2],data[3]);

})
