const mongoose  = require('mongoose');
const mongoURI = "mongodb://localhost:27017/patrlekh"

const connectToMongo = ()=> {
    mongoose.connect(mongoURI)
        .then(() => console.log('connected to mongo'))
        .catch((err) => console.log('Connection failed'));
}

module.exports = connectToMongo;