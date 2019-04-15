var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./menusection.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// db.run('CREATE TABLE Menusection(id integer PRIMARY KEY, name text)', function (err) {
//   if (err) console.log(err.message);
// });

app.get('/menusection', function(req, res) {
  db.all('SELECT id, name FROM Menusection', function(err, rows) {
    if (err) return err.message;
    var obj = [];
    rows.forEach(row => {
      obj.push({"id": row.id, "name": row.name});
    });
    res.json({"MenuSection": obj});
  });
})

app.get('/menusection/:id', function(req, res) {
  db.all('SELECT id, name FROM Menusection WHERE id = ' + req.params.id, function(err, rows) {
    if (err) return err.message;
    var obj = [];
    rows.forEach(row => {
      obj.push({"id": row.id, "name": row.name});
    });
    res.json({"MenuSection": obj});
  });
})

app.post('/menusection', function(req, res) {
  if (typeof req.body.name === 'string') {
    db.all('SELECT count(*) count FROM Menusection', function(err, rows) {
      if (err) {
        throw err;
      } else {
        var sql = 'INSERT INTO Menusection VALUES(' + (rows[0].count + 1) +',"' + req.body.name +'")';
        db.run(sql, function(err) {
          if (err) return console.log(err.message);
        });
        res.json({"success": true, "MenuSection": [{"id": rows[0].count + 1,"name": req.body.name}]});
      }
    });
  } else {
    res.sendStatus(400);
  }
})

app.post('/menusection/:id', function(req, res) {
  if (typeof req.body.name === 'string') {
    db.run('UPDATE Menusection SET name = "' + req.body.name + '" WHERE id = ' + req.params.id, function(err) {
      if (err) console.log(err.message);
      else res.json({"success": true, MenuSection: [{"id": req.params.id, "name": req.body.name}]});
    })
  } else {
    res.sendStatus(400);
  }
})

app.delete('/menusection/:id', function(req, res) {
  db.run("DELETE FROM Menusection WHERE id = " + req.params.id, function(err) {
    if (err) console.log(err.message);
    else res.json({"success": true});
  });
})

app.listen(1337, function() {
  console.log("Server starting!")
})
