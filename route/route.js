
var getConnection = require('./mysqlconnection/connection.js');
var path = require('path');

module.exports = function(server){

    server.get('/', function (req, res) {
       sess = req.session; 
       //console.log(sess.nickname);
       if (sess.nickname){
        //res.render('chatRoom', {title : 'chatPage', user : sess.nickname});
        res.redirect('/chatRoom');
       }else{
        res.render('login', {title : 'loginPage'});
       }   
    });

    server.post('/userControl', function (req, res) {
        sess = req.session;

        var email = req.body.email;
        var nickname = req.body.nick;

        var sqlQuery = "select nick from user where mail = ? and nick = ? and durum = 1";
        getConnection.query(sqlQuery, [email, nickname], function(error, results, fields){
            if (error){
                console.log(error);
                //res.json({sonuc:'false'});
                //res.render('login', {title : 'loginPage'});
            }else{
                if (results.length == 1 && results[0].nick == nickname){
                    sess.nickname = nickname;    
                }
                
            }
            res.redirect('/');
        });

    });

    server.get('/chatRoom', function (req, res){
        //res.send('chatodası');
        //res.sendFile(__dirname+"/views/chatroom.html");
        res.sendFile(path.join(__dirname, '../views', 'chatroom.html'));
    });

    server.get('/messageList', function (req, res) {
        var from = req.query.from;
        var to = req.query.to

        var sqlQuery = "SELECT `message`, `from`, `to`, `zaman` from message where ( `from` = ? and `to` = ? ) or ( `from` = ? and `to` = ? ) order by zaman asc";

        var returnData = [];

        getConnection.query(sqlQuery, [from, to, to, from], function(error, results, fields){
            if (error){
                console.log(error);
                res.json({sonuc:'false'});
            }else{
                for (var i=0; i<results.length; i++){
                    returnData.push({from:results[i].from, to:results[i].to, time:results[i].zaman, message:results[i].message});
                }
                res.json({sonuc:returnData});
            }
        });
    });

    server.get('/contactList', function (req, res){
        var from = req.query.from;
        var sqlQuery = "select `to` from connect where `from` = ?";

        var returnContact = [];
        getConnection.query(sqlQuery, [from], function(error, results, fields){
            if (error){
                console.log(error);
                res.json({sonuc:'false'});
            }else{
                for (var i=0; i<results.length; i++){
                    returnContact.push({to:results[i].to});
                }
                res.json({sonuc:returnContact});
            }
        });
    });

    server.get('/messageAdd', function (req, res) {
        var message = req.query.message;
        var from = req.query.from;
        var to = req.query.to;
        var unixTimeStamp = Date.now();
        
        var sqlQuery = "INSERT INTO message SET ?";
        var get = {message:message, from:from, to:to, zaman:unixTimeStamp};

        getConnection.query(sqlQuery, get, function (error, results, fields) {
            if (error){
                res.json({sonuc:'false'});
            }else{
                res.json({sonuc:'true'});
            }
        });
    });

    server.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
          if(err) {
            console.log(err);
          } else {
            res.redirect('/');
          }
        });
    });

    server.get('/checkSession', function (req, res) {
       sess = req.session; 
       //console.log(sess.nickname);
       if (sess.nickname){
        res.json({session : true, nick : sess.nickname});
       }else{
        res.json({session : false, nick : 'notSession'});
       }
    });

}