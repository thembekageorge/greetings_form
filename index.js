const express = require('express');
const exphbs = require("express-handlebars");
const form = require('body-parser');
var app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:tg9703151103082@ds127044.mlab.com:27044/dbs1');


'use strict';
module.exports = function(app) {
  var mongoose = require('mongoose');

  const mongoURL = process.env.MONGO_DB_URL || "'mongodb://localhost/dbs1'";
  mongoose.connect(mongoURL);

  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected');
  });

  var greetingSchema = mongoose.Schema({
    name: String,
    greetcounter: Number
  });
  var greetings = mongoose.model('greetings', greetingSchema);

  var namesGreeted = {};
  var names = [];
  var counter = 0;


  function getGreeting(language) {
    if (language === 'english') {
      return 'Hello';
    } else if (language === 'espanol') {
      return 'Hola';
    } else if (language === 'xhosa') {
      return 'Molo';
    }
  }


  function mgreeting(newName, fn) {
    greetings.findOne({
      name: newName
    }, function(err, greetedName) {
      if (greetedName) {
        greetings.update({
          name: newName
        }, {
          greetcounter: Number(greetedName.greetcounter) + 1
        }, fn);
        console.log('Name updated');
        return;
      } else {
        greetings.create({
          name: newName,
          greetcounter: 1
        }, fn);
        console.log('Name created');
        return;
      }
    });
  }

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/greeting', function(req, res) {
    res.render('greeting', {
      counter
    });
  });

  app.post('/greeting', function(req, res, next) {
    var language = req.body.language;
    var newName = req.body.textbox;
    var greetBtn = req.body.button;
    // var resetBtn = req.body.resetBtn;

    if (greetBtn) {
      var processGreetingResult = function(err, theGreeting) {
        var greetingMessage = getGreeting(language);
        for (var i = 0; i < namesGreeted.length; i++) {};
        if (err) {
          return next(err);
        } else if (namesGreeted[newName] !== undefined && newName !== "" && greetingMessage) {
          res.render('greeting', {
            name: newName,
            counter: counter,
            greeting: greetingMessage
          });
        } else if (namesGreeted[newName] === undefined && newName !== "" && greetingMessage) {
          namesGreeted[newName] = 1;
          counter += 1;
          greetings.findOne({
            name: newName
          }, function(err, theGreeting) {
            res.render('greeting', {
              name: newName,
              counter: counter,
              greeting: greetingMessage
            });
          });
        }
      }
      mgreeting(newName, processGreetingResult);
    } else if (resetBtn) {
      names = names;
      counter = 0;
      greetings.update({}, {
        $set: {
          greetcounter: 0
        }
      }, {
        multi: true
      }, function(err) {
        if (err) {
          console.log('Error removing names from DB');
        } else {
          console.log('Names counter reset successful');
        }
      });
      res.render('greeting', {
        counter: counter
      });
    }
  });

  app.get('/greeted', function(req, res) {
    var names = [];
    greetings.find({}, function(err, gNames) {
      for (var j = 0; j < gNames.length; j++) {
        var curObj = gNames[j].name;
        names.push(curObj);
      }
      console.log(names);
      res.render('greeted', {
        names: names,
        counter: counter
      });
    });
  });

  app.get('/counter/:nameInfo', function(req, res) {
    greetings.findOne({
      name: req.params.nameInfo
    }, function(err, result) {
      if (err) {
        console.log('Error!!!');
      } else {
        if (result) {
          var named = result;
          res.render('counter', named);
        }
      }
    });
  });
}















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
