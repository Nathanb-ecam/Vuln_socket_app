let express = require('express');
let router = express.Router();

const crypto = require('crypto');

router.get('/', function(req, res) {  
    let cookie = crypto.randomBytes(32).toString('hex');
    res.cookie('cookie',cookie)
    res.render('../views/homepage.ejs');
});


module.exports = router;