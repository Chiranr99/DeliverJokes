const express = require('express')
const app = express()
const cors = require('cors')
const port = 3003
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password  :'0000',
  database : 'deliver',
  port : 3306
});


async function wait() {
    await connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
 }


app.get('/alljokes', (req, res) => {
    connection.query("SELECT * FROM jokes", function(error, results){
      res.json(results);
    })
  
  })

  app.get('/randomjokes', (req, res) => {
  connection.query('SELECT * FROM jokes ORDER BY RAND() LIMIT 1', function (error, results, fields) {
    if (error) throw error;
    res.json(results[0].joke)
  });
})


app.get('/getalltypes', (req, res) => {
connection.query('SELECT type FROM joketypes', function (error, results, fields) {
  if (error) throw error;
  res.json(results)
});
})

app.post('/data' , async(req, res) => {
  let sql = 'INSERT INTO jokes SET ?'
  let post = {
      type: req.body.type,
      name: req.body.name,
      joke: req.body.joke,
      moderated:1,
      _active:1
  }
  const con = await connection.promise().query(sql, post, (err, res) => {
      if(err) throw err;
      console.log(err);
      
  });
  console.log(con);
  res.send(con)
});

app.listen(port, () => {
  console.log(`listening`)
wait();
})
