const express = require("express");
const app = express();
var http = require('http').createServer(app);
const io = require("socket.io")(http);
const port = parseInt(Math.random() * 3000 + 4000);
//const port = 9001;
const max = require("max-api")
let changeDict = {};

changeDict["left"] ={};
changeDict["right"] = {};
	
function checkChanged(arr){
	let test = JSON.stringify(arr.slice(2));
	
	if (changeDict[arr[0]][arr[1]] == undefined){
		changeDict[arr[0]][arr[1]] =  test;
		return false;
		
		}
	
	if (test!= changeDict[arr[0]][arr[1]]){
			changeDict[arr[0]][arr[1]] =  test;
			if (arr[1] == "up"){

			}

			return true;

		
		} 
	return false;
	
	}

http.listen(port, () => {
  max.post('listening on *:' + port);
max.outlet(["port", port]);
max.outlet(["ready", "bang"]);

});

app.use(express.static("app"));

io.on('connection', (socket) => {
  socket.on("ctl", (data)=>{
	let check = checkChanged(data);
	if(check){
    mes = ["ctl"];
    mes = mes.concat(data);
    max.outlet(mes);
}
  })

});


