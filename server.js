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
var fnUrlNum='urlNum'
var fnUrl='url'

// http://expressjs.com/en/starter/basic-routing.html
app.get("/new/*", function (request, response) {
  var url = process.env.MONGODB_URL
  
  var req = request.url
  var requested = req.substring(5)
  var maxIdx = 1000
  mongo.connect(url,{useNewUrlParser:true},function(err,db) {
    if (err) {response.send(JSON.stringify(err))} 

    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    // create new url
    // return link to user
    coll.find().toArray(function (err,docs) {
      if(err) throw err
      console.log(docs.length)
        for (var c=0;c<docs.length;c++) {
          console.log(c+' '+docs[c][fnUrlNum])
          
          if (docs[c][fnUrlNum]>maxIdx) {
            maxIdx=docs[c][fnUrlNum]
          }
        
        }
          maxIdx+=1
    
        var newDocObj = {"url":requested,"urlNum":maxIdx}
        var newUrl =""
        coll.insert(newDocObj,function(err,data) {
        if (err) throw err

        newUrl=urlPrefix+maxIdx
        db.close()
        console.log(newUrl)
        var newHtml='<html><head><title>Shortened URL</title></head><body><a href="'+
            newUrl+'" target="_blank">'+newUrl+'</a></body></html>'
        console.log(newHtml)
        var newLink={url:newUrl}
        response.send(JSON.stringify(newLink))
        })

    })
  })
})

app.get("/*",function (request,response) {
  
  var url = process.env.MONGODB_URL  
  var req = request.url
  var requested = req.substring(1)
  
  if (parseInt(requested)>0) {
  mongo.connect(url,{useNewUrlParser:true},function(err,db) {
    if (err) {
      response.send(JSON.stringify(err))
  } 
    // get url associated with link
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    var urlNum = parseInt(requested)
    console.log(urlNum)
    coll.find({urlNum:urlNum}).toArray(function(err,docs){
          if (err) {response.send(JSON.stringify(err))}
      console.log(docs)
          var result=""
          if (docs.length>0) {
            result=docs[0].url
            console.log(result)    
          }
          db.close()
        if (result==="") {
            var errText = "No URL associated with this link. Create a new shortened URL with: https://fcc-uurlshortener.glitch.me/new/LONG_URL_HERE"
            var resp={error:errText}
            
            response.send(JSON.stringify(resp))
          } else {
            //var resp={url:result}
            response.redirect(result)
          }  
    
        })  
    })
  } else {
    var resp = {error:"Create a new shortened URL with: https://fcc-uurlshortener.glitch.me/new/LONG_URL_HERE"}
    response.send(JSON.stringify(resp))
  }
})

              


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
})
