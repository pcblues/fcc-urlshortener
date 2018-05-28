// server.js
// where your node app starts

// init project
var express = require('express')
var app = express()
var mongo=require('mongodb').MongoClient

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

var collName='urls'
var urlPrefix='https://fcc-uurlshortener.glitch.me/'
var dbName = 'fcc-uurlshortener'

// http://expressjs.com/en/starter/basic-routing.html
app.get("/new/*", function (request, response) {
  var url = process.env.MONGODB_URL
  console.log(url)
  var req = request.url
  var requested = req.substring(5)
  mongo.connect(url,{useNewUrlParser:true},function(err,db) {
    if (err) {response.send(JSON.stringify(err))} 
    var shortNum = 1000
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    // get max number
    var urlDoc = coll.find().sort({urlNum:-1}).limit(1)
    // create new url
    if (isNaN(urlDoc.urlNum)===false) {
      shortNum = urlDoc.urlNum+1
    }
    // return link to user
    var newUrl = 'https://fcc-uurlshortener.glitch.me/'+shortNum
    var newDocObj = {"urlNum":shortNum,"url":newUrl}
    
    var newDoc= JSON.stringify(newDocObj)
    console.log(newDoc)
    
    var coll = dbo.collection(collName)
    coll.insert(newDocObj,function(err,data) {
    if (err) throw err
      
    })
    db.close()
    response.send('<html><head><title>Shortened URL</title></head><body><a href="'+newUrl+'" target="_blank">'+newUrl+'</a></body></html>')
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
  } 
    // get url associated with link
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    var urlNum = parseInt(requested)
    coll.find({urlNum:urlNum}).toArray(
        function(err,doc) {
          if (err) throw err
          result=doc.url
          db.close()
        })  
    if (result==="") {
        response.send("Create a new shortened URL with: https://fcc-uurlshortener.glitch.me/new/LONG_URL_HERE")
      } else {
        response.redirect(result)
      }  
  })
})

              


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
})
