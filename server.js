// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongo=require('mongodb').MongoClient

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/new/*", function (request, response) {
  var url = process.env.MONGODB_URL
  console.log(url)
  var req = request.url
  var requested = req.substring(5)
  mongo.connect(url,{useNewUrlParser:true},function(err,db) {
    if (err) {
      response.send(JSON.stringify(err))
  } else {
    response.send(requested)
  }
                
})
})

app.get("/*",function (request,response) {
  var result=""
  var url = process.env.MONGODB_URL  
  var req = request.url
  var requested = req.substring(5)
  console.log(requested)
  mongo.connect(url,{useNewUrlParser:true},function(err,db) {
    if (err) {
      response.send(JSON.stringify(err))
  } else {
if (result=="") {
    response.send("Create a new shortened URL with: https://fcc-uurlshortener.glitch.me/new/LONG_URL_HERE")
  } else {
    response.redirect(result)
  }  
  }                
})
  
  
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
})
