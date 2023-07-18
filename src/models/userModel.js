const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema= mongoose.Schema

// create user schema object
const userSchema = new Schema({
    username: {
		type: String,
		unique: true,
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


//static join method
userSchema.statics.join = async function(username, first_name, email, password){

    // check if all fields are filled
    if (!username || !first_name || !email || !password ){
        throw Error("All fields must be filled")
    }
    // checking if there is already a user in the database with the same username 
     const usernameExists = await this.findOne({username})
    // checking if there is already a user in the database with the same email address 
    const emailExists = await this.findOne({email})
   
    // throw error if username already exists in the database
    if(usernameExists){
        throw Error("Username is already in use")
    }

    // throw error if email already exists in the database
    if(emailExists){
        throw Error("Email is already in use")
    }
    
    // salting and hashing the password using bcrypt
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Creating a new user object in the database using the Mongoose `create` method.
    const user = await this.create({username, first_name, email, password: hash})

    return user
}

// create login static function
userSchema.statics.login = async function (username, password){

    // check if username and password were provided
    if (!username || !password){
        throw Error("All fields must be filled!")
    }

    // find user in the database based on username
    const user = await this.findOne({username})

    // if username is not in the database throw error
    if(!user){
        throw Error("Incorrect username!")
    }

    // compare provided password with the hashed password
    const match = await bcrypt.compare(password, user.password)

    // if passwords not match throw error
    if(!match){
        throw Error("Incorrect password!")
    }
    
    return user
}

module.exports = mongoose.model('User', userSchema)