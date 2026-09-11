const mongoose = require('mongoose');

const connectToMongoDB = async(mongourl) => {
    return mongoose.connect(mongourl);
}

module.exports = {
    connectToMongoDB,
}