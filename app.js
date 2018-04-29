var express = require('express');
var app = express();
app.use(express.static('src'));
app.listen(8080, function () {
    console.log('listening on port 8080!');
});