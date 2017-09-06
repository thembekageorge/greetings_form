const express = require('express');
const exphbs = require("express-handlebars");
const form = require('body-parser');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dbs1');
// const mongoURL = process.env.MONGO_DB_URL || "'mongodb://localhost/dbs1'";
//
// mongoose.connect(mongoURL);

// setting rendering engine
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  extname: "handlebars"
}));
app.use(express.static("public"));
app.use(form.urlencoded({
  extended: false
}));
app.set("view engine", "handlebars")
app.get("/", function(req, res) {
  res.render("home");
});

// app.post("/",function(req,res){
//  greeting = 'Hello, ' + req.body.name + '!';
//   res.render('home', {
//     greetingMsg: greet
//   });
// });

var greeting = "";
var nameList = [];
var noDuplication = [];
app.post("/", function(req, res) {

  var nameEntered = req.body.name;
  var language = req.body.language;
  var map = new Object();

  if (language === "isiXhosa") {
    greeting = "Molo, " + nameEntered;
  } else if (language === "English") {
    greeting = "Hello, " + nameEntered;
  } else if (language === "Sesotho") {
    greeting = "Dumela, " + nameEntered;
  }
  if (noDuplication.indexOf(nameEntered) === -1) {
    noDuplication.push(nameEntered);
  }

  nameList.push(nameEntered);

  console.log(nameList);
  console.log(noDuplication);

  for (var i = 0; i < nameList.length; i++) {
    if (map[nameList[i]] != null) {
      map[nameList[i]] += 1;
    } else {
      map[nameList[i]] = 1;
    }
    // console.log('counter : ' + map[nameList[i]])
  }
  console.log('counter : ' + map[nameList[i]])
  res.render("home", {
    greetingMsg: greeting
  });
});

app.get('/greeted', function(req, res) {
    res.render('greeted', {
        greeted: noDuplication
    });
});

//start the server
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
