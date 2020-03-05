const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//entender o formato json
app.use(bodyParser.json());

//entender quando passar parametros via url
app.use(bodyParser.urlencoded({extended: false}));
 
require('./src/controllers/authController')(app);

app.listen(3000);
