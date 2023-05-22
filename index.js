var express = require('express')
var cors = require('cors')
const mysql = require('mysql2');
require('dotenv').config()
const connection=mysql.createConnection(process.env.DATABASE_URL)

var app = express()
app.use(cors())
app.use(express.json())

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})

app.get('/', (req, res) => {
  console.log("Just got a request!")
  res.send('Yo!')
})

app.get('/courses', function (req, res, next) {
  connection.query(
    'SELECT * FROM `course`',
    function(err, results, fields) {
      res.send(results);
    }
  );
})

app.get('/booking', function (req, res, next) {
  connection.query(
    'SELECT * FROM `booking`',
    function(err, results, fields) {
      res.send(results);
    }
  );
})

app.get('/courses/:ID', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `course` WHERE `ID` = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})

app.post('/courses', function (req, res, next) {
  connection.query(
    'INSERT INTO `course`(`CourseName`, `Detail`, `Amount`, `Price`, `image`) VALUES (?, ?, ?, ?, ?)',
    [req.body.CourseName, req.body.Detail, req.body.Amount, req.body.Price, req.body.image],
    function(err, results) {
      res.json(results);
    }
  );
})


app.put('/courses', function (req, res, next) {
  connection.query(
    'UPDATE `course` SET `CourseName`= ?, `Detail`= ?, `Amount`= ?, `Price`= ?, `image`= ? WHERE ID = ?',
    [req.body.CourseName, req.body.Detail, req.body.Amount, req.body.Price, req.body.image, req.body.ID],
    function(err, results) {
      res.json(results);
    }
  );
})

app.delete('/delete/:ID', function (req, res, next) {
  connection.query(
    'DELETE FROM `booking` WHERE Booking_ID = ?',
    [req.params.ID],
    function(err, results) {
      res.json(results);
    }
  );
})

app.delete('/courses', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'DELETE FROM `course` WHERE ID = ?',
    [req.body.ID],
    function(err, results) {
      res.json(results);
    }
  );
})

app.post('/users', function(request, response) {
  // Capture the input fields
  let Username = request.body.Username;
  let Password = request.body.Password;
  // Ensure the input fields exists and are not empty
  if (Username && Password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('SELECT * FROM user WHERE Username = ? AND Password = ?', [Username, Password], function(error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) throw error;
      // If the account exists
      if (results.length > 0) {
        // Authenticate the user
          //request.session.loggedin = true;
          //request.session.username = username;
        // Redirect to home page
        response.send(results);
      } else {
        response.send('Incorrect Username and/or Password!');
      }
      response.end();
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
}); 

app.post('/Bookings', function (req, res, next) {
  connection.query(
    'INSERT INTO `booking`(`User_Name`, `coursename`, `countcourse`, `Price`) VALUES (?, ?, ?, ?)',
    [req.body.User_Name, req.body.coursename, req.body.countcourse, req.body.Price],
    function(err, results) {
      res.send(err);
    }
  );
})