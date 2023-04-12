const mongoose  = require('mongoose');
const mongoURI = "mongodb+srv://20uec020:MongoDB@cluster0.3m1rigb.mongodb.net/ThinkPad"

const connectToMongo = ()=> {
    mongoose.connect(mongoURI)
        .then(() => console.log('connected to mongo'))
        .catch((err) => console.log('Connection failed', err));
}

module.exports = connectToMongo;