const mongoose = require('mongoose');

module.exports = mongoose.model('Light', new mongoose.Schema({
    state: Number,
    timestamp: Date
}));