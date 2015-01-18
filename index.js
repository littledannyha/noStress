var http = require('http');
var dgram = require('dgram');
//var osc = require('osc-min');

var inputPort = 8888;
var brainDataSocket = dgram.createSocket('udp4');

var outputPort = 8889;

currActivation = .383;


brainDataSocket.on('message', function (message) {
	var octals = message;
	//console.log('number of octals ' + octals.length)
	//console.log(message);

	var currOct = 0;
	while(octals[currOct] != 44 && currOct < octals.length){
		currOct += 1;
	}
	var OUTPUT = octals.readFloatBE(currOct + 2);
	//var div = 1.0/OUTPUT;
	//var transformed = OUTPUT == 0? 0: 
	//FINALOUT = OUTPUT == 0? 0: 7* (93.71 + Math.log(OUTPUT));
	//FINALOUT = ((OUTPUT * 1e41) - (2.14e-41))/.138
	FINALOUT = (((OUTPUT * 1e41) - 2.140)/.00137)
	FINALOUT = FINALOUT > 0 ? Math.floor(FINALOUT) : 0
	console.log( FINALOUT);
	currActivation = FINALOUT;
	//console.log(div);


});

brainDataSocket.bind(inputPort);
console.log('brainDataSocket started on port ' + inputPort);

function getValueToSend(){
	return currActivation;
}

function sendActivation(req,res){
	//console.log('request made to 8889');
	res.writeHead('200',{'Content-Type':'text/plain'});
	res.write(getValueToSend().toString());
	res.end();
}

var outputServer = http.createServer(sendActivation);
outputServer.listen(8889);
console.log('output server started on port ' + outputPort);
