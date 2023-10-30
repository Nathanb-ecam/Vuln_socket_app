var express = require('express'); 
let app = express();


app.get('/', function(req,res){
    console.log("cookie",req.query.cookie)
    res.json({"thank":"you"})
});



app.listen(process.env.PORT || 3000, () => { 
   console.log('J ecoute au port 3000 socket');
});