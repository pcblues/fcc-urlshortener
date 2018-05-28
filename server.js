// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  var result = {}
  //{"ipaddress":"49.255.32.94","language":"en-US","software":"Windows NT 10.0; Win64; x64"}
  result.ipaddress=request.header('x-forwarded-for').split(',')[0] || request.connection.remoteAddress
  result.language=request.headers['accept-language'].split(',')[0]
  result.software=request.headers['user-agent'].split('(')[1].split(')')[0]
  var resp = JSON.stringify(result)
  response.send(resp);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
