var express = require('express');
var cors = require('cors')
var app = express();
var onvif = require('onvif');
var bodyParser = require('body-parser')
app.use(cors());
var jsonParser = bodyParser.json()
app.use(bodyParser.json({ type: 'application/*+json' }))
app.set('port', (process.env.PORT || 5000));

<<<<<<< HEAD
var Cam = require('onvif').Cam;
var cam = null;

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
}); 

app.get('/', function (req, res) {
		res.send("welcome to IP camera");		
	});
});
app.get('/search', function (req, res) {
	onvif.Discovery.probe(function(err, cams) {
	// function would be called only after timeout (5 sec by default) 
		if (err) { throw err; }	
		var jsonObject ='[';
		var count = 0;
		var len = cams.length;
		cams.forEach(function(cam) {
			count++;
			jsonObject +='{';
			jsonObject +='"hostname":"'+cam.hostname+'",';
			jsonObject +='"username":"'+cam.username+'",';
			jsonObject +='"password":"'+cam.password+'",';
			jsonObject +='"port":"'+cam.port+'"';
			if(count==len)
				jsonObject +="}";
			else
				jsonObject +="},";		
		});	
		jsonObject +=']';
		console.log(jsonObject);	
		res.json(JSON.parse(jsonObject));		
	});
});

app.post('/connect',jsonParser, function (req, res) {
	cam = new Cam(req.body);	
	res.send("connected successfully");
});

app.get('/livestreaming', function (req, res) {
	cam.getStreamUri({protocol:'RTSP'}, function(err, stream) {
	console.log(err);
		res.send('<embed type="application/x-vlc-plugin" target="' + stream.uri + '"></embed>');
	});
=======
// var Cam = require('onvif').Cam;
// var cam = new Cam({hostname: '192.168.1.38',username: 'admin',password: 'admin',port:'2000'});

app.get('/livestreaming', function (req, res) {
	// cam.getStreamUri({protocol:'RTSP'}, function(err, stream) {
		res.send('<iframe width="420" height="345" src="http://www.youtube.com/embed/XGSy3_Czz8k"></iframe>');
	// });
>>>>>>> c98d8ad3b5d4184af3d48f0d6366cd1ebdd89fef
});

app.get('/movecamera', function (req, res) {
	var x = req.query.x;
	var y = req.query.y;
	cam.continuousMove({x:x,y:y,zoom:1});
	res.send("moving the camera");
});

app.delete('/disconnect', function (req, res) {
	cam = null;
	res.send("disconnected");
});




