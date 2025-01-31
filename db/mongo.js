const mongoose = require('mongoose');
//const { use } = require('../routes');

const clientOptions ={
    dbName : 'Russell'
};

exports.initClientDbConnection = async () => {
    try{
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connection a database reussi');
    }
    catch(error){
        console.log(error);
        throw error;
    }
    }