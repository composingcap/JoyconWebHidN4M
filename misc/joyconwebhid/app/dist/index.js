import{JoyConLeft,JoyConRight,GeneralController}from"./joycon.js";const connectedJoyCons=new Map;const devices=[];const getDeviceID=device=>{const n=devices.indexOf(device);if(n>=0){return n}devices.push(device);return devices.length-1};const addDevice=async device=>{const id=getDeviceID(device);console.log(`HID connected: ${id} ${device.productId.toString(16)} ${device.productName}`);connectedJoyCons.set(id,await connectDevice(device))};const removeDevice=async device=>{const id=getDeviceID(device);console.log(`HID disconnected: ${id} ${device.productId.toString(16)} ${device.productName}`);connectedJoyCons.delete(id)};navigator.hid.addEventListener("connect",(async({device})=>{addDevice(device)}));navigator.hid.addEventListener("disconnect",(({device})=>{removeDevice(device)}));document.addEventListener("DOMContentLoaded",(async()=>{const devices=await navigator.hid.getDevices();devices.forEach((async device=>{await addDevice(device)}))}));const connectJoyCon=async()=>{const filters=[{vendorId:1406}];try{const[device]=await navigator.hid.requestDevice({filters});if(!device){return}await addDevice(device)}catch(error){console.error(error.name,error.message)}};const connectDevice=async device=>{let joyCon=null;if(device.productId===8198){joyCon=new JoyConLeft(device)}else if(device.productId===8199){if(device.productName==="Joy-Con (R)"){joyCon=new JoyConRight(device)}}if(!joyCon){joyCon=new GeneralController(device)}await joyCon.open();await joyCon.enableUSBHIDJoystickReport();await joyCon.enableStandardFullMode();await joyCon.enableIMUMode();return joyCon};export{connectJoyCon,connectedJoyCons,JoyConLeft,JoyConRight,GeneralController};