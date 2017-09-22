// var MongoClient = require('mongodb').MongoClient
//     , format = require('util').format;
// MongoClient.connect('mongodb://127.0.0.1:27017/dbs1', function (err, db) {
//     if (err) {
//         throw err;
//     } else {
//         console.log("successfully connected to the database");
//     }
//     db.close();
// });


var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var greet = require('./index');
var app = express();

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

greet(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('App running on http://localhost:' + port);
});
