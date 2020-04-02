const mongoose = require('mongoose');

//conctar com o banco de dados
mongoose.connect('mongodb://localhost/noderest', 
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,  
    useFindAndModify: false 
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
