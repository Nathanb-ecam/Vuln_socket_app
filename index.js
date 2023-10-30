var express = require('express'); 
let app = express();


const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());

//Middleware; css/img/js
app.use(express.static('public'));

//Prépa queries
//USING TTL : time to live :: si dépassé ciau le message pouf pouf disparu asta la vista
//pas d'auto-incrmeent sur cassandra

const querySelect = "SELECT * FROM messages LIMIT 10 ;"; 
const queryInsert = 'INSERT INTO messages (sender, message) VALUES (?,?);'; 
let tempMessages = {};
let connection = require('./db.js');

//Server
var server = require("http").Server(app);
var io = require("socket.io")(server); 

//Routes
let routes = require('./routes');
app.use('/', routes);

//Socket
io.on("connection", function(socket) {
    console.log("Client connected: " + socket.id);
    console.log('Reading db ...');
    socket.send({"user":"server","content":"Reading db ..."})

    connection.query(`SELECT * FROM Message;`, function(error,result){
        if(error!=undefined){
            console.log('Error:',error);
        }else{
            // console.log("connection",result)
            result.forEach((row)=>{
                sender = row.sender;
                content = row.message;
                socket.send({"user":sender,"content":content})

            })
        }
    });





    socket.on("disconnect", async function() {
        //Quand un client se déconecte on rajoute ses elements ds la db
        // => plusieurs element identique peuvent se trouver ds la db....
        console.log(socket.id + " disconnected");
        try {
            io.emit('message',{"user": tempMessages[socket.id].user,"content":"just disconnected ..."});
        } catch {
            console.log("restart");
        }
    });



    socket.on('message', async function(message) {
        let user = message.user;
        let content = message.content;
        console.log("Message : " + content);
        // tempMessages[socket.id]={"user":user,"content":content};
        if (content==""){
            console.log(user + " is now connected");
            io.emit('message',{"user":user,"content":"is now connected ..."})
        } 
        else{
            io.emit('message', {"user":user, "content":content});
            tempMessages[socket.id] = {"user":user,"content":content};
            // console.log("Prob", user);


            console.log('MESSAGE TO STORE',content)

            // connection.query(`INSERT INTO message (sender,message) VALUES ("${user}","${content}" )`, function(error,result){
            //     if(error){
            //         console.log(error);
            //     }else{
                    
            //         // res.render('forum.ejs',{messages:latestMessages});
            //         console.log('Message registered in db ');
            //     }
            // });

        }
    });

    socket.on('onload', function(e) {
        console.log("new client lets show him the past");


        // connection.query(`SELECT * FROM Message;`, function(error,result){
        //     if(error!=undefined){
        //         console.log('Error:',error);
        //     }else{
        //         console.log("onload",result.rows);
        //         for (var i = 0; i < result.rows.length; i++) {
        //             message = result.rows.messages[i].message;
        //             io.emit('onload', {"user":message.sender,"content":message.message})
        //         }
        //     }
        // });


    });
});

server.listen(process.env.PORT || 8000, () => { 
   console.log('J ecoute au port 8000 socket');
});