var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

//DB Connection String
var connectionString = 'postgresql://recipebook:redhat237@127.0.0.1:5432/recipebook';

//Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

//Set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req,res) {
  var Client = pg.Client;
  var client = new Client({connectionString});
  client.connect();
  client.query('SELECT * FROM recipes', function (err, result) {
    if (err) {
      return console.error('Error running query', err);
    }
    res.render('index', {recipes: result.rows});
  });
});

app.post('/add', function(req,res) {
  var Client = pg.Client;
  var client = new Client({connectionString});
  client.connect();
  client.query("INSERT INTO recipes(id, name, ingredients, directions) VALUES(3, $1, $2, $3)",
    [req.body.name, req.body.ingredients, req.body.directions]);

    res.redirect('/');
});

app.delete('/delete/:id', function (req,res) {
  var Client = pg.Client;
  var client = new Client({connectionString});
  client.connect();
  client.query("DELETE FROM recipes WHERE id = $1", [req.params.id]);

    res.send(200);
});

app.post('/edit', function (req,res) {
  var Client = pg.Client;
  var client = new Client({connectionString});
  client.connect();
  client.query("UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id = $4",
  [req.body.name, req.body.ingredients, req.body.directions, req.body.id]);

    res.redirect('/');
});

//Server
app.listen(1337, function () {
  console.log('Server started on port 1337');
})
