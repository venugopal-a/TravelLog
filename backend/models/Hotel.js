const mongoose = require('mongoose');
const HotelSchema = new mongoose.Schema(
    {
        hname: {
            type: String,
            require: true,
            min: 3
        },
        capacity: {
            type: Number,
            require: true
        },
        lat: {
            type: Number,
            require: true
        },
        long:{
            type: Number,
            require: true
        },
        address: {
            type: String
        },
        rating: {
            type: Number,
            require: true,
            min: 0,
            max: 5,
        }
    }
);

module.exports = mongoose.model('Hotel',HotelSchema);