var Cam = require('onvif').Cam,
express = require('express');
var app = express();

var cam = new Cam({hostname: '192.168.1.38',username: 'admin',password: 'admin',port:'2000'});

app.get('/', function (req, res) {
	cam.getStreamUri({protocol:'RTSP'}, function(err, stream) {
		res.send('<html><body><embed type="application/x-vlc-plugin" target="' + stream.uri + '"></embed></boby></html>');
	});
});

app.get('/move', function (req, res) {
	var x = req.query.x;
	var y = req.query.y;
	cam.continuousMove({x:x,y:y,zoom:1});
	res.send("moving the camera");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
}); 
