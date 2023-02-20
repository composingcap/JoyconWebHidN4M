import{Madgwick}from"./madgwick.js";const leftMadgwick=new Madgwick(10);const rightMadgwick=new Madgwick(10);const rad2deg=180/Math.PI;function baseSum(array,iteratee){let result;for(const value of array){const current=iteratee(value);if(current!==undefined){result=result===undefined?current:result+current}}return result}function mean(array){return baseMean(array,(value=>value))}function baseMean(array,iteratee){const length=array==null?0:array.length;return length?baseSum(array,iteratee)/length:NaN}function calculateBatteryLevel(value){let level;switch(value[0]){case 8:level="full";break;case 4:level="medium";break;case 2:level="low";break;case 1:level="critical";break;case 0:level="empty";break;default:level="charging"}return level}const ControllerType={1:"Left Joy-Con",2:"Right Joy-Con",3:"Pro Controller"};const bias=.75;const zeroBias=.0125;const scale=Math.PI/2;export function toEulerAngles(lastValues,gyroscope,accelerometer,productId){const now=Date.now();const dt=lastValues.timestamp?(now-lastValues.timestamp)/1e3:0;lastValues.timestamp=now;const norm=Math.sqrt(accelerometer.x**2+accelerometer.y**2+accelerometer.z**2);lastValues.alpha=(1-zeroBias)*(lastValues.alpha+gyroscope.z*dt);if(norm!==0){lastValues.beta=bias*(lastValues.beta+gyroscope.x*dt)+(1-bias)*(accelerometer.x*scale/norm);lastValues.gamma=bias*(lastValues.gamma+gyroscope.y*dt)+(1-bias)*(accelerometer.y*-scale/norm)}return{alpha:productId===8198?(-1*(lastValues.alpha*180)/Math.PI*430%90).toFixed(6):(lastValues.alpha*180/Math.PI*430%360).toFixed(6),beta:(-1*(lastValues.beta*180)/Math.PI).toFixed(6),gamma:productId===8198?(-1*(lastValues.gamma*180)/Math.PI).toFixed(6):(lastValues.gamma*180/Math.PI).toFixed(6)}}export function toEulerAnglesQuaternion(q){const ww=q.w*q.w;const xx=q.x*q.x;const yy=q.y*q.y;const zz=q.z*q.z;return{alpha:(rad2deg*Math.atan2(2*(q.x*q.y+q.z*q.w),xx-yy-zz+ww)).toFixed(6),beta:(rad2deg*-Math.asin(2*(q.x*q.z-q.y*q.w))).toFixed(6),gamma:(rad2deg*Math.atan2(2*(q.y*q.z+q.x*q.w),-xx-yy+zz+ww)).toFixed(6)}}export function toQuaternion(gyro,accl,productId){if(productId===8198){leftMadgwick.update(gyro.x,gyro.y,gyro.z,accl.x,accl.y,accl.z);return leftMadgwick.getQuaternion()}rightMadgwick.update(gyro.x,gyro.y,gyro.z,accl.x,accl.y,accl.z);return rightMadgwick.getQuaternion()}function toAcceleration(value){const view=new DataView(value.buffer);return parseFloat((244e-6*view.getInt16(0,true)).toFixed(6))}function toDegreesPerSecond(value){const view=new DataView(value.buffer);return parseFloat((.06103*view.getInt16(0,true)).toFixed(6))}function toRevolutionsPerSecond(value){const view=new DataView(value.buffer);return parseFloat((1694e-7*view.getInt16(0,true)).toFixed(6))}export function parseDeviceInfo(rawData,data){const bytes=rawData.slice(15,15+11);const firmwareMajorVersionRaw=bytes.slice(0,1)[0];const firmwareMinorVersionRaw=bytes.slice(1,2)[0];const typeRaw=bytes.slice(2,3);const macAddressRaw=bytes.slice(4,10);const macAddress=[];macAddressRaw.forEach((number=>{macAddress.push(number.toString(16))}));const spiColorInUseRaw=bytes.slice(11,12);const result={_raw:bytes.slice(0,12),_hex:bytes.slice(0,12),firmwareVersion:{major:firmwareMajorVersionRaw,minor:firmwareMinorVersionRaw},type:ControllerType[typeRaw[0]],macAddress:macAddress.join(":"),spiColorInUse:spiColorInUseRaw[0]===1};return result}export function parseInputReportID(rawData,data){const inputReportID={_raw:rawData.slice(0,1),_hex:data.slice(0,1)};return inputReportID}export function parseTimer(rawData,data){const timer={_raw:rawData.slice(1,2),_hex:data.slice(1,2)};return timer}export function parseBatteryLevel(rawData,data){const batteryLevel={_raw:rawData.slice(2,3),_hex:data.slice(2,3),level:calculateBatteryLevel(data.slice(2,3))};return batteryLevel}export function parseConnectionInfo(rawData,data){const connectionInfo={_raw:rawData.slice(2,3),_hex:data.slice(2,3)};return connectionInfo}export function parseButtonStatus(rawData,data){const buttonStatus={_raw:rawData.slice(1,3),_hex:data.slice(1,3)};return buttonStatus}export function parseCompleteButtonStatus(rawData,data){const buttonStatus={_raw:rawData.slice(3,6),_hex:data.slice(3,6),y:Boolean(1&rawData[3]),x:Boolean(2&rawData[3]),b:Boolean(4&rawData[3]),a:Boolean(8&rawData[3]),r:Boolean(64&rawData[3]),zr:Boolean(128&rawData[3]),down:Boolean(1&rawData[5]),up:Boolean(2&rawData[5]),right:Boolean(4&rawData[5]),left:Boolean(8&rawData[5]),l:Boolean(64&rawData[5]),zl:Boolean(128&rawData[5]),sr:Boolean(16&rawData[3])||Boolean(16&rawData[5]),sl:Boolean(32&rawData[3])||Boolean(32&rawData[5]),minus:Boolean(1&rawData[4]),plus:Boolean(2&rawData[4]),rightStick:Boolean(4&rawData[4]),leftStick:Boolean(8&rawData[4]),home:Boolean(16&rawData[4]),capture:Boolean(32&rawData[4]),chargingGrip:Boolean(128&rawData[4])};return buttonStatus}export function parseAnalogStick(rawData,data){const analogStick={_raw:rawData.slice(3,4),_hex:data.slice(3,4)};return analogStick}export function parseAnalogStickLeft(rawData,data){let horizontal=rawData[6]|(rawData[7]&15)<<8;horizontal=((horizontal/1995-1)*2).toFixed(1);let vertical=(rawData[7]>>4|rawData[8]<<4)*-1;vertical=((vertical/2220+1)*2).toFixed(1);const analogStickLeft={_raw:rawData.slice(6,9),_hex:data.slice(6,9),horizontal,vertical};return analogStickLeft}export function parseAnalogStickRight(rawData,data){let horizontal=rawData[9]|(rawData[10]&15)<<8;horizontal=((horizontal/1995-1)*2).toFixed(1);let vertical=(rawData[10]>>4|rawData[11]<<4)*-1;vertical=((vertical/2220+1)*2).toFixed(1);const analogStickRight={_raw:rawData.slice(9,12),_hex:data.slice(9,12),horizontal,vertical};return analogStickRight}export function parseFilter(rawData,data){const filter={_raw:rawData.slice(4),_hex:data.slice(4)};return filter}export function parseVibrator(rawData,data){const vibrator={_raw:rawData.slice(12,13),_hex:data.slice(12,13)};return vibrator}export function parseAck(rawData,data){const ack={_raw:rawData.slice(13,14),_hex:data.slice(13,14)};return ack}export function parseSubcommandID(rawData,data){const subcommandID={_raw:rawData.slice(14,15),_hex:data.slice(14,15)};return subcommandID}export function parseSubcommandReplyData(rawData,data){const subcommandReplyData={_raw:rawData.slice(15),_hex:data.slice(15)};return subcommandReplyData}export function parseAccelerometers(rawData,data){const accelerometers=[{x:{_raw:rawData.slice(13,15),_hex:data.slice(13,15),acc:toAcceleration(rawData.slice(13,15))},y:{_raw:rawData.slice(15,17),_hex:data.slice(15,17),acc:toAcceleration(rawData.slice(15,17))},z:{_raw:rawData.slice(17,19),_hex:data.slice(17,19),acc:toAcceleration(rawData.slice(17,19))}},{x:{_raw:rawData.slice(25,27),_hex:data.slice(25,27),acc:toAcceleration(rawData.slice(25,27))},y:{_raw:rawData.slice(27,29),_hex:data.slice(27,29),acc:toAcceleration(rawData.slice(27,29))},z:{_raw:rawData.slice(29,31),_hex:data.slice(29,31),acc:toAcceleration(rawData.slice(29,31))}},{x:{_raw:rawData.slice(37,39),_hex:data.slice(37,39),acc:toAcceleration(rawData.slice(37,39))},y:{_raw:rawData.slice(39,41),_hex:data.slice(39,41),acc:toAcceleration(rawData.slice(39,41))},z:{_raw:rawData.slice(41,43),_hex:data.slice(41,43),acc:toAcceleration(rawData.slice(41,43))}}];return accelerometers}export function parseGyroscopes(rawData,data){const gyroscopes=[[{_raw:rawData.slice(19,21),_hex:data.slice(19,21),dps:toDegreesPerSecond(rawData.slice(19,21)),rps:toRevolutionsPerSecond(rawData.slice(19,21))},{_raw:rawData.slice(21,23),_hex:data.slice(21,23),dps:toDegreesPerSecond(rawData.slice(21,23)),rps:toRevolutionsPerSecond(rawData.slice(21,23))},{_raw:rawData.slice(23,25),_hex:data.slice(23,25),dps:toDegreesPerSecond(rawData.slice(23,25)),rps:toRevolutionsPerSecond(rawData.slice(23,25))}],[{_raw:rawData.slice(31,33),_hex:data.slice(31,33),dps:toDegreesPerSecond(rawData.slice(31,33)),rps:toRevolutionsPerSecond(rawData.slice(31,33))},{_raw:rawData.slice(33,35),_hex:data.slice(33,35),dps:toDegreesPerSecond(rawData.slice(33,35)),rps:toRevolutionsPerSecond(rawData.slice(33,35))},{_raw:rawData.slice(35,37),_hex:data.slice(35,37),dps:toDegreesPerSecond(rawData.slice(35,37)),rps:toRevolutionsPerSecond(rawData.slice(35,37))}],[{_raw:rawData.slice(43,45),_hex:data.slice(43,45),dps:toDegreesPerSecond(rawData.slice(43,45)),rps:toRevolutionsPerSecond(rawData.slice(43,45))},{_raw:rawData.slice(45,47),_hex:data.slice(45,47),dps:toDegreesPerSecond(rawData.slice(45,47)),rps:toRevolutionsPerSecond(rawData.slice(45,47))},{_raw:rawData.slice(47,49),_hex:data.slice(47,49),dps:toDegreesPerSecond(rawData.slice(47,49)),rps:toRevolutionsPerSecond(rawData.slice(47,49))}]];return gyroscopes}export function calculateActualAccelerometer(accelerometers){const elapsedTime=.005*accelerometers.length;const actualAccelerometer={x:parseFloat((mean(accelerometers.map((g=>g[0])))*elapsedTime).toFixed(6)),y:parseFloat((mean(accelerometers.map((g=>g[1])))*elapsedTime).toFixed(6)),z:parseFloat((mean(accelerometers.map((g=>g[2])))*elapsedTime).toFixed(6))};return actualAccelerometer}export function calculateActualGyroscope(gyroscopes){const elapsedTime=.005*gyroscopes.length;const actualGyroscopes=[mean(gyroscopes.map((g=>g[0]))),mean(gyroscopes.map((g=>g[1]))),mean(gyroscopes.map((g=>g[2])))].map((v=>parseFloat((v*elapsedTime).toFixed(6))));return{x:actualGyroscopes[0],y:actualGyroscopes[1],z:actualGyroscopes[2]}}export function parseRingCon(rawData,data){const ringcon={_raw:rawData.slice(38,2),_hex:data.slice(38,2),strain:new DataView(rawData.buffer,39,2).getInt16(0,true)};return ringcon}