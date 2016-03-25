var express = require('express'),
	cors = require('cors'),
	app = express(),
	onvif = require('onvif'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	Cam = require('onvif').Cam,
	Stream = require('node-rtsp-stream');
	
app.use(cors());
app.set('port', (process.env.PORT || 5000));

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var cam;

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
}); 

var stream = null;
var startStream =  function(url){
	var streamObject = {
		name: 'name',
		streamUrl: url,
		wsPort: 9999
	}
	if(stream === null) {		
		stream = new Stream(streamObject);
	} else {
		stream.wsServer.close();	
		stream = new Stream(streamObject);		
	}
}

app.get('/', function (req, res) {
	res.send("welcome to IP camera");		
});

app.get('/search', function (req, res) {
	onvif.Discovery.probe(function(err, cams) {
	// function would be called only after timeout (5 sec by default) 
		if (err) { throw err; }	
		var jsonObject ='[';
		var count = 0;
		var len = cams.length;
		
		var getDeviceInfo = function(cam,hardwareId,serialNumber){
			console.log(hardwareId,serialNumber);
			count++;
			jsonObject +='{';
			jsonObject +='"hostname":"'+cam.hostname+'",';
			jsonObject +='"port":"'+cam.port+'",';
			jsonObject +='"hardwareId":"'+hardwareId+'",';
			jsonObject +='"serialNumber":"'+serialNumber+'"';
			
			if(count==len) {
				jsonObject +="}]";
				console.log(jsonObject);
				res.json(JSON.parse(jsonObject));	
			} else {
				jsonObject +="},";
			}	
		
		};
		cams.forEach(function(cam) {
			var hardwareId,serialNumber;
			cam.getDeviceInformation(function(a,b,c){
				hardwareId = b.hardwareId;
				serialNumber = b.serialNumber;
				getDeviceInfo(cam,hardwareId,serialNumber);
			});				
		});	
				
	});
});

app.post('/connect',jsonParser,function (req, res) {
	cam = new Cam(req.body,function(err){
		if(err ===  null){
			res.json({"status":"success"});
		}else{
			res.json({"error":err.code});
		}
	});	
	
});

app.get('/livestreaming', function (req, res) {
	if(cam !== null) {
		cam.getStreamUri({protocol:'RTSP'}, function(err, stream) {
			startStream(stream);
		});
	} else {
		res.json({"error":"connect to camera"});
	}
});

app.get('/movecamera', function (req, res) {
	if(cam !== null) {
		var x = req.query.x;
		var y = req.query.y;
		cam.continuousMove({x:x,y:y,zoom:1});
		res.send("moving the camera");
	} else {
		res.send('connect the camera');
	}
});

app.delete('/disconnect', function (req, res) {
	cam = null;
	res.send("disconnected");
});

app.post('/authenticate',jsonParser,function (req, res) {
	var username = req.body.username;	
	var password = req.body.password;
	if(username === "admin" && password === "admin"){
		res.json({"status":"success","username":username});
	} else {
		res.json({"status":"failure"});
	}
});