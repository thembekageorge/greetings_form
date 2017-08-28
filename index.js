const express = require('express');
const exphbs = require("express-handlebars");
const form = require('body-parser');
var app = express();

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

  // for (var i = 0; i < nameList.length; i++) {
  //   if (map[nameList[i]] != null) {
  //     map[nameList[i]] += 1;
  //   } else {
  //     map[nameList[i]] = 1;
  //   }
  //   // console.log('counter : ' + map[nameList[i]])
  // }
  console.log('counter : ' + map[nameList[i]])
  res.render("home", {
    greetingMsg: greeting
  });
});

//start the server
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
