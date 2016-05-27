var express = require('express');
var cors = require('cors')
var app = express();
var onvif = require('onvif');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');

app.use(cors());
app.set('port', (process.env.PORT || 5000));

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var Cam = require('onvif').Cam;
var cam;

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
}); 

app.get('/', function (req, res) {
	res.send("welcome to IP camera");		
});

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "onvif"
});
app.post('/authenticate',jsonParser,function (req, res) {
	var username = req.body.username;	
	var password = req.body.password;	
	con.query('SELECT COUNT(*) as count FROM users where email=? and password=?', [username,password],function (error, rows) {
		if(error) {
			throw err;
		}
		if(rows[0].count){
			res.json({"status":"success","username":username});
		} else {
			res.json({"status":"please enter valid username and password"});
		}
	});
});
app.post('/register',jsonParser,function (req, res) {	
	var email = req.body.email;	
	var password = req.body.password;
	var mobile = req.body.mobile;
	var country = req.body.country;	
	var userDetails = { email:email, password: password,mobile: mobile,country:country};
	console.log(userDetails)
	con.query('INSERT INTO users SET ?', userDetails, function(error,res){
		if(error) throw error;
		console.log('Last insert ID:', res.insertId);
	});
	res.json({"status":"registered successfully"});
});
app.post('/addCamera',jsonParser,function (req, res) {	
	var cameraid = req.body.cameraid;
	var userid = req.body.userid;	
	console.log(userid)
	var camera = { userid:userid, cameraid: cameraid };
	console.log(camera)
	con.query('INSERT INTO cameras SET ?', camera, function(error,res){
		if(error) throw err;
		console.log('Last insert ID:', res.insertId);
	});
	res.json({"status":"camera added successfully"});
});
app.get('/getUserId',jsonParser,function (req, res) {	
	var useremail = req.query.useremail;	
	con.query('SELECT id FROM users where email=?', [useremail],function (error, rows) {
		if(error)throw err;
		var userid = rows[0].id;
		console.log(userid);
		res.json({"id":userid});
	});
});
app.get('/myCameras',jsonParser,function (req, res) {	
	var userid = req.query.id;	
	con.query('SELECT cameraid FROM cameras where userid=?', [userid],function (error, rows) {
		if(error) throw err;
		console.log(rows.length);
		var jsonResponse = '[';
		var count =0;
		for (var i = 0; i < rows.length; i++) {
			count++;			
			if(rows.length == count){
				jsonResponse += '{"cameraid":"'+rows[i].cameraid+'"}';
			}else{				
				jsonResponse += '{"cameraid":"'+rows[i].cameraid+'"},';
			}			
		}
		jsonResponse += ']';
		var parsedJson = JSON.parse(jsonResponse);
		console.log(parsedJson);
		res.json(parsedJson);
	});
});