const mongoose = require('mongoose')

const Schema= mongoose.Schema

const userSchema = new Schema({
    username: {
		type: String,
		unique: true,
		uniqueCaseInsensitive: true,
		required: true,
        minLength: 5
	},
    first_name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }

})

module.exports = mongoose.model('User', userSchema)