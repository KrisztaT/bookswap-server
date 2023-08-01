const mongoose = require('mongoose');

// open database connection
async function databaseConnector(databaseURL){
    await mongoose.connect(databaseURL);
}

//close database connection
async function databaseDisconnector(){
    await mongoose.connection.close();
}

module.exports = {
    databaseConnector,
    databaseDisconnector
}