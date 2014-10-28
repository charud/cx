var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/bower_components'));
app.listen(3000);

app.get('/gallery/:index', function(req, res) {
	res.end('Slide ' + req.params.index + " from server");
});