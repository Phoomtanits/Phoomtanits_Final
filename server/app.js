const express = require('express');
const path = require('path');
const body = require('body-parser');
//const app = express();
const mysql = require('mysql');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const app = express();

var httpsServer = https.createServer(credentials, app);

app.use(body());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const db = mysql.createConnection({
    host: '172.30.240.1',
    user: 'Gunn',
    password: '1234',
    database: 'database'
});
// show data
app.get('/data', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT u.* , vt.type FROM users u , vehicle_type vt WHERE u.id_vehicle = vt.id';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
    console.log("after query");
});

// info vetype
app.get('/vetype', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT * FROM vehicle_type';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
    console.log("after query");
});

//delete
app.put('/delete', function(req, res) {
    var sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql,[req.body.idkey],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//edit
app.put('/data', function(req, res) {
    var sql = 'UPDATE users SET firstname = ? , lastname = ? WHERE id = ?';
    db.query(sql,[req.body.firstname,req.body.lastname,req.body.idkey],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//insert
app.post('/data', function(req, res){
    console.log(req.body);
    let data = {
        id:req.body.idkey,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        id_vehicle:req.body.vihecle
    };
    let sql = 'INSERT INTO users SET ?';
    db.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            console.log("ID is Primarykey!!!!!");
            console.log("Enter the id again..");
        }else{
            console.log(result);
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});




//module.exports = app;
module.exports = httpsServer;
