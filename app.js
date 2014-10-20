var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(3000);

app.get('/gallery/:index', function(req, res) {
	res.end('Slide ' + req.params.index);
});