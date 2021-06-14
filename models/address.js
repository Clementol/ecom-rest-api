const mongoose = require("mongoose");

const addressSchema = {
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    pinCode: {
        type: String,
        required: true,
        trim: true
    },
    locality: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 100
    },
    address: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 100
    },
    cityDistrictTown: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true
    },
    landMark: {
        type: String,
        min: 10,
        max: 100
    },
    alternatePhone: {
        type: String
    },
    addressType: {
        type: String,
        required: true,
        enum: ['home', 'work'],
        required: true
    }
};

const userAddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: [addressSchema]
}, {timestamps: true})

module.exports = mongoose.model('UserAddress', userAddressSchema);
